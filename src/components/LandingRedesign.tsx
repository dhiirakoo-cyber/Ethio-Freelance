import React, { useState, useEffect } from "react";
import { 
  ArrowRight, Shield, TrendingUp, Users, CreditCard, Sparkles, 
  CheckCircle2, Award, Zap, Briefcase, Clock, Star, Globe, 
  Search, MessageSquare, MapPin, UserCheck, Compass, DollarSign, 
  HelpCircle, ChevronRight, Activity, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AIPositioningPanel from "./AIPositioningPanel";

interface LandingRedesignProps {
  language: "EN" | "OM";
  currentUser: any;
  setCurrentView: (view: string) => void;
  getHeaders: (customToken?: string) => any;
  t: (key: string) => string;
}

export default function LandingRedesign({ language, currentUser, setCurrentView, getHeaders, t }: LandingRedesignProps) {
  const [activeTab, setActiveTab] = useState<"client" | "freelancer">("client");
  const [estimateCategory, setEstimateCategory] = useState<"development" | "translation" | "design" | "copywriting">("development");
  const [estimateScope, setEstimateScope] = useState<"small" | "medium" | "large">("medium");
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(20);
  const [typedTerm, setTypedTerm] = useState("");
  
  // Custom interactive search query auto-suggestions
  const searchSuggestions = [
    t("Software Development") || "Web & Mobile Apps",
    t("Translation") || "English/Afaan Oromo translation",
    "Chapa/Telebirr Integration",
    "UI/UX Mobile Design"
  ];

  // Animated Statistics State
  const [stats, setStats] = useState({
    registered: 1850,
    payoutReleased: 362400,
    escrowSuccess: 98.4,
    secRate: 100
  });

  useEffect(() => {
    // Slowly increment stats slightly over time to simulate a real-time hot marketplace!
    const interval = setInterval(() => {
      setStats(prev => ({
        registered: prev.registered + (Math.random() > 0.7 ? 1 : 0),
        payoutReleased: prev.payoutReleased + (Math.random() > 0.6 ? Math.floor(Math.random() * 450) + 100 : 0),
        escrowSuccess: Math.min(99.9, prev.escrowSuccess + (Math.random() > 0.95 ? 0.1 : 0)),
        secRate: 100
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Top Ethio-Freelancers Showcase (Professional verified profiles)
  const topFreelancers = [
    {
      id: "eth-f1",
      name: "Saron Merga",
      role: "Senior Full-Stack Developer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      location: "Addis Ababa, Ethiopia",
      rating: 4.9,
      reviewsCount: 38,
      rate: "850 ETB/hr",
      skills: ["React", "Express", "PostgreSQL", "Chapa API", "Telebirr Gateway"],
      badge: "Top Rated Plus",
      completionRate: "100% Success",
      bio: "Specialist in fintech systems, escrow microservices & high-perf React dashboards."
    },
    {
      id: "eth-f2",
      name: "Abel Tefera",
      role: "Bilingual Localization Expert",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300",
      location: "Adama, Ethiopia",
      rating: 5.0,
      reviewsCount: 47,
      rate: "450 ETB/hr",
      skills: ["Afaan Oromo", "Amharic Localization", "Technical Writing", "Bilingual Glossaries"],
      badge: "Elite Level 2",
      completionRate: "100% Success",
      bio: "Highly vetted translator. Direct expertise in digitalizing business templates."
    },
    {
      id: "eth-f3",
      name: "Eden Kassa",
      role: "UI/UX & Brand Identity Designer",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300",
      location: "Hawassa, Ethiopia",
      rating: 4.8,
      reviewsCount: 29,
      rate: "600 ETB/hr",
      skills: ["Figma UI/UX", "Tailwind Design", "Mobile Wireframing", "Creative Prototypes"],
      badge: "Trending Tech",
      completionRate: "97% Success",
      bio: "Crafting beautiful, high-retention user experiences for Ethiopian startups."
    },
    {
      id: "eth-f4",
      name: "Kalkidan Yoseph",
      role: "Python Data Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      location: "Bahir Dar, Ethiopia",
      rating: 5.0,
      reviewsCount: 19,
      rate: "950 ETB/hr",
      skills: ["Django", "Gemini LLM SDK", "Web Scraping", "Predictive Analytics"],
      badge: "Enterprise Pro",
      completionRate: "100% Success",
      bio: "Automating data pipelines and integrating advanced Gemini AI models with server layers."
    }
  ];

  // Success Stories (Fully polished layout with images & real ETB payouts)
  const successStories = [
    {
      quote: "Using HojiiLink, I got contracted for three major translation works from regional schools. The milestone escrow feature via Telebirr gave my clients total peace of mind, and the pay was transferred instantly.",
      name: "Tolosa D.",
      role: "Bilingual Technical Lead Translators",
      payout: "84,000 ETB Earned",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300"
    },
    {
      quote: "As a startup owner in Addis, finding reliable tech talent has been hard. HojiiLink matched us with top React engineers who integrated our payment API flawlessly under strict deadline milestones.",
      name: "Dr. Aster K.",
      role: "CEO of MedTech Ethiopia",
      payout: "Client Partner",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300"
    }
  ];

  // Live Activity Stream (Simulates real-time escrow, hiring events)
  const [activities, setActivities] = useState([
    {
      id: 1,
      text: "📌 Abel T. submitted a custom bid for 'Bilingual Oromo App Translation'",
      time: "Just now",
      type: "proposal"
    },
    {
      id: 2,
      text: "🎉 Milestone payment of 15,000 ETB was released to Saron M. for API Integration",
      time: "2 mins ago",
      type: "escrow"
    },
    {
      id: 3,
      text: "💼 New High-Budget Job Posted: 'Safaricom Agent Dashboard UI/UX Designer'",
      time: "5 mins ago",
      type: "job"
    },
    {
      id: 4,
      text: "🤝 Contract signed between Ethio-Logistics and Kalkidan Y. (Python Dev)",
      time: "12 mins ago",
      type: "contract"
    }
  ]);

  useEffect(() => {
    const activityPool = [
      { text: "💼 Posted: 'Afaan Oromo Voiceover for Product Animation' (4,500 ETB)", type: "job" },
      { text: "🎉 Client 'Yegara PLC' deposited 24,000 ETB into Escrow", type: "escrow" },
      { text: "🤝 Saron M. accepted a new Mobile App React milestone contract", type: "contract" },
      { text: "📌 Eden K. received a 5.0 Star review for Portfolio Redesign", type: "review" },
      { text: "📌 Tolosa D. updated his technical availability status to Active", type: "status" }
    ];

    const interval = setInterval(() => {
      const randomActivity = activityPool[Math.floor(Math.random() * activityPool.length)];
      setActivities(prev => [
        {
          id: Date.now(),
          text: randomActivity.text,
          time: "Just now",
          type: randomActivity.type
        },
        ...prev.slice(0, 3)
      ]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Premium Category Cards
  const premiumCategories = [
    {
      title: "Software Development",
      oromoTitle: "Misooma Software",
      count: "140 Jobs Live",
      gradient: "from-blue-600 to-indigo-600",
      description: "Fullstack apps, Chapa integrations, responsive mobile platforms, and Telegram bots.",
      icon: <Zap className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Translation & Localization",
      oromoTitle: "Hiikkaa & Moggaasa",
      count: "95 Jobs Live",
      gradient: "from-amber-500 to-amber-600",
      description: "English, Afaan Oromo, and Amharic translation, corporate briefs, and localization.",
      icon: <Globe className="w-6 h-6 text-amber-400" />
    },
    {
      title: "UI/UX & Creative Design",
      oromoTitle: "Dizaayinii UI/UX",
      count: "78 Jobs Live",
      gradient: "from-teal-500 to-emerald-600",
      description: "Figma wireframing, high-fidelity prototypes, brand styling, and Ethiopian localized UI.",
      icon: <Compass className="w-6 h-6 text-teal-400" />
    },
    {
      title: "Copywriting & Content Strategy",
      oromoTitle: "Barreeffama Bireenidii",
      count: "41 Jobs Live",
      gradient: "from-purple-600 to-pink-600",
      description: "SEO optimization, social content, bilingual sales copy, and AI-powered marketing plans.",
      icon: <Sparkles className="w-6 h-6 text-purple-400" />
    }
  ];

  // Dynamic cost estimator logic
  const calculateEstimate = () => {
    let hourlyBase = 500;
    if (estimateCategory === "development") hourlyBase = 850;
    if (estimateCategory === "translation") hourlyBase = 450;
    if (estimateCategory === "design") hourlyBase = 600;
    if (estimateCategory === "copywriting") hourlyBase = 400;

    let multiplier = 1;
    if (estimateScope === "small") multiplier = 0.6;
    if (estimateScope === "large") multiplier = 1.8;

    const weeklyCost = Math.round(hourlyBase * hoursPerWeek * multiplier);
    const platformFee = Math.round(weeklyCost * 0.05); // 5% secure gateway
    const totalEst = weeklyCost + platformFee;

    return {
      hourly: Math.round(hourlyBase * multiplier),
      weekly: weeklyCost,
      fee: platformFee,
      total: totalEst
    };
  };

  const est = calculateEstimate();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION (Billion dollar layout) */}
      <section className="relative pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-900 to-slate-950">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-3xs font-black uppercase tracking-widest font-mono">
                <Award className="w-3.5 h-3.5" />
                <span>Ethiopia's Premium Talent Hub</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-1" />
              </div>

              {/* Spectacular Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Find Top <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Ethiopian</span> Talents with Escrow Trust.
              </h1>

              {/* Supportive Subtitle */}
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                The premier hub matching exceptional developers, designers, and bilingual translators across Ethiopia. Supported by native billing tools like CBE Birr, Telebirr, and Chapa escrow infrastructure.
              </p>

              {/* Interactive Multi-Query Search Input Bar */}
              <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl flex flex-col md:flex-row items-stretch gap-2 shadow-2xl backdrop-blur-md max-w-2xl relative z-20">
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search className="w-5 h-5 text-amber-400 shrink-0" />
                  <input 
                    type="text" 
                    value={typedTerm}
                    onChange={(e) => setTypedTerm(e.target.value)}
                    placeholder="Search e.g. Telebirr integration, Oromo translator..." 
                    className="bg-transparent border-0 text-white placeholder-slate-500 text-2xs focus:ring-0 focus:outline-none w-full py-2.5"
                  />
                </div>
                <button 
                  onClick={() => {
                    setCurrentView("jobs");
                  }} 
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-2xs px-6 py-3 rounded-xl transition duration-200 shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98"
                >
                  Explore Gigs
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Suggestions tags */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-slate-500 font-medium">Popular:</span>
                {searchSuggestions.map((sug, index) => (
                  <button 
                    key={index}
                    onClick={() => setTypedTerm(sug)}
                    className="bg-slate-900/60 hover:bg-slate-800 px-3 py-1 rounded-full border border-slate-800/80 text-slate-300 transition duration-150 py-1"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-slate-900 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-500/10 text-green-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">100% Escrow Secured</p>
                    <p className="text-[9px] text-slate-400">Milestone lock releases</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Vetted Professionals</p>
                    <p className="text-[9px] text-slate-400">Addis, Adama, Hawassa</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Bilingual support</p>
                    <p className="text-[9px] text-slate-400">English & Afaan Oromo</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Stat Cards Columns */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-amber-500/15 blur-3xl rounded-full" />
              
              <div className="relative z-10 bg-slate-900/70 border border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-lg">
                
                {/* Visual Glassmorphic header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    <span className="font-bold text-xs uppercase tracking-widest text-slate-300 font-mono">Ethiopian Market Activity</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>

                {/* Grid stats with modern glassmorphism design */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Stat 1 */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 hover:border-amber-400/30 transition duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span className="text-[9px] text-green-400 font-mono bg-green-500/5 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {stats.registered.toLocaleString()}+
                    </p>
                    <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Verified Freelancers</h4>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 hover:border-amber-400/30 transition duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/5 px-1.5 py-0.5 rounded">Payouts</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                      {stats.payoutReleased.toLocaleString()} <span className="text-3xs text-slate-400">ETB</span>
                    </p>
                    <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Processed Escrow</h4>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 hover:border-amber-400/30 transition duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      <span className="text-[9px] text-blue-400 font-mono bg-blue-500/5 px-1.5 py-0.5 rounded">Safe</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {stats.escrowSuccess}%
                    </p>
                    <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Succeed Escrows</h4>
                  </div>

                  {/* Stat 4 */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 hover:border-amber-400/30 transition duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span className="text-[9px] text-amber-500 font-mono bg-amber-500/5 px-1.5 py-0.5 rounded">Verified</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                      {stats.secRate}.0%
                    </p>
                    <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Chapa / Telebirr SEC</h4>
                  </div>

                </div>

                {/* CTA registration triggers */}
                <div className="mt-6 flex gap-3">
                  {!currentUser ? (
                    <>
                      <button 
                        onClick={() => setCurrentView("auth-choice")}
                        className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-2xs font-bold py-3 rounded-xl transition hover:bg-slate-800 block text-center"
                      >
                        Sign In / Register
                      </button>
                      <button 
                        onClick={() => setCurrentView("auth-choice")}
                        className="flex-1 bg-amber-500 text-slate-950 text-2xs font-bold py-3 rounded-xl transition hover:bg-amber-400 block text-center shadow-lg"
                      >
                        Hire Talent Now
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        if (currentUser.role === "client") {
                          setCurrentView("post-job");
                        } else {
                          setCurrentView("jobs");
                        }
                      }}
                      className="w-full bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 text-white text-2xs font-bold py-3.5 rounded-xl transition hover:border-slate-700 flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      <span>Welcome back, {currentUser.displayName}! Open Workspace</span>
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE ACTIVITY TICKER BANNER (Completely eliminates unrequested whitespace, feels extremely organic) */}
      <div className="bg-slate-900 border-y border-slate-800/80 py-4 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:border-r border-slate-800 pr-5 shrink-0">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <Activity className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-3xs uppercase font-black text-amber-400 tracking-wider font-mono">Live Marketplace Feed:</span>
          </div>
          
          <div className="flex-1 overflow-hidden w-full relative h-7">
            <AnimatePresence mode="popLayout">
              {activities.slice(0, 1).map((act) => (
                <motion.div 
                  key={act.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-between text-2xs text-slate-300 font-mono px-2"
                >
                  <span className="truncate">{act.text}</span>
                  <span className="text-slate-500 text-3xs shrink-0 ml-4">{act.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. MODERN CATEGORY CARDS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-block bg-indigo-500/10 text-indigo-400 text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/20">
              Browse Specialized Tracks
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              A Bilingual Marketplace Made for Global Standards.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Select categorized pipelines curated meticulously for Ethiopian regional operations and seamless overseas remote dispatch.
            </p>
          </div>

          {/* Grid Layout of Premium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumCategories.map((cat, idx) => (
              <div 
                key={idx}
                className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden hover:bg-slate-900/80"
              >
                {/* Card Background subtle gradient layout indicator on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-xl group-hover:bg-amber-500/10 transition duration-300" />
                
                <div className="space-y-4 relative z-10">
                  <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-2xl w-fit group-hover:scale-110 transition duration-200">
                    {cat.icon}
                  </div>
                  <div>
                    <span className="text-2xs font-mono text-amber-500 block mb-1">
                      {language === "OM" ? cat.oromoTitle : cat.title}
                    </span>
                    <h3 className="font-bold text-base text-white tracking-tight">{cat.title}</h3>
                  </div>
                  <p className="text-3xs text-slate-400 leading-relaxed font-sans">{cat.description}</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6 relative z-10">
                  <span className="text-3xs font-mono text-slate-500 uppercase tracking-widest">{cat.count}</span>
                  <button 
                    onClick={() => {
                      setCurrentView("jobs");
                    }} 
                    className="p-1 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BRAND NEW SECTION: MEET ETHIOPIA'S TOP DIGITAL TALENT */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/30 relative">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Premium Pitch */}
            <div className="lg:col-span-12 xl:col-span-5 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-3xs font-black uppercase tracking-widest font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HojiiLink Pro Tier</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.15]">
                {language === "OM" 
                  ? "Dandeettii Dijitaalaa Itoophiyaa Sadarkaa Olaanaa Qabu Beekaa" 
                  : "Meet Ethiopia's Top Digital Talent"
                }
              </h2>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Thousands of verified professionals helping businesses grow locally and globally.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 animate-pulse">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-2xs font-extrabold text-white">Vetted Enterprise Standards</h4>
                    <p className="text-[11px] text-slate-400">Strict technical testing, portfolio reviews and communication vetting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-2xs font-extrabold text-white">Escrow-backed Contracts</h4>
                    <p className="text-[11px] text-slate-400">Payment resides securely in escrow released solely upon verified milestones.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-2xs font-extrabold text-white">Chapa & Telebirr Seamless Invoicing</h4>
                    <p className="text-[11px] text-slate-400">Pay inside Ethiopia or abroad using world-class secure native payment gateways.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <button 
                  onClick={() => setCurrentView("freelancers")}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-2xs px-6 py-3.5 rounded-xl transition duration-200 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-1.5 active:scale-98"
                >
                  Connect with Pro Talents
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=80" alt="vetted user" referrerPolicy="no-referrer" />
                  <img className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80" alt="vetted user" referrerPolicy="no-referrer" />
                  <img className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=80" alt="vetted user" referrerPolicy="no-referrer" />
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-amber-400 font-extrabold font-mono font-sans">+120</div>
                </div>
              </div>
            </div>

            {/* Right Column: Stunning Asymmetrical Bento Freelancer Image Grid */}
            <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              
              {/* Box 1: Developer working on Laptop */}
              <div className="group relative bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 p-5 hover:bg-slate-900/60">
                <div className="relative h-44 rounded-2xl overflow-hidden mb-3.5">
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" 
                    alt="Ethiopian software developer working on laptop"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider font-mono shadow-md">
                    Verified Coder
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-xs">Yonas Kassa</h3>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-serif tracking-wide">
                      850 ETB/hr
                    </span>
                  </div>
                  <p className="text-[10px] text-indigo-300 font-medium font-mono">Senior Full-Stack Engineer</p>
                  
                  {/* Rating, completed job counts */}
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-mono border-t border-slate-800/60 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-extrabold text-white">5.0</span>
                    </div>
                    <span className="text-[10px] text-slate-400 select-none">94 Projects Completed</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1.5">
                    <span className="bg-slate-950 text-slate-400 text-3xs px-2 py-0.5 rounded border border-slate-850 font-mono">Go/React</span>
                    <span className="bg-slate-950 text-slate-400 text-3xs px-2 py-0.5 rounded border border-slate-850 font-mono">Fintech</span>
                    <span className="bg-slate-950 text-slate-400 text-3xs px-2 py-0.5 rounded border border-slate-850 font-mono">OAuth</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Female UI/UX Designer */}
              <div className="group relative bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 p-5 hover:bg-slate-900/60">
                <div className="relative h-44 rounded-2xl overflow-hidden mb-3.5">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                    alt="Ethiopian female UI/UX designer"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider font-mono shadow-md">
                    Top 1% Design
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-xs">Eden Kassa</h3>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-serif tracking-wide">
                      600 ETB/hr
                    </span>
                  </div>
                  <p className="text-[10px] text-indigo-300 font-medium font-mono">Mobile & SaaS UI/UX Architect</p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] font-mono border-t border-slate-800/60 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-extrabold text-white">4.9</span>
                    </div>
                    <span className="text-[10px] text-slate-400 select-none">68 Projects Completed</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1.5">
                    <span className="bg-slate-950 text-slate-400 text-3xs px-2 py-0.5 rounded border border-slate-850 font-mono">Figma</span>
                    <span className="bg-slate-950 text-slate-400 text-3xs px-2 py-0.5 rounded border border-slate-850 font-mono">Bento Grid</span>
                    <span className="bg-slate-950 text-slate-400 text-3xs px-2 py-0.5 rounded border border-slate-850 font-mono">SaaS UX</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Modern Startup Office & Remote Team Collaboration */}
              <div className="group relative bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 p-5 md:col-span-2 hover:bg-slate-900/60">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Photo portion */}
                  <div className="md:col-span-5 relative h-40 md:h-full rounded-2xl overflow-hidden min-h-[140px]">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                      alt="Ethiopian remote team collaboration"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Text portion */}
                  <div className="md:col-span-7 space-y-3 p-1">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider font-mono">
                        Vetted Remote Team Hub
                      </span>
                      <span className="text-3xs text-green-400 font-mono flex items-center gap-1.5 bg-green-500/5 px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active Now
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-xs sm:text-sm">Addis Tech Solutions Team</h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Custom vetted squad for quick digital transformation. Providing software coding, translation localization, and database automation pipelines under single milestone escrows.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                      <span className="text-slate-300 font-extrabold">Starting at 3,200 ETB/hr</span>
                      <span className="text-slate-500 font-sans">100% Success Verified</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Box 4: Digital Marketing Specialist */}
              <div className="group relative bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 p-5 md:col-span-2 hover:bg-slate-900/60">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Photo portion */}
                  <div className="md:col-span-5 relative h-40 md:h-full rounded-2xl overflow-hidden min-h-[140px]">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" 
                      alt="Ethiopian digital marketing specialist"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Text portion */}
                  <div className="md:col-span-7 space-y-3 p-1">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider font-mono">
                        Elite Growth Agent
                      </span>
                      <span className="text-3xs text-yellow-400 font-mono bg-amber-500/5 px-2 py-0.5 rounded">
                        Top Rated Seller
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-xs sm:text-sm">Abel Tefera</h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      English & Afaan Oromo digital content lead. Specializes in regional growth loops, viral social briefs, SEO copywriting campaigns, and bilingual ad frameworks.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                      <span className="text-slate-300 font-extrabold">550 ETB/hr</span>
                      <span className="text-slate-500 font-sans">112 Projects Done</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. TOP FREELANCERS HUB ("Ethiopia's 1% Talents Hub") */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3 text-left">
              <div className="inline-block bg-amber-500/10 text-amber-400 text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
                ⭐ Featured Talents Showcase
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Vetted Elite Creators & Tech Experts.
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Ready to initiate contract milestones. Check real-time ratings, past contracts completed, and chat with them instantly.
              </p>
            </div>
            
            <button 
              onClick={() => setCurrentView("freelancers")}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-2xs px-5 py-3 rounded-xl transition duration-150 inline-flex items-center gap-1.5 whitespace-nowrap self-start md:self-auto"
            >
              See All Verified Bios
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Grid alignment of glassmorphism freelancer profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topFreelancers.map((free) => (
              <div 
                key={free.id}
                className="bg-slate-900/30 border border-slate-800 hover:border-amber-500/40 p-5 rounded-[2rem] transition-all duration-300 flex flex-col justify-between hover:bg-slate-900/60 "
              >
                <div>
                  {/* Top Avatar Row */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative">
                      <img 
                        src={free.avatar} 
                        alt={free.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-800 shrink-0" 
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-extrabold text-white text-xs tracking-tight">{free.name}</p>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-500/10 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-3xs font-mono mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        <span>{free.location.split(",")[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Rate Row */}
                  <div className="flex items-center justify-between py-2 border-y border-slate-800/60 my-3 text-[11px] font-mono">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      <span className="font-bold text-white mb-0.5">{free.rating}</span>
                      <span className="text-slate-500">({free.reviewsCount})</span>
                    </div>
                    <span className="text-slate-300 font-extrabold">{free.rate}</span>
                  </div>

                  {/* Professional Description */}
                  <p className="text-slate-400 text-3xs leading-relaxed mt-2.5 font-sans line-clamp-2">
                    {free.bio}
                  </p>

                  {/* Skills lists */}
                  <div className="flex flex-wrap gap-1 mt-3.5">
                    {free.skills.slice(0, 3).map((sk, index) => (
                      <span 
                        key={index} 
                        className="bg-slate-950/80 text-slate-300 border border-slate-800 text-3xs px-2 py-0.5 rounded"
                      >
                        {sk}
                      </span>
                    ))}
                    {free.skills.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-mono pl-1">+{free.skills.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 border-t border-slate-800/60 mt-5 flex items-center justify-between text-[11px]">
                  <span className="text-green-400 font-mono font-bold text-3xs">{free.completionRate}</span>
                  <button 
                    onClick={() => {
                      if (!currentUser) {
                        setCurrentView("auth-choice");
                      } else {
                        setCurrentView("messages");
                      }
                    }}
                    className="text-amber-400 hover:text-white transition-all font-bold flex items-center gap-1 text-3xs uppercase tracking-wider"
                  >
                    <span>Connect Live</span>
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE ESCROW COST ESTIMATOR & PLANNER (Dramatically levels up app interaction) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Info text */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-3xs font-black uppercase tracking-widest font-mono px-3 py-1 rounded-full">
                Interactive Contract Tool
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Simulate Your First Escrow Milestone.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need to hire or bid? Adjust the hourly budget and scope dynamically. See how our micro-escrow protects both clients and freelancers transparently.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-green-500/10 text-green-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-3xs text-slate-300">
                    <strong className="text-white">Secure Bank Hold:</strong> Escrow deposits are verified via CBE Birr and Chapa instantly.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-green-500/10 text-green-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-3xs text-slate-300">
                    <strong className="text-white">Zero Chargeback:</strong> Freelancers are guaranteed pay for completed, accepted milestones with absolutely no risk.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if (currentUser?.role === "client") {
                    setCurrentView("post-job");
                  } else {
                    setCurrentView("jobs");
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-2xs px-5 py-3 rounded-xl transition duration-150 inline-flex items-center gap-2"
              >
                <span>Initialize Escrow Project</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Simulated interactive card */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2.5rem] relative">
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
              
              <div className="relative z-10 space-y-6">
                
                {/* Step 1: Select Category */}
                <div className="space-y-2">
                  <label className="text-3xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block">Select Job Field</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: "development", label: "Dev" },
                      { key: "translation", label: "Translate" },
                      { key: "design", label: "Design" },
                      { key: "copywriting", label: "Writer" }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setEstimateCategory(item.key as any)}
                        className={`py-2 px-1 text-3xs font-bold rounded-xl border transition ${
                          estimateCategory === item.key 
                            ? "bg-amber-500 text-slate-950 border-amber-500 shadow-lg" 
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Choose Project Level */}
                <div className="space-y-2">
                  <label className="text-3xs uppercase font-extrabold tracking-wider text-slate-400 font-mono block">Scale Size Scope</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "small", label: "Small / MVP" },
                      { key: "medium", label: "Medium Scale" },
                      { key: "large", label: "Enterprise Pro" }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setEstimateScope(item.key as any)}
                        className={`py-2 text-3xs font-bold rounded-xl border transition ${
                          estimateScope === item.key 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg" 
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Hour slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-3xs">
                    <span className="uppercase font-extrabold tracking-wider text-slate-400 font-mono">Simulate Project Hours / Week</span>
                    <span className="font-bold text-white font-mono bg-slate-950 px-2 py-0.5 rounded">{hoursPerWeek} Hours</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="45" 
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-950 h-2.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Breakdown result */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3 font-mono text-3xs text-left">
                  <div className="flex justify-between text-slate-400">
                    <span>Matched Rate:</span>
                    <span className="text-white font-bold">{est.hourly} ETB/hr</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Core Escrow Milestone Subtotal:</span>
                    <span className="text-white font-bold">{est.weekly.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Secure Gateway Processing Fee (5%):</span>
                    <span className="text-amber-500 font-bold">+{est.fee.toLocaleString()} ETB</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2.5 flex justify-between text-xs font-bold">
                    <span className="text-slate-300 uppercase">Total Escrow Vault Lock:</span>
                    <span className="text-green-400 font-black">{est.total.toLocaleString()} ETB</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. ETHIOPIAN SUCCESS STORIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-900 to-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-3xs font-black uppercase tracking-widest font-mono px-3 py-1 rounded-full">
              Triumphs on HojiiLink
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Trust, Payouts, and Perfect Deliverables.</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">Read how clients and remote developers achieve successful partnerships under modern secure systems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={index}
                className="bg-slate-900/40 p-6 sm:p-8 rounded-[2rem] border border-slate-800/80 flex flex-col md:flex-row gap-6 relative"
              >
                <div className="shrink-0">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700" 
                  />
                </div>
                <div className="space-y-3.5 text-left flex-1 flex flex-col justify-between">
                  <p className="text-slate-300 italic text-3xs sm:text-2xs leading-relaxed">
                    "{story.quote}"
                  </p>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-white text-xs">{story.name}</p>
                      <span className="bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[9px] px-2 py-0.5 rounded-full">
                        {story.payout}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. PLAYGROUND FOR AI POSITIONING (LOCALIZED LOCAL PORTAL) */}
      <section className="bg-slate-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Try Our Interactive Bilingual AI Playground Too!</h2>
            <p className="text-slate-400 text-xs max-w-xl mx-auto">Improve your business proposal or generate custom software templates using real-time generative models below.</p>
          </div>
          
          <div className="max-w-5xl mx-auto text-left">
            <AIPositioningPanel language={language} currentUser={currentUser} getHeaders={getHeaders} />
          </div>
        </div>
      </section>

    </div>
  );
}
