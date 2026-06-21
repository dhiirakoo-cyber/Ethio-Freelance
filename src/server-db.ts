/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { 
  User, 
  UserRole, 
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
} from "./types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DBStructure {
  users: User[];
  freelancers: FreelancerProfile[];
  clients: ClientProfile[];
  jobs: Job[];
  proposals: Proposal[];
  projects: ProjectContract[];
  messages: Message[];
  chats: ChatRoom[];
  reviews: Review[];
  notifications: NotificationItem[];
  transactions: EscrowTransaction[];
  passwords: Record<string, string>;
}

// Solid seed data tailored to HojiiLink Ethiopia
const defaultDB: DBStructure = {
  users: [
    {
      id: "u-fl1",
      email: "freelancer@hojiilink.com",
      displayName: "Chala Tolosa",
      role: UserRole.FREELANCER,
      createdAt: "2026-02-15T09:00:00Z",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      bio: "Full Stack Engineer & Mobile Developer deeply committed to building outstanding technology solutions in Ethiopia.",
      isPremium: true,
      isVerified: true,
      languages: ["English", "Afaan Oromo", "Amharic"]
    },
    {
      id: "u-fl2",
      email: "sifan@hojiilink.com",
      displayName: "Sifan Gudina",
      role: UserRole.FREELANCER,
      createdAt: "2026-03-10T11:30:00Z",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      bio: "Professional Graphic Designer & Afaan Oromo - English Translator. Creative and details-focused translator.",
      isPremium: false,
      isVerified: true,
      languages: ["Afaan Oromo", "English"]
    },
    {
      id: "u-cl1",
      email: "client@hojiilink.com",
      displayName: "Abdi Kebede",
      role: UserRole.CLIENT,
      createdAt: "2026-01-20T10:00:00Z",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      bio: "Founder of Haile Tech Solutions. Hiring talented Ethiopian professionals for global and local impact.",
      isPremium: false,
      isVerified: true,
      languages: ["English", "Amharic", "Afaan Oromo"]
    },
    {
      id: "u-ad1",
      email: "admin@hojiilink.com",
      displayName: "HojiiLink Administrator",
      role: UserRole.ADMIN,
      createdAt: "2026-01-01T08:00:00Z",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      isPremium: true,
      isVerified: true,
      languages: ["English", "Afaan Oromo", "Amharic"]
    }
  ],
  freelancers: [
    {
      id: "fls-1",
      userId: "u-fl1",
      title: "Senior React & Node Developer",
      bio: "Specializing in React, TypeScript, Express, and databases. I build lightning-fast web applications with clean, scalable structures.",
      skills: ["React", "TypeScript", "Node.js", "Express", "Next.js", "PostgreSQL", "Full-Stack Development"],
      hourlyRate: 850, // Birr per hour
      experience: [
        {
          id: "exp-1",
          company: "SafariTech Ethiopia",
          role: "Lead Frontend Engineer",
          startDate: "2024-01-01",
          endDate: "2025-12-31",
          description: "Led building interactive mobile-first customer portals for telecom users with React."
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "Addis Ababa University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Software Engineering",
          gradYear: "2023"
        }
      ],
      portfolio: [
        {
          id: "port-1",
          title: "Sheger Delivery Service Portal",
          description: "Full-stack food and package ordering hub featuring local payment integrations.",
          skillsUsed: ["React", "Node.js", "Chapa Integration"],
          imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400"
        }
      ],
      ratingAverage: 4.9,
      totalReviews: 12,
      completedProjects: 8,
      earningsETB: 45000,
      isFeatured: true
    },
    {
      id: "fls-2",
      userId: "u-fl2",
      title: "UI/UX Designer & Bilingual Copywriter",
      bio: "Figma master and native Afaan Oromo copywriter. I translate complex concepts into easy-to-use human designs and clean text outputs.",
      skills: ["UI/UX Design", "Figma", "Copywriting", "English Translation", "Afaan Oromo Translation", "Amharic Translation"],
      hourlyRate: 500,
      experience: [
        {
          id: "exp-2",
          company: "Oromia Media Network",
          role: "Creative Media Specialist",
          startDate: "2023-05-10",
          endDate: "Present",
          description: "Creating digital posters, user guide animations, and translating content English ↔ Afaan Oromo."
        }
      ],
      education: [
        {
          id: "edu-2",
          institution: "Adama Science and Technology University",
          degree: "BA in Communication & IT",
          fieldOfStudy: "Information Technology",
          gradYear: "2022"
        }
      ],
      portfolio: [
        {
          id: "port-2",
          title: "Bilingual NGO Platform Design",
          description: "Figma wireframes and English-Afaan Oromo copywriting for rural cooperative platform.",
          skillsUsed: ["Figma", "Afaan Oromo", "Copywriting"]
        }
      ],
      ratingAverage: 5.0,
      totalReviews: 4,
      completedProjects: 3,
      earningsETB: 18000,
      isFeatured: false
    }
  ],
  clients: [
    {
      id: "cls-1",
      userId: "u-cl1",
      companyName: "Haile Tech Solutions",
      tagline: "Digitizing Ethiopian SMEs with Pride",
      website: "https://hailetech.et",
      location: "Addis Ababa, Ethiopia",
      bio: "Expanding technology services across Horn of Africa. We hire local talents for short and long term assignments.",
      totalSpent: 35000,
      activeJobsCount: 2
    }
  ],
  jobs: [
    {
      id: "j-1",
      clientUserId: "u-cl1",
      clientName: "Abdi Kebede",
      clientCompany: "Haile Tech Solutions",
      title: "Bilingual Fintech Platform Translation (Afaan Oromo ↔ English)",
      description: "We are building an inclusive financial app for rural Ethiopia. We need a expert translator to localize all application screens, buttons, errors, helper hints, and user settings into standard, native Afaan Oromo. Needs a strong technical terminology background.",
      category: "Translation & Localization",
      skillsRequired: ["Afaan Oromo", "English Translation", "Copywriting", "Localization"],
      budgetType: "fixed",
      budgetMin: 15000,
      budgetMax: 25000,
      status: "open",
      isFeatured: true,
      proposalsCount: 2,
      createdAt: "2026-06-19T10:00:00Z"
    },
    {
      id: "j-2",
      clientUserId: "u-cl1",
      clientName: "Abdi Kebede",
      clientCompany: "Haile Tech Solutions",
      title: "Custom CBE Birr & Telebirr Mobile Integration (Node.js)",
      description: "Require an experienced backend engineer to implement reliable payment webhooks and API responses for Commercial Bank of Ethiopia (CBE Birr) and Ethio Telecom's Telebirr. Developer must provide tested simulated gateway models.",
      category: "Software Development",
      skillsRequired: ["Node.js", "TypeScript", "Express", "Payment Gateways", "Telebirr API"],
      budgetType: "fixed",
      budgetMin: 35000,
      budgetMax: 60000,
      status: "open",
      isFeatured: false,
      proposalsCount: 1,
      createdAt: "2026-06-20T14:00:00Z"
    }
  ],
  proposals: [
    {
      id: "prop-1",
      jobId: "j-1",
      freelancerUserId: "u-fl2",
      freelancerName: "Sifan Gudina",
      freelancerTitle: "UI/UX Designer & Bilingual Copywriter",
      freelancerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      coverLetter: "Baga gessan! Hello, I am Sifan, a native Afaan Oromo speaker and seasoned UI/UX writer. I have translated several platforms from English to Afaan Oromo ensuring correct cultural tone and technical vocab. I would love to make your fintech app outstanding! Meet with me to review my past glossary works.",
      bidAmount: 18000,
      deliveryDays: 5,
      status: "pending",
      aiGeneratedTag: false,
      createdAt: "2026-06-20T08:30:00Z"
    },
    {
      id: "prop-2",
      jobId: "j-1",
      freelancerUserId: "u-fl1",
      freelancerName: "Chala Tolosa",
      freelancerTitle: "Senior React & Node Developer",
      coverLetter: "Greetings! While I am mainly a technical engineer, I speak fluent Afaan Oromo, Amharic and English. I am building deep tech products and understand fintech terms perfectly so that localizations match accurate operations on screens. I can deliver fast.",
      freelancerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      bidAmount: 22000,
      deliveryDays: 7,
      status: "pending",
      aiGeneratedTag: true,
      createdAt: "2026-06-20T18:00:00Z"
    }
  ],
  projects: [
    {
      id: "cont-1",
      jobId: "j-1",
      jobTitle: "Bilingual Fintech Platform Translation (Afaan Oromo ↔ English)",
      clientUserId: "u-cl1",
      clientName: "Abdi Kebede",
      freelancerUserId: "u-fl2",
      freelancerName: "Sifan Gudina",
      totalBudget: 18000,
      status: "active",
      escrowStatus: "funded",
      milestones: [
        {
          id: "m-1",
          title: "Initial Terminology Setup & Home Dashboard Translation",
          amount: 8000,
          status: "funded",
          dueDate: "2026-06-25"
        },
        {
          id: "m-2",
          title: "Settings & Payment Errors Translation + Review Release",
          amount: 10000,
          status: "pending",
          dueDate: "2026-06-30"
        }
      ],
      createdAt: "2026-06-21T09:00:00Z"
    }
  ],
  messages: [
    {
      id: "msg-1",
      chatId: "chat-1",
      senderId: "u-cl1",
      senderName: "Abdi Kebede",
      content: "Hello Sifan, thank you for sending your bid! Can we do a quick review on Zoom tomorrow?",
      createdAt: "2026-06-20T09:00:00Z"
    },
    {
      id: "msg-2",
      chatId: "chat-1",
      senderId: "u-fl2",
      senderName: "Sifan Gudina",
      content: "Akkam jirtu, Abdi! Sure. Google Meet or Zoom works best for me. I can share my previous translation lists.",
      createdAt: "2026-06-20T09:12:00Z"
    }
  ],
  chats: [
    {
      id: "chat-1",
      jobId: "j-1",
      jobTitle: "Bilingual Fintech Platform Translation",
      participantA: { id: "u-cl1", name: "Abdi Kebede", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", role: "CLIENT" },
      participantB: { id: "u-fl2", name: "Sifan Gudina", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", role: "FREELANCER" },
      lastMessage: "Akkam jirtu, Abdi! Sure. Google Meet or Zoom works best for me. I can share my previous translation lists.",
      updatedAt: "2026-06-20T09:12:00Z"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      reviewerId: "u-cl1",
      reviewerName: "Abdi Kebede",
      reviewerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      revieweeId: "u-fl1",
      projectId: "old-proj-1",
      rating: 5,
      comment: "Exceptional speed. Chala understands scalable React/Vite development extremely of state patterns. Excellent CBE backend integrations too!",
      createdAt: "2026-05-18T16:00:00Z"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      userId: "u-fl2",
      title: "Contract Started Successfully!",
      message: "Abdi Kebede funded the contract 'Bilingual Fintech Platform Translation' escrow. Start working on Milestone 1.",
      type: "success",
      read: false,
      createdAt: "2026-06-21T09:05:00Z"
    }
  ],
  transactions: [
    {
      id: "tx-1",
      projectId: "cont-1",
      projectTitle: "Bilingual Fintech Platform Translation",
      amount: 18000,
      paymentGateway: "Chapa",
      txRef: "chapa_hl_983724",
      type: "deposit",
      status: "completed",
      createdAt: "2026-06-21T09:02:00Z"
    }
  ],
  passwords: {
    "freelancer@hojiilink.com": "freelancer123",
    "sifan@hojiilink.com": "sifan123",
    "client@hojiilink.com": "client123",
    "admin@hojiilink.com": "admin123"
  }
};

export class ServerDB {
  private static async ensureDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  static read(): DBStructure {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), "utf-8");
        return defaultDB;
      }
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed || !parsed.freelancers || !parsed.jobs || !parsed.projects) {
        console.warn("Invalid or old database schema detected, resetting to HojiiLink defaults");
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), "utf-8");
        return defaultDB;
      }
      return parsed;
    } catch (err) {
      console.error("Error reading HojiiLink database, using memory default:", err);
      return defaultDB;
    }
  }

  static write(data: DBStructure): boolean {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("Error writing HojiiLink database:", err);
      return false;
    }
  }

  static getUserByEmail(email: string): { user: User | null; password?: string } {
    const db = this.read();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    const password = user ? db.passwords[user.email] : undefined;
    return { user, password };
  }

  static createUser(user: User, passwordStr: string): User {
    const db = this.read();
    db.users.push(user);
    db.passwords[user.email] = passwordStr;

    // Create custom profile based on role
    if (user.role === UserRole.FREELANCER) {
      db.freelancers.push({
        id: "fls-" + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        title: "Freelancer Professional",
        bio: "Bio in progress. Update your profile page.",
        skills: ["English"],
        hourlyRate: 350,
        experience: [],
        education: [],
        portfolio: [],
        ratingAverage: 5.0,
        totalReviews: 0,
        completedProjects: 0,
        earningsETB: 0,
        isFeatured: false
      });
    } else if (user.role === UserRole.CLIENT) {
      db.clients.push({
        id: "cls-" + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        companyName: user.displayName + " Enterprise",
        website: "",
        location: "Addis Ababa, Ethiopia",
        bio: "Client onboarding profile.",
        totalSpent: 0,
        activeJobsCount: 0
      });
    }

    db.notifications.push({
      id: "notif-" + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      title: "Galmaa'uu Keessaniif Sifachne! Welcome on board!",
      message: "HojiiLink Ethiopia freelance marketplace welcomes you! Explore posted jobs and set up your skills.",
      type: "info",
      read: false,
      createdAt: new Date().toISOString()
    });

    this.write(db);
    return user;
  }
}
