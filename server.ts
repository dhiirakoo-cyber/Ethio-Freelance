/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { ServerDB } from "./src/server-db";
import { 
  UserRole, 
  User, 
  FreelancerProfile, 
  ClientProfile, 
  Job, 
  Proposal, 
  ProjectContract, 
  Message, 
  ChatRoom, 
  Review, 
  NotificationItem, 
  EscrowTransaction, 
  SystemStats 
} from "./src/types";

// Lazy initialize the Gemini Client with the system secrets
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiInstance;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to authenticate requests and retrieve role
function authenticateUser(req: Request): { userId: string; role: UserRole; email: string; displayName: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token.startsWith("user-id:")) {
      const userId = token.replace("user-id:", "");
      const db = ServerDB.read();
      const matched = db.users.find((u) => u.id === userId);
      if (matched) {
        return { userId: matched.id, role: matched.role, email: matched.email, displayName: matched.displayName };
      }
    }
  }
  return null;
}

// ==========================================
// REST AUTH ENDPOINTS
// ==========================================

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { email, password, displayName, role, languages } = req.body;
  if (!email || !password || !displayName || !role) {
    res.status(400).json({ error: "Email, password, name, and role are required." });
    return;
  }

  const existing = ServerDB.getUserByEmail(email);
  if (existing.user) {
    res.status(400).json({ error: "An account with this email already exists." });
    return;
  }

  const userId = "u-" + Math.random().toString(36).substr(2, 9);
  const newUser: User = {
    id: userId,
    email: email.toLowerCase(),
    displayName,
    role: role as UserRole,
    createdAt: new Date().toISOString(),
    avatarUrl: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? "1507003211169-0a1dd7228f2d" : "1494790108377-be9c29b29330"}?auto=format&fit=crop&q=80&w=200`,
    isPremium: false,
    isVerified: false,
    languages: languages || ["English"]
  };

  ServerDB.createUser(newUser, password);
  const token = `user-id:${userId}`;

  res.status(201).json({
    token,
    user: newUser,
  });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const { user, password: savedPassword } = ServerDB.getUserByEmail(email);
  if (!user || savedPassword !== password) {
    res.status(401).json({ error: "Invalid email or password credentials." });
    return;
  }

  const token = `user-id:${user.id}`;
  res.json({
    token,
    user,
  });
});

app.get("/api/auth/me", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Session expired or authentication invalid." });
    return;
  }
  const db = ServerDB.read();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  res.json(user);
});

// ==========================================
// JOBS MARKETPLACE
// ==========================================

app.get("/api/jobs", (req: Request, res: Response) => {
  const db = ServerDB.read();
  res.json(db.jobs);
});

app.post("/api/jobs", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.CLIENT) {
    res.status(403).json({ error: "Only client accounts can post jobs." });
    return;
  }

  const { title, description, category, skillsRequired, budgetType, budgetMin, budgetMax } = req.body;
  if (!title || !description || !category || !skillsRequired) {
    res.status(400).json({ error: "Missing required job information details." });
    return;
  }

  const db = ServerDB.read();
  const clientProfile = db.clients.find((c) => c.userId === session.userId);

  const newJob: Job = {
    id: "j-" + Math.random().toString(36).substr(2, 9),
    clientUserId: session.userId,
    clientName: session.displayName,
    clientCompany: clientProfile?.companyName,
    title,
    description,
    category,
    skillsRequired,
    budgetType: budgetType || "fixed",
    budgetMin: Number(budgetMin) || 0,
    budgetMax: Number(budgetMax) || 0,
    status: "open",
    isFeatured: false,
    proposalsCount: 0,
    createdAt: new Date().toISOString()
  };

  db.jobs.unshift(newJob);
  
  if (clientProfile) {
    clientProfile.activeJobsCount += 1;
  }

  // Push audit logs
  db.notifications.unshift({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: session.userId,
    title: "Job Posted Successfully",
    message: `Your job posting '${title}' is live. Awaiting freelancer proposals.`,
    type: "success",
    read: false,
    createdAt: new Date().toISOString()
  });

  ServerDB.write(db);
  res.status(201).json(newJob);
});

// ==========================================
// PROPOSAL SYSTEM
// ==========================================

app.get("/api/jobs/:jobId/proposals", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Authorization required" });
    return;
  }

  const db = ServerDB.read();
  const list = db.proposals.filter((p) => p.jobId === req.params.jobId);
  res.json(list);
});

app.post("/api/jobs/:jobId/proposals", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.FREELANCER) {
    res.status(403).json({ error: "Only freelancers can submit job proposals." });
    return;
  }

  const { coverLetter, bidAmount, deliveryDays, aiGeneratedTag } = req.body;
  if (!coverLetter || !bidAmount || !deliveryDays) {
    res.status(400).json({ error: "Please enter bid amount, delivery timeline and cover letter." });
    return;
  }

  const db = ServerDB.read();
  const job = db.jobs.find((j) => j.id === req.params.jobId);
  if (!job) {
    res.status(404).json({ error: "Associated job not found." });
    return;
  }

  const existingProp = db.proposals.find(p => p.jobId === job.id && p.freelancerUserId === session.userId);
  if (existingProp) {
    res.status(400).json({ error: "You have already submitted a proposal for this job." });
    return;
  }

  const freelancer = db.freelancers.find((f) => f.userId === session.userId);

  const newProp: Proposal = {
    id: "prop-" + Math.random().toString(36).substr(2, 9),
    jobId: job.id,
    freelancerUserId: session.userId,
    freelancerName: session.displayName,
    freelancerTitle: freelancer?.title || "Freelancer Professional",
    freelancerAvatar: freelancer?.userId ? db.users.find(u => u.id === freelancer.userId)?.avatarUrl || "" : "",
    coverLetter,
    bidAmount: Number(bidAmount),
    deliveryDays: Number(deliveryDays),
    status: "pending",
    aiGeneratedTag: !!aiGeneratedTag,
    createdAt: new Date().toISOString()
  };

  db.proposals.push(newProp);
  job.proposalsCount += 1;

  // Let the client know
  db.notifications.unshift({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: job.clientUserId,
    title: "Marii Haaraa! New Proposal Received",
    message: `${session.displayName} submitted a proposal for '${job.title}' with bid ${Number(bidAmount).toLocaleString()} ETB.`,
    type: "info",
    read: false,
    createdAt: new Date().toISOString()
  });

  ServerDB.write(db);
  res.status(201).json(newProp);
});

// Accept Proposal & Start Contract
app.post("/api/proposals/:propId/accept", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.CLIENT) {
    res.status(403).json({ error: "Only clients can hire." });
    return;
  }

  const db = ServerDB.read();
  const proposal = db.proposals.find((p) => p.id === req.params.propId);
  if (!proposal) {
    res.status(404).json({ error: "Proposal not found." });
    return;
  }

  const job = db.jobs.find((j) => j.id === proposal.jobId);
  if (!job) {
    res.status(404).json({ error: "Job posting not found." });
    return;
  }

  if (job.clientUserId !== session.userId) {
    res.status(403).json({ error: "Unauthorized access." });
    return;
  }

  // Accept proposal
  proposal.status = "accepted";
  job.status = "in_progress";

  // Decline other proposals
  db.proposals.forEach((p) => {
    if (p.jobId === job.id && p.id !== proposal.id) {
      p.status = "declined";
    }
  });

  // Create Contract
  const contractId = "cont-" + Math.random().toString(36).substr(2, 9);
  const contract: ProjectContract = {
    id: contractId,
    jobId: job.id,
    jobTitle: job.title,
    clientUserId: session.userId,
    clientName: session.displayName,
    freelancerUserId: proposal.freelancerUserId,
    freelancerName: proposal.freelancerName,
    totalBudget: proposal.bidAmount,
    status: "active",
    escrowStatus: "funded", // In simulated payment, client triggers funding
    milestones: [
      {
        id: "m-" + Math.random().toString(36).substr(2, 5),
        title: "Phase 1 Delivery & Launch Tasks",
        amount: Math.round(proposal.bidAmount * 0.5),
        status: "funded",
        dueDate: new Date(Date.now() + 5*24*60*60*1000).toISOString().split("T")[0]
      },
      {
        id: "m-" + Math.random().toString(36).substr(2, 5),
        title: "Final Review & Handover",
        amount: Math.round(proposal.bidAmount * 0.5),
        status: "pending",
        dueDate: new Date(Date.now() + 10*24*60*60*1000).toISOString().split("T")[0]
      }
    ],
    createdAt: new Date().toISOString()
  };

  db.projects.push(contract);

  // Escrow Transaction creation
  db.transactions.unshift({
    id: "tx-" + Math.random().toString(36).substr(2, 9),
    projectId: contractId,
    projectTitle: job.title,
    amount: proposal.bidAmount,
    paymentGateway: "Telebirr",
    txRef: "telebirr_" + Math.random().toString(36).substr(2, 9),
    type: "deposit",
    status: "completed",
    createdAt: new Date().toISOString()
  });

  // Notify Freelancer
  db.notifications.unshift({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: proposal.freelancerUserId,
    title: "Hojii Haaraa Siphachne! Hired!",
    message: `${session.displayName} accepted your proposal for '${job.title}' and funded the Escrow!`,
    type: "success",
    read: false,
    createdAt: new Date().toISOString()
  });

  ServerDB.write(db);
  res.json({ success: true, contract });
});

// ==========================================
// FREELANCER PROFILES & RATINGS
// ==========================================

app.get("/api/freelancers", (req: Request, res: Response) => {
  const db = ServerDB.read();
  // Map users avatar and names with profiles
  const payload = db.freelancers.map(f => {
    const user = db.users.find(u => u.id === f.userId);
    return {
      ...f,
      displayName: user?.displayName || "Freelancer Professional",
      avatarUrl: user?.avatarUrl || "",
      isVerified: user?.isVerified || false,
      isPremium: user?.isPremium || false,
      languages: user?.languages || ["English"]
    };
  });
  res.json(payload);
});

app.get("/api/freelancers/me", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.FREELANCER) {
    res.status(403).json({ error: "Freelancer profile required." });
    return;
  }
  const db = ServerDB.read();
  let item = db.freelancers.find(f => f.userId === session.userId);
  if (!item) {
    // Generate lazily
    item = {
      id: "fls-" + Math.random().toString(36).substr(2, 9),
      userId: session.userId,
      title: "Senior Technical Builder",
      bio: "Provide your biography details here.",
      skills: ["React"],
      hourlyRate: 400,
      experience: [],
      education: [],
      portfolio: [],
      ratingAverage: 5.0,
      totalReviews: 0,
      completedProjects: 0,
      earningsETB: 0,
      isFeatured: false
    };
    db.freelancers.push(item);
    ServerDB.write(db);
  }
  res.json(item);
});

app.put("/api/freelancers/me", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.FREELANCER) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  const db = ServerDB.read();
  const index = db.freelancers.findIndex(f => f.userId === session.userId);
  if (index === -1) {
    res.status(404).json({ error: "Freelancer Profile not found." });
    return;
  }

  db.freelancers[index] = {
    ...db.freelancers[index],
    ...req.body,
    userId: session.userId // Guard
  };

  ServerDB.write(db);
  res.json(db.freelancers[index]);
});

// ==========================================
// ESCROW / PAYMENT SYSTEMS
// ==========================================

app.get("/api/contracts", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }

  const db = ServerDB.read();
  const list = db.projects.filter(p => p.clientUserId === session.userId || p.freelancerUserId === session.userId);
  res.json(list);
});

// Fund milestone (Client pays to escrow)
app.post("/api/contracts/:id/milestones/:mId/fund", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.CLIENT) {
    res.status(403).json({ error: "Only client can fund milestones." });
    return;
  }

  const db = ServerDB.read();
  const contract = db.projects.find(p => p.id === req.params.id);
  if (!contract || contract.clientUserId !== session.userId) {
    res.status(404).json({ error: "Contract not found." });
    return;
  }

  const milestone = contract.milestones.find(m => m.id === req.params.mId);
  if (!milestone) {
    res.status(404).json({ error: "Milestone not found." });
    return;
  }

  milestone.status = "funded";
  contract.escrowStatus = "funded";

  // Simulate gateway transaction log
  db.transactions.unshift({
    id: "tx-" + Math.random().toString(36).substr(2, 9),
    projectId: contract.id,
    projectTitle: contract.jobTitle,
    amount: milestone.amount,
    paymentGateway: req.body.gateway || "Chapa",
    txRef: "chapa_ref_" + Math.random().toString(36).substr(2, 9),
    type: "deposit",
    status: "completed",
    createdAt: new Date().toISOString()
  });

  // Notify freelancer
  db.notifications.unshift({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: contract.freelancerUserId,
    title: "Milestone Funded!",
    message: `${session.displayName} funded '${milestone.title}' (${milestone.amount} ETB). You can proceed working safely!`,
    type: "success",
    read: false,
    createdAt: new Date().toISOString()
  });

  ServerDB.write(db);
  res.json({ success: true, contract });
});

// Release milestone payment (Client release to freelancer)
app.post("/api/contracts/:id/milestones/:mId/release", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.CLIENT) {
    res.status(403).json({ error: "Only clients can release milestone payments." });
    return;
  }

  const db = ServerDB.read();
  const contract = db.projects.find(p => p.id === req.params.id);
  if (!contract || contract.clientUserId !== session.userId) {
    res.status(404).json({ error: "Contract not found." });
    return;
  }

  const milestone = contract.milestones.find(m => m.id === req.params.mId);
  if (!milestone) {
    res.status(404).json({ error: "Milestone not found." });
    return;
  }

  milestone.status = "released";

  // Track freelancer earnings
  const freelancer = db.freelancers.find(f => f.userId === contract.freelancerUserId);
  if (freelancer) {
    freelancer.earningsETB += milestone.amount;
  }

  // Transaction statement
  db.transactions.unshift({
    id: "tx-" + Math.random().toString(36).substr(2, 9),
    projectId: contract.id,
    projectTitle: contract.jobTitle,
    amount: milestone.amount,
    paymentGateway: "Bank Transfer",
    txRef: "release_ref_" + Math.random().toString(36).substr(2, 9),
    type: "release",
    status: "completed",
    createdAt: new Date().toISOString()
  });

  // Let's see if all milestones are released to complete the contract
  const allReleased = contract.milestones.every(m => m.status === "released");
  if (allReleased) {
    contract.status = "completed";
    contract.escrowStatus = "released";
    contract.completedAt = new Date().toISOString();

    const job = db.jobs.find(j => j.id === contract.jobId);
    if (job) job.status = "completed";

    if (freelancer) freelancer.completedProjects += 1;
  }

  // Notify Freelancer
  db.notifications.unshift({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: contract.freelancerUserId,
    title: "Kaffaltii Milestones! Released!",
    message: `Milestone '${milestone.title}' payment of ${milestone.amount} ETB has been released to your registered account!`,
    type: "success",
    read: false,
    createdAt: new Date().toISOString()
  });

  ServerDB.write(db);
  res.json({ success: true, contract });
});

// ==========================================
// REAL-TIME DIRECT MESSAGES
// ==========================================

app.get("/api/chats", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Log in required." });
    return;
  }
  const db = ServerDB.read();
  const list = db.chats.filter(c => c.participantA.id === session.userId || c.participantB.id === session.userId);
  res.json(list);
});

app.get("/api/messages/:chatId", (req: Request, res: Response) => {
  const db = ServerDB.read();
  const list = db.messages.filter(m => m.chatId === req.params.chatId);
  res.json(list);
});

app.post("/api/messages", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Log in required." });
    return;
  }

  const { chatId, content, receiverId, receiverName, jobId, jobTitle } = req.body;
  if (!content) {
    res.status(400).json({ error: "Missing message body content." });
    return;
  }

  const db = ServerDB.read();
  let activeChatId = chatId;

  if (!activeChatId && receiverId) {
    // Check if chat already exists
    const existing = db.chats.find(c => 
      (c.participantA.id === session.userId && c.participantB.id === receiverId) ||
      (c.participantA.id === receiverId && c.participantB.id === session.userId)
    );

    if (existing) {
      activeChatId = existing.id;
    } else {
      activeChatId = "chat-" + Math.random().toString(36).substr(2, 9);
      const newChat: ChatRoom = {
        id: activeChatId,
        jobId,
        jobTitle,
        participantA: {
          id: session.userId,
          name: session.displayName,
          avatar: db.users.find(u => u.id === session.userId)?.avatarUrl || "",
          role: session.role
        },
        participantB: {
          id: receiverId,
          name: receiverName,
          avatar: db.users.find(u => u.id === receiverId)?.avatarUrl || "",
          role: db.users.find(u => u.id === receiverId)?.role || UserRole.FREELANCER
        },
        lastMessage: content,
        updatedAt: new Date().toISOString()
      };
      db.chats.push(newChat);
    }
  }

  const newMessage: Message = {
    id: "msg-" + Math.random().toString(36).substr(2, 9),
    chatId: activeChatId,
    senderId: session.userId,
    senderName: session.displayName,
    content,
    createdAt: new Date().toISOString()
  };

  db.messages.push(newMessage);

  const chat = db.chats.find(c => c.id === activeChatId);
  if (chat) {
    chat.lastMessage = content;
    chat.updatedAt = new Date().toISOString();
  }

  // Push immediate badge alert to the receiver if they are registered
  if (receiverId) {
    db.notifications.unshift({
      id: "notif-" + Math.random().toString(36).substr(2, 9),
      userId: receiverId,
      title: "Marii Haaraa! New Message",
      message: `${session.displayName}: ${content.substring(0, 45)}${content.length > 45 ? "..." : ""}`,
      type: "info",
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  ServerDB.write(db);
  res.status(201).json(newMessage);
});

// ==========================================
// REVIEWS & FEEDBACKS
// ==========================================

app.post("/api/reviews", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Log in required." });
    return;
  }

  const { revieweeId, rating, comment, projectId } = req.body;
  if (!revieweeId || !rating || !comment) {
    res.status(400).json({ error: "Missing rating count or comments description." });
    return;
  }

  const db = ServerDB.read();
  
  const newReview: Review = {
    id: "rev-" + Math.random().toString(36).substr(2, 9),
    reviewerId: session.userId,
    reviewerName: session.displayName,
    reviewerAvatar: db.users.find(u => u.id === session.userId)?.avatarUrl || "",
    revieweeId,
    projectId: projectId || "manual",
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };

  db.reviews.push(newReview);

  // Recalculate average rating of reviewee
  const freelancer = db.freelancers.find(f => f.userId === revieweeId);
  if (freelancer) {
    const allReviews = db.reviews.filter(r => r.revieweeId === revieweeId);
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    freelancer.totalReviews = allReviews.length;
    freelancer.ratingAverage = Number((sum / allReviews.length).toFixed(1));
  }

  db.notifications.unshift({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: revieweeId,
    title: "Gamaggama Haaraa! New Review Received",
    message: `${session.displayName} rated you ${rating}/5: "${comment.substring(0, 30)}..."`,
    type: "success",
    read: false,
    createdAt: new Date().toISOString()
  });

  ServerDB.write(db);
  res.status(201).json(newReview);
});

app.get("/api/reviews/:userId", (req: Request, res: Response) => {
  const db = ServerDB.read();
  const list = db.reviews.filter(r => r.revieweeId === req.params.userId || r.reviewerId === req.params.userId);
  res.json(list);
});

// ==========================================
// NOTIFICATIONS
// ==========================================

app.get("/api/notifications", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Authorization required" });
    return;
  }
  const db = ServerDB.read();
  const userNotifs = db.notifications.filter(n => n.userId === session.userId);
  res.json(userNotifs);
});

app.post("/api/notifications/read", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Authorization required" });
    return;
  }
  const db = ServerDB.read();
  db.notifications.forEach(n => {
    if (n.userId === session.userId) {
      n.read = true;
    }
  });
  ServerDB.write(db);
  res.json({ success: true });
});

// ==========================================
// TRANSACTION TRACING
// ==========================================

app.get("/api/transactions", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }

  const db = ServerDB.read();
  // Filter transactions based on client or freelancer project
  const userProjectIds = db.projects
    .filter(p => p.clientUserId === session.userId || p.freelancerUserId === session.userId)
    .map(p => p.id);

  const list = db.transactions.filter(t => userProjectIds.includes(t.projectId));
  res.json(list);
});

// ==========================================
// ADMIN MODULES
// ==========================================

app.get("/api/admin/stats", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.ADMIN) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  const db = ServerDB.read();
  const totalVolume = db.transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  res.json({
    usersCount: db.users.length,
    freelancersCount: db.freelancers.length,
    clientsCount: db.clients.length,
    jobsCount: db.jobs.length,
    totalVolumeETB: totalVolume,
    revenueCollectedETB: Math.round(totalVolume * 0.05), // Simulated 5% commission fee
    users: db.users.map(u => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      createdAt: u.createdAt,
      isPremium: u.isPremium,
      isVerified: u.isVerified
    }))
  });
});

app.post("/api/admin/verify-user", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.ADMIN) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  const { targetUserId, verify } = req.body;
  const db = ServerDB.read();
  const user = db.users.find(u => u.id === targetUserId);

  if (user) {
    user.isVerified = !!verify;
    
    // Add custom system notification alert
    db.notifications.unshift({
      id: "notif-" + Math.random().toString(36).substr(2, 9),
      userId: targetUserId,
      title: verify ? "Account Verified!" : "Verification Updated",
      message: verify 
        ? "Congratulations! HojiiLink administration has verified your profile. A verification checkmark has been added next to your professional details." 
        : "Your verification status was processed or modified by HojiiLink admins.",
      type: "success",
      read: false,
      createdAt: new Date().toISOString()
    });

    ServerDB.write(db);
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: "User profile target not found." });
  }
});

app.post("/api/admin/premium-user", (req: Request, res: Response) => {
  const session = authenticateUser(req);
  if (!session || session.role !== UserRole.ADMIN) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  const { targetUserId, isPremium } = req.body;
  const db = ServerDB.read();
  const user = db.users.find(u => u.id === targetUserId);

  if (user) {
    user.isPremium = !!isPremium;
    ServerDB.write(db);
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: "User not found." });
  }
});

// ==========================================
// GEMINI INTELLIGENT ROUTINGS
// ==========================================

// Helper of static translation fallback
const OFFLINE_TRANSLATIONS: Record<string, string> = {
  "seeni": "Login",
  "galmaa'i": "Register",
  "hojii maxxansi": "Post a Job",
  "freelancer barbaadi": "Find Freelancers",
  "baga gassan": "Welcome",
  "akkam jirtu": "How are you",
  "hojii": "Job / Work",
  "horii": "Money",
  "gurgurtaa": "Sales",
  "lakkoofsa bilbilaa": "Phone number",
  "bira": "With / Near",
  "gargaarsa": "Help / Support",
  "galmeessa": "Registration / Records",
  "bulchiinsa": "Administration / Management",
  "mindaa": "Salary / Hourly Rate",
  "koreewwan": "Committees / Categories",
  "eessaa": "Where",
  "gabaa": "Marketplace"
};

// 1. Translation System English <-> Afaan Oromo
app.post("/api/gemini/translate", async (req: Request, res: Response) => {
  const { text, targetLang } = req.body; // targetLang: 'English' | 'Afaan Oromo'
  if (!text) {
    res.status(400).json({ error: "Text is empty." });
    return;
  }

  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are an elite linguistic expert specialized in East African languages, focusing heavily on Afaan Oromo (Oromo language) and English.
      Translate the following input text accurately into the target language. Preserve local Ethiopian professional context, greeting terms, and friendly business tones. Do not translate code syntax, HTML tags, or formatting markup.
      
      Input Text: "${text}"
      Target Language: ${targetLang}
      
      Output ONLY the direct translated string without any conversational filler or markdown quotes.`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      const out = aiRes.text?.trim() || "";
      res.json({ text: out, source: "gemini" });
      return;
    } catch (err) {
      console.error("Gemini Translation failed, using local dictionary matches:", err);
    }
  }

  // Smart Offline fallback search
  const lowerText = text.trim().toLowerCase();
  let result = text;
  if (targetLang === "English") {
    // translate from Afaan Oromo to English
    for (const [oromoVal, engVal] of Object.entries(OFFLINE_TRANSLATIONS)) {
      if (lowerText.includes(oromoVal)) {
        result = engVal;
        break;
      }
    }
  } else {
    // English to Afaan Oromo
    for (const [oromoVal, engVal] of Object.entries(OFFLINE_TRANSLATIONS)) {
      if (lowerText.includes(engVal.toLowerCase())) {
        result = oromoVal;
        break;
      }
    }
    if (result === text) {
      result = `${text} (Translated)`;
    }
  }

  res.json({ text: result, source: "offline-dictionary" });
});

