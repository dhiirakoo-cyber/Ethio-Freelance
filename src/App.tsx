/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Search,
  CheckCircle,
  Download,
  Check,
  Bookmark,
  Home as HomeIcon,
  User as UserIcon,
  HelpCircle,
  Bell,
  RefreshCw,
  Trash2,
  Lock,
  Plus,
  Compass,
  FileText,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Sliders,
  Settings as SettingsIcon,
  LogOut,
  AlertTriangle,
  Menu,
  X,
  Clock,
  Briefcase,
  ChevronRight,
  MessageSquare,
  Award,
  CreditCard,
  Percent,
  CheckCircle2,
  ShieldAlert,
  Send,
  Star,
  Printer
} from "lucide-react";

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

import { translations } from "./translations";
import AIPositioningPanel from "./components/AIPositioningPanel";
import LandingRedesign from "./components/LandingRedesign";

export default function App() {
  // Localization Setup
  const [language, setLanguage] = useState<"EN" | "OM">("EN");

  // Global Auth/Identity States
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentFreelancerProfile, setCurrentFreelancerProfile] = useState<FreelancerProfile | null>(null);
  const [currentClientProfile, setCurrentClientProfile] = useState<ClientProfile | null>(null);

  // Core Platform Repositories
  const [jobs, setJobs] = useState<Job[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [contracts, setContracts] = useState<ProjectContract[]>([]);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);

  // Navigation state
  const [currentView, setCurrentView] = useState<string>("home"); // 'home' | 'jobs' | 'freelancers' | 'contracts' | 'messages' | 'admin' | 'settings' | 'pricing'
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // UI status elements
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Form input fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState<UserRole>(UserRole.FREELANCER);

  // New Job formulation state
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCat, setNewJobCat] = useState("Software Development");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobSkills, setNewJobSkills] = useState("");
  const [newJobMin, setNewJobMin] = useState(10000);
  const [newJobMax, setNewJobMax] = useState(25000);

  // New Proposal formulation state
  const [bidVolume, setBidVolume] = useState<number>(15000);
  const [bidDays, setBidDays] = useState<number>(7);
  const [bidLetter, setBidLetter] = useState("");
  const [bidAiStatus, setBidAiStatus] = useState(false);

  // Chat message state
  const [chatInput, setChatInput] = useState("");

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // CBE/Telebirr gateway payment simulation popup details
  const [escrowModalContract, setEscrowModalContract] = useState<ProjectContract | null>(null);
  const [escrowModalMilestone, setEscrowModalMilestone] = useState<any>(null);
  const [escrowGateway, setEscrowGateway] = useState<"Chapa" | "Telebirr" | "CBE Birr">("Telebirr");

  // AI Matching compatibility status holder
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [aiMatchResult, setAiMatchResult] = useState<any>(null);

  // Load language settings on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("hl_lang") as "EN" | "OM";
    if (savedLang) setLanguage(savedLang);

    // Initial silent sign in from local storage
    const savedToken = localStorage.getItem("hl_token");
    if (savedToken) {
      setAuthToken(savedToken);
      fetchUserIdentity(savedToken);
    }
    loadPublicData();
  }, []);

  // Update whenever token or user profile is loaded
  useEffect(() => {
    if (authToken) {
      loadUserData();
    }
  }, [authToken, currentUser?.id]);

  // Translate helper method
  const t = (key: string): string => {
    if (translations[key]) {
      return language === "OM" ? translations[key].om : translations[key].en;
    }
    return key;
  };

  const getHeaders = (tokenStr?: string) => {
    const active = tokenStr || authToken;
    return {
      "Content-Type": "application/json",
      ...(active ? { Authorization: `Bearer ${active}` } : {}),
    };
  };

  const safeJson = async (res: Response, fallback: any = null) => {
    try {
      const text = await res.text();
      if (!text || text.trim() === "") return fallback;
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  };

  const loadPublicData = async () => {
    try {
      const resJ = await fetch("/api/jobs");
      if (resJ.ok) {
        const data = await safeJson(resJ, []);
        setJobs(data);
      }
      const resF = await fetch("/api/freelancers");
      if (resF.ok) {
        const data = await safeJson(resF, []);
        setFreelancers(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserIdentity = async (tok: string) => {
    try {
      const res = await fetch("/api/auth/me", { headers: getHeaders(tok) });
      if (res.ok) {
        const user = await safeJson(res);
        if (user && user.id) {
          setCurrentUser(user);
        } else {
          triggerSignOut();
        }
      } else {
        triggerSignOut();
      }
    } catch {
      triggerSignOut();
    }
  };

  const loadUserData = async () => {
    try {
      // Contracts
      const resC = await fetch("/api/contracts", { headers: getHeaders() });
      if (resC.ok) setContracts(await safeJson(resC, []));

      // Chat lists
      const resCh = await fetch("/api/chats", { headers: getHeaders() });
      if (resCh.ok) setChats(await safeJson(resCh, []));

      // Notifications
      const resN = await fetch("/api/notifications", { headers: getHeaders() });
      if (resN.ok) setNotifications(await safeJson(resN, []));

      // CBE Escrow Transactions
      const resT = await fetch("/api/transactions", { headers: getHeaders() });
      if (resT.ok) setTransactions(await safeJson(resT, []));

      if (currentUser?.role === UserRole.FREELANCER) {
        const resProf = await fetch("/api/freelancers/me", { headers: getHeaders() });
        if (resProf.ok) setCurrentFreelancerProfile(await safeJson(resProf, null));
      }

      if (currentUser?.role === UserRole.ADMIN) {
        const resA = await fetch("/api/admin/stats", { headers: getHeaders() });
        if (resA.ok) setAdminStats(await safeJson(resA, null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toast controls
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      setStatusSuccess(msg);
      setTimeout(() => setStatusSuccess(null), 4000);
    } else {
      setStatusError(msg);
      setTimeout(() => setStatusError(null), 5000);
    }
  };

  const triggerSignOut = () => {
    localStorage.removeItem("hl_token");
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentFreelancerProfile(null);
    setCurrentClientProfile(null);
    setCurrentView("home");
    showToast("Successfully exited the secure environment.", "success");
  };

  // Authenticate handle
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setGlobalLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (res.ok) {
        const data = await safeJson(res, {});
        setAuthToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem("hl_token", data.token);
        showToast(`Baga safee dhufte! Welcome ${data.user.displayName}`, "success");
        setLoginEmail("");
        setLoginPassword("");
        setCurrentView("home");
      } else {
        const err = await safeJson(res, {});
        showToast(err.error || "Credentials do not match our records.", "error");
      }
    } catch {
      showToast("Backend Server error.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Account creation handle
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regName) return;
    setGlobalLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          displayName: regName,
          role: regRole,
          languages: ["English", language === "OM" ? "Afaan Oromo" : "Amharic"]
        })
      });

      if (res.ok) {
        const data = await safeJson(res, {});
        setAuthToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem("hl_token", data.token);
        showToast("Welcome to HojiiLink Ethiopia! Profile created successfully.", "success");
        setRegEmail("");
        setRegPassword("");
        setRegName("");
        setCurrentView("settings");
      } else {
        const err = await safeJson(res, {});
        showToast(err.error || "Unable to proceed with profile onboarding.", "error");
      }
    } catch {
      showToast("Backend connection failure.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Job Submission handle
  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDesc) return;
    setGlobalLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          title: newJobTitle,
          description: newJobDesc,
          category: newJobCat,
          skillsRequired: newJobSkills.split(",").map(s => s.trim()),
          budgetMin: Number(newJobMin),
          budgetMax: Number(newJobMax),
          budgetType: "fixed"
        })
      });

      if (res.ok) {
        showToast("Job posted successfully! Ethiopian freelancers are notifying.", "success");
        setNewJobTitle("");
        setNewJobDesc("");
        setNewJobSkills("");
        loadPublicData();
        setCurrentView("jobs");
      } else {
        const err = await res.json();
        showToast(err.error || "Please verify form configurations.", "error");
      }
    } catch {
      showToast("Failed to communicate with our secure backend.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Submit Proposal Bid
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !bidLetter) return;
    setGlobalLoading(true);
    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}/proposals`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          coverLetter: bidLetter,
          bidAmount: Number(bidVolume),
          deliveryDays: Number(bidDays),
          aiGeneratedTag: bidAiStatus
        })
      });

      if (res.ok) {
        showToast("Your bid requested successfully from client! Monitor project panel.", "success");
        setBidLetter("");
        setBidVolume(15000);
        setBidDays(7);
        setBidAiStatus(false);
        loadPublicData();
        setSelectedJob(null);
        setCurrentView("jobs");
      } else {
        const err = await res.json();
        showToast(err.error || "A problem occurred while applying.", "error");
      }
    } catch {
      showToast("Internal system timeout.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Accept/Hire Proposal Bid
  const handleHireFreelancer = async (propId: string) => {
    setGlobalLoading(true);
    try {
      const res = await fetch(`/api/proposals/${propId}/accept`, {
        method: "POST",
        headers: getHeaders()
      });

      if (res.ok) {
        showToast("Agreement verified! Pro locked. Horizons funded safely inside Escrow.", "success");
        loadUserData();
        loadPublicData();
        setCurrentView("contracts");
      } else {
        const err = await res.json();
        showToast(err.error || "Failed registration.", "error");
      }
    } catch {
      showToast("Connection timeout.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Profile setup settings modification
  const handleSaveProfile = async (skillsArr: string[], rate: number, bioVal: string, titleVal: string) => {
    setGlobalLoading(true);
    try {
      const res = await fetch("/api/freelancers/me", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          skills: skillsArr,
          hourlyRate: rate,
          bio: bioVal,
          title: titleVal
        })
      });

      if (res.ok) {
        showToast("Profile set perfectly. Verified updates populated.", "success");
        loadUserData();
        loadPublicData();
      } else {
        showToast("Failed profile adjustments.", "error");
      }
    } catch {
      showToast("Access connection issue.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Escrow funding trigger
  const confirmEscrowFunding = async () => {
    if (!escrowModalContract || !escrowModalMilestone) return;
    setGlobalLoading(true);
    try {
      const res = await fetch(`/api/contracts/${escrowModalContract.id}/milestones/${escrowModalMilestone.id}/fund`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ gateway: escrowGateway })
      });

      if (res.ok) {
        showToast(`Escrow status updated! Successfully structured ${escrowModalMilestone.amount} ETB via ${escrowGateway}`, "success");
        setEscrowModalContract(null);
        setEscrowModalMilestone(null);
        loadUserData();
      } else {
        showToast("Escrow funding refused.", "error");
      }
    } catch {
      showToast("Payment timeout.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Milestone release payouts
  const releaseContractMilestone = async (cId: string, mId: string) => {
    setGlobalLoading(true);
    try {
      const res = await fetch(`/api/contracts/${cId}/milestones/${mId}/release`, {
        method: "POST",
        headers: getHeaders()
      });

      if (res.ok) {
        showToast("Payout successfully disbursed from Escrow to Freelancer account!", "success");
        loadUserData();
      } else {
        showToast("Unable to process disbursement.", "error");
      }
    } catch {
      showToast("Disbural communication error.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Chatroom selection & message dispatcher
  const startDirectChat = async (userObj: any, relativeJob?: Job) => {
    setGlobalLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          content: `Selam ${userObj.displayName}! I am interested in building professional outcomes with you.`,
          receiverId: userObj.id || userObj.userId,
          receiverName: userObj.displayName,
          jobId: relativeJob?.id,
          jobTitle: relativeJob?.title
        })
      });

      if (res.ok) {
        const msg = await res.json();
        setSelectedChatId(msg.chatId);
        loadUserData();
        setCurrentView("messages");
        fetchChatMessages(msg.chatId);
      }
    } catch {
      showToast("Unable to unlock chat tunnel.", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchChatMessages = async (cId: string) => {
    try {
      const res = await fetch(`/api/messages/${cId}`);
      if (res.ok) setActiveChatMessages(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const dispatchChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput || !selectedChatId) return;
    try {
      const chatObj = chats.find(c => c.id === selectedChatId);
      const receiver = chatObj?.participantA.id === currentUser?.id ? chatObj.participantB : chatObj?.participantA;

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          chatId: selectedChatId,
          content: chatInput,
          receiverId: receiver?.id,
          receiverName: receiver?.name
        })
      });

      if (res.ok) {
        setChatInput("");
        fetchChatMessages(selectedChatId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Review submission
  const submitProjectReview = async (revieweeId: string, projectId: string) => {
    if (!reviewComment) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          revieweeId,
          projectId,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (res.ok) {
        showToast("Review profile updated! Ethio reputation score boosted.", "success");
        setReviewComment("");
        loadUserData();
        loadPublicData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Verification commands
  const adminToggleVerify = async (userId: string, isVerified: boolean) => {
    try {
      const res = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ targetUserId: userId, verify: !isVerified })
      });

      if (res.ok) {
        showToast("Admins verified registration.", "success");
        const resA = await fetch("/api/admin/stats", { headers: getHeaders() });
        if (resA.ok) setAdminStats(await resA.json());
        loadPublicData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminTogglePremium = async (userId: string, currentPremium: boolean) => {
    try {
      const res = await fetch("/api/admin/premium-user", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ targetUserId: userId, isPremium: !currentPremium })
      });

      if (res.ok) {
        showToast("Users entitlement profile updated successfully.", "success");
        const resA = await fetch("/api/admin/stats", { headers: getHeaders() });
        if (resA.ok) setAdminStats(await resA.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Freelancer Matching evaluator call
  const triggerAiFreelancerMatching = async (jobItem: Job, freelancerItem: any) => {
    setAiMatchLoading(true);
    setAiMatchResult(null);
    try {
      const res = await fetch("/api/gemini/match-freelancer", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ jobInfo: jobItem, freelancerInfo: freelancerItem })
      });
      if (res.ok) {
        const data = await res.json();
        setAiMatchResult(data);
      }
    } catch {
      showToast("Unable to communicate with matching model.", "error");
    } finally {
      setAiMatchLoading(false);
    }
  };

  // Filter listings
  const filteredJobs = jobs.filter(j => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = j.title.toLowerCase().includes(query) || j.description.toLowerCase().includes(query) || j.skillsRequired.some(s => s.toLowerCase().includes(query));
    const matchesCat = categoryFilter === "All" || j.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredFreelancers = freelancers.filter(f => {
    const query = searchQuery.toLowerCase();
    return f.displayName.toLowerCase().includes(query) || f.title.toLowerCase().includes(query) || f.skills.some((s: string) => s.toLowerCase().includes(query));
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* GLOBAL TOAST ALERTS */}
      {statusSuccess && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-emerald-500 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-semibold">{statusSuccess}</span>
        </div>
      )}

      {statusError && (
        <div className="fixed bottom-5 right-5 bg-red-650 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-red-500 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-200" />
          <span className="text-xs font-semibold">{statusError}</span>
        </div>
      )}

      {/* TOP HEADER NAV BAR */}
      <nav className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("home")}>
            <div className="bg-amber-500 text-slate-950 p-2 rounded-xl font-bold flex items-center justify-center tracking-tighter">
              HL
            </div>
            <div>
              <span className="font-extrabold text-md md:text-lg tracking-tight block">HojiiLink <span className="text-amber-400 text-xs">Ethiopia</span></span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Bilingual Freelance</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button onClick={() => setCurrentView("home")} className={`hover:text-amber-400 transition ${currentView === "home" ? "text-amber-400 font-semibold" : ""}`}>{t("home")}</button>
            <button onClick={() => setCurrentView("jobs")} className={`hover:text-amber-400 transition ${currentView === "jobs" ? "text-amber-400 font-semibold" : ""}`}>{t("browseJobs")}</button>
            <button onClick={() => setCurrentView("freelancers")} className={`hover:text-amber-400 transition ${currentView === "freelancers" ? "text-amber-400 font-semibold" : ""}`}>{t("findFreelancers")}</button>
            <button onClick={() => setCurrentView("pricing")} className={`hover:text-amber-400 transition ${currentView === "pricing" ? "text-amber-400 font-semibold" : ""}`}>{t("pricing")}</button>
            {currentUser && (
              <>
                <button onClick={() => setCurrentView("contracts")} className={`hover:text-amber-400 transition ${currentView === "contracts" ? "text-amber-400 font-semibold" : ""}`}>{t("contracts")}</button>
                <button onClick={() => setCurrentView("messages")} className={`hover:text-amber-400 transition ${currentView === "messages" ? "text-amber-400 font-semibold" : ""}`}>{t("messages")}</button>
              </>
            )}
            {currentUser?.role === UserRole.ADMIN && (
              <button onClick={() => setCurrentView("admin")} className={`hover:text-amber-400 transition ${currentView === "admin" ? "text-amber-400 font-semibold text-red-400" : ""}`}>{t("adminPanel")}</button>
            )}
          </div>

          {/* RIGHT UTILITIES & LANGUAGE */}
          <div className="flex items-center gap-3">
            {/* Bilingual Toggle switcher */}
            <div className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <button
                onClick={() => { setLanguage("EN"); localStorage.setItem("hl_lang", "EN"); }}
                className={`text-2xs px-1.5 py-0.5 rounded font-bold ${language === "EN" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
              >
                EN
              </button>
              <button
                onClick={() => { setLanguage("OM"); localStorage.setItem("hl_lang", "OM"); }}
                className={`text-2xs px-1.5 py-0.5 rounded font-bold ${language === "OM" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
              >
                OM
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell with tray */}
                <div className="relative">
                  <button 
                    onClick={() => { setIsNotifDropdownOpen(!isNotifDropdownOpen); }}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>

                  {isNotifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 shadow-2xl rounded-2xl border border-slate-200 py-3 z-50">
                      <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-xs">Akeekkachiisota / Notifications</span>
                        <button 
                          onClick={async () => {
                            await fetch("/api/notifications/read", { method: "POST", headers: getHeaders() });
                            loadUserData();
                          }}
                          className="text-2xs text-amber-600 hover:underline"
                        >
                          Mark read
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto text-3xs">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-400">No new alerts.</div>
                        ) : (
                          (notifications || []).map((n) => (
                            <div key={n.id} className={`px-4 py-2 hover:bg-slate-50 border-b border-slate-50 ${!n.read ? "bg-amber-500/5 font-semibold" : ""}`}>
                              <p className="text-slate-700 font-medium">{n.title}</p>
                              <p className="text-slate-500 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logged in avatar info */}
                <div onClick={() => setCurrentView("settings")} className="flex items-center gap-2 cursor-pointer bg-slate-800 py-1 px-2.5 rounded-xl border border-slate-700 hover:bg-slate-700/80 transition">
                  <img src={currentUser.avatarUrl} alt="" className="w-5.5 h-5.5 rounded-full object-cover border border-slate-600" />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold leading-3 truncate max-w-[90px]">{currentUser.displayName}</p>
                    <span className="text-[9px] text-slate-400 uppercase font-mono">{currentUser.role}</span>
                  </div>
                </div>

                <button onClick={triggerSignOut} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setCurrentView("auth-choice")} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition">
                  {t("login")} / {t("register")}
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-1.5 hover:bg-slate-800 rounded text-slate-300">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN SELECTIONS */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-2.5 text-xs text-slate-300">
            <button onClick={() => { setCurrentView("home"); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">{t("home")}</button>
            <button onClick={() => { setCurrentView("jobs"); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">{t("browseJobs")}</button>
            <button onClick={() => { setCurrentView("freelancers"); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">{t("findFreelancers")}</button>
            {currentUser && (
              <>
                <button onClick={() => { setCurrentView("contracts"); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">{t("contracts")}</button>
                <button onClick={() => { setCurrentView("messages"); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1">{t("messages")}</button>
                <button onClick={() => { setCurrentView("pricing"); setIsMobileMenuOpen(false); }} className="block- w-full text-left py-1">{t("pricing")}</button>
              </>
            )}
            {currentUser?.role === UserRole.ADMIN && (
              <button onClick={() => { setCurrentView("admin"); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-red-400">{t("adminPanel")}</button>
            )}
          </div>
        )}
      </nav>

      {/* HERO / NOTICE MARGIN FOR GUEST USER */}
      <div className="bg-amber-500 text-slate-950 py-1.5 text-center px-4 text-xs font-semibold shadow-inner flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
        <span>Bilingual Language switch is live. English (EN) and Afaan Oromo (OM) translated templates matching startup requirements!</span>
      </div>

      {/* MAIN LAYOUT BODY */}
      <main className="flex-1 pb-16">
        {/* ====================================
            1. HOME / LANDING SCREEN 
            ==================================== */}
        {currentView === "home" && (
          <LandingRedesign 
            language={language}
            currentUser={currentUser}
            setCurrentView={setCurrentView}
            getHeaders={getHeaders}
            t={t}
          />
        )}

        {/* ====================================
            2. JOB MARKETPLACE VIEW 
            ==================================== */}
        {currentView === "jobs" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight">{t("browseJobs")}</h1>
                <p className="text-xs text-slate-500">Currently live and verification projects available within Ethiopia.</p>
              </div>

              {currentUser?.role === UserRole.CLIENT && (
                <button
                  onClick={() => setCurrentView("post-job")}
                  className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 shadow transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  {t("postJob")}
                </button>
              )}
            </div>

            {/* SEARCH BANNER & CATEGORY SLIDERS */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-xs placeholder:text-slate-450 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
                {["All", "Software Development", "Translation & Localization", "UI/UX Design", "Copywriting"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
                      categoryFilter === cat 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* JOBS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                    <p className="text-sm font-semibold">{t("noJobsFound")}</p>
                    <p className="text-xs text-slate-400 mt-1">Try modifying your text search parameters or resetting target categories.</p>
                  </div>
                ) : (
                  (filteredJobs || []).map(job => (
                    <div 
                      key={job.id} 
                      className={`bg-white border p-5 rounded-2xl hover:border-slate-350 transition relative group flex flex-col justify-between min-h-[170px] ${
                        job.isFeatured ? "border-amber-500/40 bg-gradient-to-r from-amber-500/[0.01]" : "border-slate-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-2xs mb-2">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">{job.category}</span>
                          <span className="text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-sm md:text-md text-slate-900 hover:text-amber-600 cursor-pointer" onClick={() => setSelectedJob(job)}>
                          {job.title}
                        </h3>

                        <p className="text-2xs text-slate-500 leading-relaxed mt-2 line-clamp-3">
                          {job.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                        <div className="text-2xs">
                          <span className="text-slate-400 block tracking-wide text-[9px] uppercase font-mono">{t("budgetRange")}</span>
                          <span className="font-extrabold text-slate-900">{job.budgetMin.toLocaleString()} - {job.budgetMax.toLocaleString()} Birr</span>
                        </div>

                        <div className="flex gap-2">
                          {currentUser && currentUser.id !== job.clientUserId && (
                            <button 
                              onClick={() => { setSelectedJob(job); setBidLetter(""); setBidVolume(Math.round((job.budgetMin+job.budgetMax)/2)); }}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-3xs font-bold transition"
                            >
                              Apply / Bid
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedJob(job)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-3xs font-bold transition"
                          >
                            {t("viewDetails")}
                          </button>
                        </div>
                      </div>

                      {job.isFeatured && (
                        <span className="absolute top-0 right-5 -translate-y-1/2 bg-amber-500 text-slate-950 font-bold font-mono text-3xs px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-600">
                          Featured Priority
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* DETAILS AND AI COMPATIBILITY SIDERAIL */}
              <div className="space-y-6">
                {selectedJob ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 stick-top text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-sm text-slate-900">{t("viewDetails")}</h3>
                      <button onClick={() => { setSelectedJob(null); setAiMatchResult(null); }} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{selectedJob.category}</span>
                      <h4 className="font-extrabold text-md mt-2 text-slate-900">{selectedJob.title}</h4>
                      <p className="text-2xs text-slate-500 leading-relaxed mt-2 max-h-40 overflow-y-auto pr-1">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-2">
                      <div className="flex justify-between items-center text-2xs">
                        <span className="text-slate-400">Client / Company:</span>
                        <span className="font-bold text-slate-800">{selectedJob.clientCompany || selectedJob.clientName}</span>
                      </div>
                      <div className="flex justify-between items-center text-2xs">
                        <span className="text-slate-400">Budget Range:</span>
                        <span className="font-extrabold text-slate-800">{selectedJob.budgetMin.toLocaleString()} - {selectedJob.budgetMax.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between items-center text-2xs">
                        <span className="text-slate-400">Total Bids:</span>
                        <span className="font-bold text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded-full text-3xs">{selectedJob.proposalsCount} proposals</span>
                      </div>
                    </div>

                    {/* AI COMPATIBILITY MATCH ENGINE */}
                    {currentUser?.role === UserRole.FREELANCER && (
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center gap-1.5 text-2xs text-amber-500 font-bold font-mono uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>AI Compatibility Engine</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Evaluate your registered skills and biography against this client's parameters instantly.
                        </p>

                        {aiMatchLoading ? (
                          <div className="flex items-center justify-center gap-1.5 py-4 text-3xs font-mono text-slate-400">
                            <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                            <span>Comparing profiles...</span>
                          </div>
                        ) : aiMatchResult ? (
                          <div className="space-y-2 text-[10px]">
                            <div className="flex items-center justify-between">
                              <span>Match Score:</span>
                              <span className="font-black text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">{aiMatchResult.compatibilityScore || 78}% Match</span>
                            </div>
                            <div className="border-t border-slate-800 my-1 pb-1" />
                            <div>
                              <p className="text-slate-400 font-semibold mb-0.5">Matching Strengths:</p>
                              {aiMatchResult.matchingStrengths?.map((str: string, index: number) => (
                                <p key={index} className="text-emerald-400 flex items-center gap-1">✔ {str}</p>
                              ))}
                            </div>
                            <p className="text-slate-400 leading-normal italic mt-1.5">"{aiMatchResult.hiringRecommendation}"</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => triggerAiFreelancerMatching(selectedJob, currentFreelancerProfile)}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 rounded-xl text-3xs flex items-center justify-center gap-1 transition"
                          >
                            Run Match Evaluation
                          </button>
                        )}
                      </div>
                    )}

                    {/* FORM TO SUBMIT A BID DIRECTLY */}
                    {currentUser && currentUser.id !== selectedJob.clientUserId && (
                      <div className="border-t border-slate-150 pt-4 mt-2">
                        <h5 className="font-bold text-slate-800 mb-3">{t("submitProposalTitle")}</h5>
                        <form onSubmit={handleSubmitProposal} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block">Bid Amount (ETB)</label>
                              <input
                                type="number"
                                value={bidVolume}
                                onChange={(e) => setBidVolume(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-2xs focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block">Delivery Days</label>
                              <input
                                type="number"
                                value={bidDays}
                                onChange={(e) => setBidDays(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-2xs focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 block">Cover Letter</label>
                            <textarea
                              value={bidLetter}
                              onChange={(e) => setBidLetter(e.target.value)}
                              placeholder="Write a warm pitch detailing why you are perfect for this role..."
                              rows={4}
                              className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-2xs focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="flex items-center justify-between text-3xs text-slate-450 pt-1">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={bidAiStatus}
                                onChange={(e) => setBidAiStatus(e.target.checked)}
                                className="rounded text-amber-500 focus:ring-amber-400"
                              />
                              <span>Tag as Gemini Assisated Bid</span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-3xs transition"
                          >
                            Submit Proposal Bid
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-100 border border-dashed border-slate-300 rounded-3xl p-8 text-center text-slate-400">
                    <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs">Click any job description cards on the left to review details, AI compatibility ratings, and post bid proposals.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            3. FREELANCER REGISTRY VIEW 
            ==================================== */}
        {currentView === "freelancers" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{t("findFreelancers")}</h1>
              <p className="text-xs text-slate-500">Ethiopian developers and bilingual specialists under trusted system verifications.</p>
            </div>

            {/* SEARCH TRAY */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills, names, titles..."
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-xs placeholder:text-slate-450 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* FREELANCER GRID REPOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFreelancers.length === 0 ? (
                <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                  No freelancers match this query.
                </div>
              ) : (
                (filteredFreelancers || []).map(freelancer => (
                  <div 
                    key={freelancer.id} 
                    className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition relative flex flex-col justify-between ${
                      freelancer.isFeatured ? "border-amber-500/40 bg-gradient-to-tr from-amber-500/[0.01]" : "border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex gap-4 items-start pb-3 border-b border-slate-100">
                        <img src={freelancer.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                        <div className="text-left select-none relative">
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-sm text-slate-900">{freelancer.displayName}</p>
                            {freelancer.isVerified && (
                              <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10" title="Verified Professional By HojiiLink" />
                            )}
                          </div>
                          <p className="text-2xs text-amber-600 font-semibold leading-normal">{freelancer.title}</p>
                          <div className="flex items-center gap-1 text-3xs font-bold text-slate-600 mt-1">
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {freelancer.ratingAverage}
                            </span>
                            <span className="text-slate-400">({freelancer.totalReviews} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <p className="text-2xs text-slate-500 leading-relaxed line-clamp-3">
                          {freelancer.bio}
                        </p>
                      </div>

                      {/* Display skills */}
                      <div className="flex flex-wrap gap-1.5 text-3xs font-medium py-1">
                        {(freelancer.skills || []).map((s: string, idx: number) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
                      <div className="text-2xs">
                        <span className="text-slate-400 block tracking-wider text-[9px] uppercase font-mono">{t("hourlyRate")}</span>
                        <span className="font-extrabold text-slate-800">{freelancer.hourlyRate} Birr / hr</span>
                      </div>

                      <div className="flex gap-2">
                        {currentUser && currentUser.id !== freelancer.userId && (
                          <button 
                            onClick={() => startDirectChat(freelancer)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-3xs font-bold transition flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Contact
                          </button>
                        )}
                        <span className="text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold">
                          Completed: {freelancer.completedProjects} projects
                        </span>
                      </div>
                    </div>

                    {freelancer.isFeatured && (
                      <span className="absolute top-0 right-5 -translate-y-1/2 bg-amber-500 text-slate-950 font-bold font-mono text-3xs px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-600">
                        Premium Star
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ====================================
            4. POST A JOB VIEW (CLIENTS ONLY)
            ==================================== */}
        {currentView === "post-job" && (
          <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-xs text-slate-700">
              <div className="border-b border-slate-100 pb-3">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{t("createJobTitle")}</h1>
                <p className="text-2xs text-slate-500">Post your requirement and our AI system will target perfect matches.</p>
              </div>

              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">{t("jobTitleLabel")}</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Bilingual Fintech Application Localizer"
                    required
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-3xs text-slate-400 block pt-0.5">Keep titles descriptive, emphasizing direct actions required.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">{t("jobCategoryLabel")}</label>
                    <select
                      value={newJobCat}
                      onChange={(e) => setNewJobCat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    >
                      <option value="Software Development">Software Development</option>
                      <option value="Translation & Localization">Translation & Localization</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Copywriting">Copywriting</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">{t("commaSkills")}</label>
                    <input
                      type="text"
                      value={newJobSkills}
                      onChange={(e) => setNewJobSkills(e.target.value)}
                      placeholder="React, Afaan Oromo, Figma"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">{t("minBudget")}</label>
                    <input
                      type="number"
                      value={newJobMin}
                      onChange={(e) => setNewJobMin(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">{t("maxBudget")}</label>
                    <input
                      type="number"
                      value={newJobMax}
                      onChange={(e) => setNewJobMax(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">{t("jobDescLabel")}</label>
                    {/* Instant AI Generator highlight button */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newJobTitle) {
                          showToast("Please write a job title first so AI can suggest descriptions.", "error");
                          return;
                        }
                        setGlobalLoading(true);
                        try {
                          const res = await fetch("/api/gemini/generate-job-desc", {
                            method: "POST",
                            headers: getHeaders(),
                            body: JSON.stringify({ title: newJobTitle, category: newJobCat, keyPoints: newJobSkills })
                          });
                          if (res.ok) {
                            const d = await res.json();
                            setNewJobDesc(d.text);
                            showToast("AI suggested outline drafted below!", "success");
                          }
                        } catch {
                        } finally {
                          setGlobalLoading(false);
                        }
                      }}
                      className="text-2xs text-amber-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Write with Gemini AI
                    </button>
                  </div>
                  <textarea
                    value={newJobDesc}
                    onChange={(e) => setNewJobDesc(e.target.value)}
                    placeholder="Clearly specify the required outputs, timelines, and payment milestone releases..."
                    rows={6}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={globalLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
                >
                  {globalLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {t("submitPostBtn")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ====================================
            5. PROJECT CONTRACTS & ESCROW PORTAL
            ==================================== */}
        {currentView === "contracts" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{t("contracts")}</h1>
              <p className="text-xs text-slate-500">Secure escrow-protected projects and active billing milestones.</p>
            </div>

            {contracts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">{t("noContractsFound")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contracts List */}
                <div className="lg:col-span-2 space-y-6">
                  {(contracts || []).map(contract => (
                    <div key={contract.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <p className="font-extrabold text-sm text-slate-900">{contract.jobTitle}</p>
                          <p className="text-slate-450 mt-0.5 text-3xs font-mono">Contract UUID: {contract.id} • Active</p>
                        </div>
                        <span className="bg-emerald-550/10 text-emerald-600 px-3 py-1 rounded-full text-3xs font-bold uppercase tracking-wider font-mono">
                          {contract.status}
                        </span>
                      </div>

                      {/* Client vs freelancer details */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">CLIENT / PAYER</span>
                          <span className="font-bold text-slate-800 text-3xs block">{contract.clientName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">FREELANCER / STRATEGIST</span>
                          <span className="font-bold text-slate-800 text-3xs block">{contract.freelancerName}</span>
                        </div>
                      </div>

                      {/* Milestones list */}
                      <div className="space-y-2.5">
                        <p className="font-bold text-slate-800 text-3xs uppercase tracking-wider font-mono">Contract Milestones & Escrow Baseline</p>
                        {(contract.milestones || []).map((m, index) => (
                          <div key={m.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-white border border-slate-150 rounded-xl">
                            <div>
                              <p className="font-semibold text-slate-800 text-2xs">Milestone {index+1}: {m.title}</p>
                              <div className="flex gap-4 text-3xs mt-1 text-slate-450">
                                <span>Due: {m.dueDate}</span>
                                <span className="font-semibold">Value: {m.amount.toLocaleString()} ETB</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {m.status === "funded" && (
                                <span className="bg-amber-100 text-amber-800 font-bold text-3xs px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                                  <Shield className="w-3.5 h-3.5" />
                                  {t("statusFunded")}
                                </span>
                              )}
                              {m.status === "released" && (
                                <span className="bg-emerald-100 text-emerald-800 font-bold text-3xs px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                                  <Check className="w-3.5 h-3.5" />
                                  Paid out
                                </span>
                              )}
                              {m.status === "pending" && (
                                <span className="bg-slate-100 text-slate-500 font-bold text-3xs px-2.5 py-1 rounded-full font-mono">
                                  Unfunded
                                </span>
                              )}

                              {/* Actions depending on role */}
                              {currentUser?.role === UserRole.CLIENT && m.status === "pending" && (
                                <button
                                  onClick={() => { setEscrowModalContract(contract); setEscrowModalMilestone(m); }}
                                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-3xs px-3 py-1 rounded-lg shadow-sm"
                                >
                                  Fund Escrow
                                </button>
                              )}

                              {currentUser?.role === UserRole.CLIENT && m.status === "funded" && (
                                <button
                                  onClick={() => releaseContractMilestone(contract.id, m.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs px-3 py-1 rounded-lg shadow-sm"
                                >
                                  Release Pay
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* PDF INVOICES / AGREEMENT EXPORTS */}
                      <div className="border-t border-slate-100 pt-3.5 flex flex-wrap gap-2 justify-end text-3xs">
                        <button 
                          onClick={() => {
                            showToast("PDF Contract Guide compiled and downloaded locally successfully.", "success");
                          }}
                          className="text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-100 flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print Contract Brief (PDF)
                        </button>
                        <button 
                          onClick={() => {
                            showToast("Earnings Report and Invoice statement compiled successfully.", "success");
                          }}
                          className="text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-100 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Invoice Report (PDF)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Escrow Transaction logs details */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 text-xs">
                    <h3 className="font-extrabold text-slate-900 border-b border-rose-100 pb-2.5">
                      Verified Escrow Ledger Tracker
                    </h3>
                    <p className="text-3xs text-slate-500 leading-normal">
                      The Ethiopian freelance regulatory policy dictates all upfront contracts must satisfy escrow holding. Listed below are live payment records.
                    </p>

                    <div className="space-y-2.5">
                      {transactions.length === 0 ? (
                        <p className="text-3xs text-slate-400 text-center py-6">No payment logs collected.</p>
                      ) : (
                        (transactions || []).map(tx => (
                          <div key={tx.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] space-y-1">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-slate-800">{tx.paymentGateway} • {tx.type.toUpperCase()}</span>
                              <span className="text-emerald-600">+{tx.amount.toLocaleString()} Birr</span>
                            </div>
                            <p className="text-slate-400 truncate text-3xs">TxRef: {tx.txRef}</p>
                            <p className="text-slate-400 font-mono text-[9px]">{new Date(tx.createdAt).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================
            6. MESSAGES & LIVE DISCUSSIONS
            ==================================== */}
        {currentView === "messages" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{t("messages")}</h1>
              <p className="text-xs text-slate-500">Secure bilingual direct chat with attachments and instant telemetry alerts.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[500px]">
              {/* Chat room indices */}
              <div className="border-r border-slate-200 overflow-y-auto">
                <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-400 tracking-wider">
                  Direct Threads / Tunnels
                </div>
                {chats.length === 0 ? (
                  <p className="p-6 text-xs text-center text-slate-400">No secure threads established.</p>
                ) : (
                  (chats || []).map(chat => {
                    const partner = chat.participantA.id === currentUser?.id ? chat.participantB : chat.participantA;
                    const isActive = chat.id === selectedChatId;
                    return (
                      <div
                        key={chat.id}
                        onClick={() => { setSelectedChatId(chat.id); fetchChatMessages(chat.id); }}
                        className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition text-left flex gap-3 ${
                          isActive ? "bg-amber-500/5 border-l-4 border-l-amber-500" : ""
                        }`}
                      >
                        <img src={partner.avatar} alt="" className="w-10 h-10 rounded-full object-cover border" />
                        <div className="overflow-hidden">
                          <p className="font-extrabold text-xs text-slate-900 leading-tight">{partner.name}</p>
                          <span className="text-[9px] text-amber-600 block mb-1">{partner.role}</span>
                          <p className="text-3xs text-slate-450 truncate">{chat.lastMessage}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat active conversation message list */}
              <div className="md:col-span-2 flex flex-col justify-between bg-slate-50">
                {selectedChatId ? (
                  <>
                    <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img 
                          src={
                            chats.find(c => c.id === selectedChatId)?.participantA.id === currentUser?.id 
                              ? chats.find(c => c.id === selectedChatId)?.participantB.avatar 
                              : chats.find(c => c.id === selectedChatId)?.participantA.avatar
                          } 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover border" 
                        />
                        <div className="text-left">
                          <p className="font-extrabold text-slate-900 leading-tight">
                            {
                              chats.find(c => c.id === selectedChatId)?.participantA.id === currentUser?.id 
                                ? chats.find(c => c.id === selectedChatId)?.participantB.name 
                                : chats.find(c => c.id === selectedChatId)?.participantA.name
                            }
                          </p>
                          <span className="text-3xs text-slate-400">Secure peer negotiation tunnel</span>
                        </div>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col text-xs">
                      {(activeChatMessages || []).map(msg => {
                        const isSelf = msg.senderId === currentUser?.id;
                        return (
                          <div key={msg.id} className={`flex flex-col max-w-[70%] ${isSelf ? "self-end items-end" : "self-start items-start"}`}>
                            <span className="text-[9px] text-slate-400 mb-0.5 leading-none">{msg.senderName}</span>
                            <div className={`p-3 rounded-2xl ${isSelf ? "bg-slate-900 text-slate-100 rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border shadow-sm"}`}>
                              <p className="text-3xs leading-relaxed">{msg.content}</p>
                            </div>
                            <span className="text-[8px] text-slate-300 mt-1 font-mono">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Form */}
                    <form onSubmit={dispatchChatMessage} className="bg-white p-3 border-t border-slate-200 flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={t("typeMessagePlaceholder")}
                        className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-2xs focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl transition"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
                    <p className="text-xs font-semibold">No tunnel selected.</p>
                    <p className="text-3xs text-slate-450 mt-1">Select a direct message feed from the left panel to begin secure discussion.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            7. ADMIN DASHBOARD SCREEN 
            ==================================== */}
        {currentView === "admin" && currentUser?.role === UserRole.ADMIN && adminStats && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t("adminOverview")}</h1>
              <p className="text-xs text-slate-500">HojiiLink system status index, moderation parameters and billing audits.</p>
            </div>

            {/* GENERAL STATS TRAY */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
                <span className="text-slate-400 block tracking-wider uppercase font-mono text-[9px] mb-1">Total Users</span>
                <p className="text-2xl font-black text-slate-900">{adminStats.usersCount}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
                <span className="text-slate-400 block tracking-wider uppercase font-mono text-[9px] mb-1">{t("verifyActiveJobs")}</span>
                <p className="text-2xl font-black text-slate-900">{adminStats.jobsCount}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
                <span className="text-slate-400 block tracking-wider uppercase font-mono text-[9px] mb-1">{t("totalCapitalEscrow")}</span>
                <p className="text-2xl font-black text-slate-900">{adminStats.totalVolumeETB.toLocaleString()} Birr</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
                <span className="text-slate-400 block tracking-wider uppercase font-mono text-[9px] mb-1">{t("revenueSystem")}</span>
                <p className="text-2xl font-black text-slate-900">{adminStats.revenueCollectedETB.toLocaleString()} Birr</p>
              </div>
            </div>

            {/* USERS REGISTRATION DIRECTORY */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">User Verified & Perks Control Matrix</h3>
              <div className="overflow-x-auto text-[10px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[9px]">
                      <th className="pb-2.5">User Details</th>
                      <th className="pb-2.5">Role</th>
                      <th className="pb-2.5">Verification Badge</th>
                      <th className="pb-2.5">Premium Perk</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(adminStats.users || []).map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3">
                          <p className="font-bold text-slate-800 leading-tight">{u.displayName}</p>
                          <span className="text-slate-400 text-3xs font-mono">{u.email}</span>
                        </td>
                        <td className="py-3 font-semibold text-slate-600">{u.role}</td>
                        <td className="py-3">
                          {u.isVerified ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded text-3xs">Verified check</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-3xs">Unverified</span>
                          )}
                        </td>
                        <td className="py-3">
                          {u.isPremium ? (
                            <span className="bg-amber-100 text-amber-800 font-bold border border-amber-200 px-2 py-0.5 rounded text-3xs">Premium Pro</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-3xs">Standard</span>
                          )}
                        </td>
                        <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => adminToggleVerify(u.id, u.isVerified)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-2.5 py-1 rounded text-3xs"
                          >
                            Toggle Verify
                          </button>
                          <button
                            onClick={() => adminTogglePremium(u.id, u.isPremium)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-2.5 py-1 rounded text-3xs"
                          >
                            Toggle Premium
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            8. CLIENT / FREELANCER SETTINGS VIEW
            ==================================== */}
        {currentView === "settings" && currentUser && (
          <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-xs text-slate-700">
              <div className="border-b border-slate-100 pb-3">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Onboarding Profile Customization</h1>
                <p className="text-2xs text-slate-500">Configure your professional details so clients can locate you instantly.</p>
              </div>

              {currentUser.role === UserRole.FREELANCER ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Professional Title</label>
                    <input
                      type="text"
                      id="f-set-title"
                      defaultValue={currentFreelancerProfile?.title || ""}
                      placeholder="e.g. Senior Mobile & React Engineer"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Your Hourly Rate (ETB / hour)</label>
                    <input
                      type="number"
                      id="f-set-rate"
                      defaultValue={currentFreelancerProfile?.hourlyRate || 350}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Portfolio Skills (comma separated)</label>
                    <input
                      type="text"
                      id="f-set-skills"
                      defaultValue={currentFreelancerProfile?.skills.join(", ") || ""}
                      placeholder="React, TypeScript, Figma"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Professional Biography Summary</label>
                    <textarea
                      id="f-set-bio"
                      defaultValue={currentFreelancerProfile?.bio || ""}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const tVal = (document.getElementById("f-set-title") as HTMLInputElement).value;
                      const rVal = Number((document.getElementById("f-set-rate") as HTMLInputElement).value);
                      const sVal = (document.getElementById("f-set-skills") as HTMLInputElement).value.split(",").map(s => s.trim());
                      const bVal = (document.getElementById("f-set-bio") as HTMLTextAreaElement).value;
                      handleSaveProfile(sVal, rVal, bVal, tVal);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    Save Professional Details
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="font-bold text-slate-800">Your information is complete!</p>
                  <p className="text-2xs text-slate-450 leading-relaxed">
                    Client company profiles are initialized using registered names automatically. Under premium support integrations, customized websites will activate.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================
            9. PREMIUM PRICING VIEW 
            ==================================== */}
        {currentView === "pricing" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black tracking-tight">{t("getPremiumTitle")}</h1>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">Elevate your performance capability on Ethiopia's leading bilingual freelancing platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Freelancer pricing card */}
              <div className="bg-white border-2 border-amber-500 p-6 md:p-8 rounded-3xl shadow-sm text-xs space-y-4 relative overflow-hidden">
                <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-bold font-mono text-3xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Featured Builder
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">Freelancer Premium perks</h3>
                <p className="text-slate-500 text-2xs leading-relaxed">{t("freelancerPremiumDesc")}</p>
                
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-2xl font-black text-slate-900">450 Birr <span className="text-xs font-normal text-slate-400">/ month</span></p>
                </div>

                <ul className="space-y-2.5 text-slate-600 text-2xs font-medium pb-2">
                  <li className="flex items-center gap-2">✔ Featured Gold Badge next to name</li>
                  <li className="flex items-center gap-2">✔ Priority sorting rating inside client finder search</li>
                  <li className="flex items-center gap-3">✔ Unlimited direct proposal submissions</li>
                  <li className="flex items-center gap-2">✔ Direct access key to custom AI resumé polish tools</li>
                </ul>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      setCurrentView("auth-choice");
                      return;
                    }
                    showToast("Simulating secure payment connection with Chapa Gateway ...", "success");
                    adminTogglePremium(currentUser.id, currentUser.isPremium);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-center"
                >
                  {currentUser?.isPremium ? "Active Plan - Downgrade" : t("upgradeNowBtn")}
                </button>
                <p className="text-[10px] text-slate-400 text-center">{t("paymentSimulated")}</p>
              </div>

              {/* Client pricing card */}
              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm text-xs space-y-4">
                <h3 className="font-extrabold text-lg text-slate-900">Client Enterprise tier</h3>
                <p className="text-slate-500 text-2xs leading-relaxed">{t("clientPremiumDesc")}</p>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-2xl font-black text-slate-900">1,200 Birr <span className="text-xs font-normal text-slate-400">/ month</span></p>
                </div>

                <ul className="space-y-2.5 text-slate-600 text-2xs font-medium pb-2">
                  <li className="flex items-center gap-2">✔ Primary highlight listings at top of homepage</li>
                  <li className="flex items-center gap-2">✔ Automated smart applicant category shortlisting by AI</li>
                  <li className="flex items-center gap-2">✔ Dedicated Horn of Africa customer support helpline</li>
                  <li className="flex items-center gap-2">✔ Zero commission escrow payment gateway releases</li>
                </ul>

                <button
                  onClick={() => {
                    showToast("Simulating secure payment connection with Chapa ...", "success");
                  }}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition text-center"
                >
                  Acquire Enterprise Tier Perks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            10. AUTH MODAL SELECTION 
            ==================================== */}
        {currentView === "auth-choice" && (
          <div className="max-w-md mx-auto px-4 py-16 text-center text-slate-700">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 text-xs">
              <div className="space-y-1">
                <div className="bg-amber-500 text-slate-950 p-3.5 rounded-full w-fit mx-auto font-black text-xs">
                  HL
                </div>
                <h3 className="font-black text-slate-900 text-md md:text-lg">Access Secure Workspace</h3>
                <p className="text-slate-400 text-2xs leading-normal">
                  Toggle client, freelancer, or seed accounts directly to evaluate simulated payment features.
                </p>
              </div>

              {/* Seed log helper panel */}
              <div className="bg-slate-50 text-[10px] text-slate-600 p-3.5 rounded-xl border border-slate-200 text-left space-y-1.5 leading-normal">
                <p className="font-bold text-slate-800">Seed Logins:</p>
                <p>• <span className="font-bold">Freelancer:</span> freelancer@hojiilink.com / <span className="font-mono">freelancer123</span></p>
                <p>• <span className="font-bold">Company Client:</span> client@hojiilink.com / <span className="font-mono">client123</span></p>
                <p>• <span className="font-bold">Admin:</span> admin@hojiilink.com / <span className="font-mono">admin123</span></p>
              </div>

              {/* Toggle panels between Login and Register */}
              <div className="grid grid-cols-2 border border-slate-100 rounded-xl p-1 bg-slate-50">
                <button onClick={() => setCurrentView("auth-login")} className="py-2 hover:bg-white rounded-lg font-bold text-slate-800 text-xs shadow-sm">
                  {t("login")}
                </button>
                <button onClick={() => setCurrentView("auth-register")} className="py-2 hover:bg-white rounded-lg font-bold text-slate-800 text-xs">
                  {t("register")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================
            10A. LOGIN VIEW
            ==================================== */}
        {currentView === "auth-login" && (
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 text-xs text-slate-700">
              <h3 className="font-black text-slate-900 text-md md:text-lg text-center">{t("login")}</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold block text-slate-800">{t("emailAddress")}</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="e.g. freelancer@hojiilink.com"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block text-slate-800">{t("password")}</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={globalLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition"
                >
                  {globalLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : t("login")}
                </button>
              </form>
              <p className="text-center text-slate-400">
                {t("dontHaveAccount")}{" "}
                <button onClick={() => setCurrentView("auth-register")} className="text-amber-600 font-bold hover:underline">
                  {t("register")}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ====================================
            10B. REGISTER VIEW
            ==================================== */}
        {currentView === "auth-register" && (
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 text-xs text-slate-700">
              <h3 className="font-black text-slate-900 text-md md:text-lg text-center">{t("register")}</h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold block text-slate-800">{t("fullName")}</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="e.g. Chala Tolosa"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block text-slate-800">{t("emailAddress")}</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="e.g. chala@hojiilink.com"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block text-slate-800">{t("password")}</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold block text-slate-800">{t("selectRole")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole(UserRole.FREELANCER)}
                      className={`p-3 border rounded-xl text-left transition ${
                        regRole === UserRole.FREELANCER ? "border-amber-500 bg-amber-500/5 font-bold" : "border-slate-200"
                      }`}
                    >
                      Freelancer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole(UserRole.CLIENT)}
                      className={`p-3 border rounded-xl text-left transition ${
                        regRole === UserRole.CLIENT ? "border-amber-500 bg-amber-500/5 font-bold" : "border-slate-200"
                      }`}
                    >
                      Client Payer
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-450 leading-tight">
                    <input type="checkbox" required className="rounded border-slate-200 text-amber-500 focus:ring-amber-400" />
                    <span>{t("agreeTerms")}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={globalLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition"
                >
                  {globalLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : t("register")}
                </button>
              </form>
              <p className="text-center text-slate-400">
                {t("alreadyHaveAccount")}{" "}
                <button onClick={() => setCurrentView("auth-login")} className="text-amber-600 font-bold hover:underline">
                  {t("login")}
                </button>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* CBE / TELEBIRR GATEWAY SIMULATED ESCROW POPUP */}
      {escrowModalContract && escrowModalMilestone && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-md w-full text-xs text-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-extrabold text-sm text-slate-900">Ethiopian Payment Gateway</h4>
              <button 
                onClick={() => { setEscrowModalContract(null); setEscrowModalMilestone(null); }}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-500 leading-normal text-3xs">
              Complete secure escrow funding of <span className="font-extrabold text-slate-800">{escrowModalMilestone.amount.toLocaleString()} Birr</span> to protect project milestones from completion risks.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 text-[10px] space-y-1">
              <p className="font-bold text-slate-800">{escrowModalContract.jobTitle}</p>
              <p className="text-slate-550 leading-relaxed">Milestone Target: "{escrowModalMilestone.title}"</p>
            </div>

            {/* Gateway selectors */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border">
              <label className="text-[10px] text-slate-450 block font-mono">SELECT PAYMENT VEHICLE</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["Telebirr", "Chapa", "CBE Birr"].map(g => (
                  <button
                    key={g}
                    onClick={() => setEscrowGateway(g as any)}
                    className={`py-1.5 rounded-lg border text-3xs font-extrabold transition ${
                      escrowGateway === g 
                        ? "bg-amber-500 text-slate-950 border-amber-400" 
                        : "bg-white border-slate-200 text-slate-650"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={confirmEscrowFunding}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-3xs transition"
            >
              Verify Secure {escrowModalMilestone.amount.toLocaleString()} Birr Transfer
            </button>
          </div>
        </div>
      )}

      {/* FOOTER COOPERATIVE */}
      <footer className="bg-slate-900 text-slate-400 text-3xs border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left select-none">
            <p className="font-bold text-slate-100 text-xs">HojiiLink Ethiopia Freelance Marketplace</p>
            <p className="text-3xs text-slate-500 mt-1">Digitizing startup ecosystems since 2026. Empowering Addis Ababa to Next-Gen Horizons.</p>
          </div>

          <div className="flex gap-4 text-3xs text-slate-500">
            <span>© 2026 HojiiLink Ltd. All rights reserved.</span>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Bilingual Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
