/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  GUEST = "GUEST",
  FREELANCER = "FREELANCER",
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  avatarUrl: string;
  bio?: string;
  isPremium: boolean;
  isVerified: boolean;
  languages: string[];
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number; // in ETB or USD
  experience: ExperienceItem[];
  education: EducationItem[];
  portfolio: PortfolioItem[];
  ratingAverage: number;
  totalReviews: number;
  completedProjects: number;
  earningsETB: number; // For premium analytics tracking
  isFeatured: boolean;
}

export interface ClientProfile {
  id: string;
  userId: string;
  companyName: string;
  tagline?: string;
  website?: string;
  location: string;
  bio: string;
  totalSpent: number;
  activeJobsCount: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string; // 'Present' or date
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  gradYear: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  projectUrl?: string;
  imageUrl?: string;
  skillsUsed: string[];
}

export interface Job {
  id: string;
  clientUserId: string;
  clientName: string;
  clientCompany?: string;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  budgetType: "fixed" | "hourly";
  budgetMin: number;
  budgetMax: number;
  status: "open" | "in_progress" | "completed" | "closed";
  isFeatured: boolean;
  proposalsCount: number;
  createdAt: string;
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerUserId: string;
  freelancerName: string;
  freelancerTitle: string;
  freelancerAvatar: string;
  coverLetter: string;
  bidAmount: number; // ETB
  deliveryDays: number;
  status: "pending" | "accepted" | "declined";
  aiGeneratedTag?: boolean;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number; // in ETB
  status: "pending" | "funded" | "in_review" | "released";
  dueDate: string;
}

export interface ProjectContract {
  id: string;
  jobId: string;
  jobTitle: string;
  clientUserId: string;
  clientName: string;
  freelancerUserId: string;
  freelancerName: string;
  totalBudget: number;
  status: "active" | "completed" | "disputed" | "cancelled";
  escrowStatus: "unfunded" | "funded" | "released" | "refunded";
  milestones: Milestone[];
  createdAt: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  jobId?: string;
  jobTitle?: string;
  participantA: { id: string; name: string; avatar: string; role: string };
  participantB: { id: string; name: string; avatar: string; role: string };
  lastMessage?: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  projectId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
  createdAt: string;
}

export interface EscrowTransaction {
  id: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  paymentGateway: "Chapa" | "Telebirr" | "CBE Birr" | "Bank Transfer";
  txRef: string;
  type: "deposit" | "release" | "withdrawal";
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface SystemStats {
  totalUsersCount: number;
  totalFreelancersCount: number;
  totalClientsCount: number;
  totalJobsPosted: number;
  totalTransactionsETB: number;
  revenueCollectedETB: number;
}