// 2. Job Description Generator
app.post("/api/gemini/generate-job-desc", async (req: Request, res: Response) => {
  const { title, category, keyPoints } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title is required." });
    return;
  }

  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are a professional HR specialist and recruiting editor. Generately a compelling, comprehensive job description for:
      Job Title: ${title}
      Category: ${category}
      Key Points to Mention: ${keyPoints || "Expert execution, remote delivery, budget focus"}

      The job description MUST include:
      1. Job Overview (Ethiopian context friendly)
      2. Key Responsibilities
      3. Required Technical Skills
      4. Standard Deliverables & Schedule
      
      Output the description in a clean markdown format (do not wrap in block markdown quotes except structural headings)`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ text: aiRes.text });
      return;
    } catch (err) {
      console.error(err);
    }
  }

  // Fallback
  res.json({
    text: `### Job Overview\nWe are looking for a skilled **${title}** of ${category} to join our project team. This is a contract role suited for remote freelancers in Ethiopia.\n\n### Key Responsibilities\n- Deliver high quality results on or before stated deadlines\n- Collaborate with client stakeholders to meet requirements: ${keyPoints || "Quality delivery"}\n\n### Required Skills\n- Certified professional capability\n- Strong self-discipline and communicative clarity`
  });
});

// 3. Proposal Draft Generator
app.post("/api/gemini/generate-proposal", async (req: Request, res: Response) => {
  const { jobTitle, jobDesc, skills, bio } = req.body;
  
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are an elite freelance consultant writing a winning bid cover letter.
      Target Job Title: ${jobTitle}
      Job description: ${jobDesc}
      My freelancer skills: ${skills || "Web development"}
      My bio details: ${bio || "Experienced engineer"}
      
      Draft a persuasive, professional client-ready proposal letter (approx 200 words). Highlighting past successes, understanding of the requirements, and professional cooperative tone. Use Ethiopia-local greetings like 'Akkam jirtu' or 'Selam' where appropriate.
      
      Reply with the pure letter, no surrounding quotes or conversational meta.`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ text: aiRes.text });
      return;
    } catch (err) {
      console.error(err);
    }
  }

  res.json({
    text: `Akkam jirtu! I am pleased to offer my credentials for your project: '${jobTitle}'. Supported by my background in ${skills}, I can ensure smooth, on-time technical results. Let's arrange a chat to outline my exact strategy. Galatooma!`
  });
});

// 4. CV & Portfolio suggestions
app.post("/api/gemini/cv-check", async (req: Request, res: Response) => {
  const { title, skills, bio, experience } = req.body;
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are a Senior Career Coach. Review this freelancer's data profile and offer 4 short, highly tactical recommendations to improve their CV/resumé:
      Professional Title: ${title}
      Bio: ${bio}
      Skills: ${skills}
      Experience: ${experience ? JSON.stringify(experience) : "None registered"}
      
      Focus checklist improvement on clarity, tech stack precision, and regional premium placement. Return clean markdown.`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ text: aiRes.text });
      return;
    } catch (err) {
      console.error(err);
    }
  }
  res.json({
    text: `### CV Improvement Tips\n1. **Inject Metric Metrics**: quantifiably define completed web load speeds or sales conversions.\n2. **Organize Stack**: group languages and framework competencies explicitly.\n3. **Refine Hourly Rates**: calibrate pricing based on actual market benchmarks in Addis Ababa.`
  });
});

app.post("/api/gemini/portfolio-check", async (req: Request, res: Response) => {
  const { portfolio } = req.body;
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Analyze this digital portfolio summary list. Advise on formatting, presentation, and image details:
      Portfolio: ${JSON.stringify(portfolio)}
      Give 3 action items to make it Fiverr/Upwork enterprise-level.`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ text: aiRes.text });
      return;
    } catch (err) {
      console.error(err);
    }
  }
  res.json({ text: `### Portfolio Enhancements\n- Highlight actual screenshots or secure links of running live systems.\n- Add clear list of client challenge, implementation strategy, and final results achieved.` });
});

// 5. Skill recommendation based on target goal
app.post("/api/gemini/skills-recommend", async (req: Request, res: Response) => {
  const { currentSkills, targetRole } = req.body;
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `My current skills are: ${currentSkills}.
      My target freelance role index is: ${targetRole || "Mobile app engineer in Horn of Africa"}.
      Recommend 5 modern highly lucrative tech skills, tutorials or certification pathways to pursue next. Return clean list.`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ text: aiRes.text });
      return;
    } catch (err) {
      console.error(err);
    }
  }
  res.json({ text: `- Modern TypeScript & ESNext\n- AWS / Cloud Architecture Essentials\n- Payment gateways integration hooks (Chapa API and Telebirr setup)` });
});

// 6. AI Project Cost Estimator
app.post("/api/gemini/cost-estimate", async (req: Request, res: Response) => {
  const { scope, complexity, devDays } = req.body;
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Provide an interactive cost estimation matrix in Ethiopian Birr (ETB) and USD:
      Project Scope: ${scope}
      Complexity descriptor: ${complexity || "Medium"}
      Estimated timelines: ${devDays || "10"} working days
      
      Explain hourly resource price brackets in East Africa and list overall estimated cost breakdown.`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ text: aiRes.text });
      return;
    } catch (err) {
      console.error(err);
    }
  }
  res.json({ text: `### Cost Estimation (Offline Standard Model)\n- **Timeline**: ${devDays} Days\n- **Rate Bracket**: 400 - 900 ETB / hour\n- **Total Project Cost**: approx. 25,000 - 45,000 ETB (depending on exact integrations required).` });
});

// 7. AI Interview Questions list generator
app.post("/api/gemini/interview-questions", async (req: Request, res: Response) => {
  const { roleTitle, keyTopics } = req.body;
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Generate 6 smart interview questions (with short ideal answers) to test a freelancer applying for:
      Role Title: ${roleTitle}
      Critical technical topics: ${keyTopics || "Modern architectures"}
      Make questions highly selective and industry standard.`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ text: aiRes.text });
      return;
    } catch (err) {
      console.error(err);
    }
  }
  res.json({ text: `### Technical Interview Questions\n1. Explain state management strategies across concurrent clients.\n2. How do you implement robust transactional integrity inside PostgreSQL databases?` });
});

// 8. AI Freelancer and Job Matching engine
app.post("/api/gemini/match-freelancer", async (req: Request, res: Response) => {
  const { jobInfo, freelancerInfo } = req.body;
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Compare this Freelancer profile with the Posted Job details and perform an intelligent compatibility audit rating from 0% to 100%:
      
      Job Details: ${JSON.stringify(jobInfo)}
      Freelancer Skills & Bio: ${JSON.stringify(freelancerInfo)}
      
      Provide your response in JSON format conforming to this representation model:
      {
        "compatibilityScore": 85,
        "matchingStrengths": ["Strength A", "Strength B"],
        "gapAlerts": ["Areas for improvement A"],
        "hiringRecommendation": "A detailed 1-sentence recommendation letter suggestion."
      }`;

      const aiRes = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(aiRes.text || "{}");
      res.json(parsed);
      return;
    } catch (err) {
      console.error(err);
    }
  }

  // Fallback Matching calculation
  res.json({
    compatibilityScore: 78,
    matchingStrengths: ["Strong communication skills", "Ethiopia regional technical alignment"],
    gapAlerts: ["Exact frameworks duration mismatch"],
    hiringRecommendation: "Highly recommended freelancer matching current task requirements."
  });
});


// Configure Vite or Static routes
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode setup
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Serve files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HojiiLink Ethiopia Server] Service listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
