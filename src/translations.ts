/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Dictionary {
  [key: string]: {
    en: string;
    om: string;
  };
}

export const translations: Dictionary = {
  // Navigation & General
  brandName: { en: "HojiiLink Ethiopia", om: "HojiiLink Itoophiyaa" },
  slogan: { en: "Your Digital Bridge to Professional Opportunities", om: "Riqicha Keessan Isa Dijitaalaa Gara Carraalee Hojii" },
  home: { en: "Home", om: "Mana" },
  browseJobs: { en: "Browse Jobs", om: "Hojiiwwan Barbaadi" },
  findFreelancers: { en: "Find Freelancers", om: "Freelancer Barbaadi" },
  postJob: { en: "Post a Job", om: "Hojii Maxxansi" },
  login: { en: "Login", om: "Seeni" },
  register: { en: "Register", om: "Galmaa'i" },
  logout: { en: "Logout", om: "Bahi" },
  backToLogin: { en: "Back to Login", om: "Gara Seensaa Deebi'i" },
  pricing: { en: "Premium Perks", om: "Faayidaalee Premium" },
  dashboard: { en: "Dashboard", om: "Gabatee Hojii" },
  messages: { en: "Messages", om: "Ergaawwan" },
  contracts: { en: "Contracts & Payments", om: "Kunturaata & Kaffaltii" },
  adminPanel: { en: "Admin Panel", om: "Bulchiinsa" },
  greeting: { en: "Welcome back", om: "Akkam jirtu" },
  language: { en: "Language", om: "Afaan" },

  // Home Hero Section
  heroTitle: { en: "Ethiopia's Premium Freelance Marketplace", om: "Gabaa Freelance Itoophiyaa Isa Beekamaa" },
  heroSub: { en: "Connecting talented Ethiopian coders, designers, translators, and creative professionals with domestic and global clients under secure escrow protection.", om: "Garaagarummaa dandeettii ogeessota barsiisaa Itoophiyaa koodessitoota, dizaayinaroota fi barreessitoota gara gabaa addunyaa fi biyya keessaa riqicha nageenyaan walitti fida." },
  exploreWork: { en: "Explore Jobs", om: "Hojiiwwan Ilaali" },
  learnMore: { en: "How It Works", om: "Akkamitti Hojjata" },
  trustedEscrow: { en: "Secure Escrow Protection with Chapa & Telebirr", om: "Eegumsa Kaffaltii Escrow Amansiisaa Chapa fi Telebirr'n" },

  // Marketplace & Filtering
  searchPlaceholder: { en: "Search jobs, skills, or titles...", om: "Hojiiwwan, dandeettii ykn maqaa dandeettii barbaadi..." },
  filterByCategory: { en: "Filter by Category", om: "Ramaddiin Addaan Baasi" },
  budgetRange: { en: "Budget Range (ETB)", om: "Hanga Horii (ETB)" },
  skillsRequired: { en: "Required Skills", om: "Dandeettii Barbaachisu" },
  noJobsFound: { en: "No jobs matching your search criteria were found.", om: "Hojiin dandeettii sitti dhiyatu argamuu hin dandeenye." },
  fixedPrice: { en: "Fixed Budget", om: "Gatii Murtaa'aa" },
  proposals: { en: "Proposals", om: "Yaadawwan Hojii" },
  applyNow: { en: "Apply for Job", om: "Hojichaaf Galmaa'i" },
  viewDetails: { en: "View Details", om: "Bal'ina Ilaali" },

  // User Auth Forms
  emailAddress: { en: "Email Address", om: "Imeelii Keessan" },
  password: { en: "Password", om: "Jecha Icchitii" },
  fullName: { en: "Full Name", om: "Maqaa Guutuu" },
  selectRole: { en: "Choose Your Role", om: "Gahee Keessan Filadhaa" },
  developerRole: { en: "I am a Freelancer looking for work", om: "Ogeessa (Freelancer) hojii barbaadu dha" },
  clientRole: { en: "I am a Client looking to hire talent", om: "Abbaa Hojii (Client) ogeessa qacaruu barbaadu dha" },
  agreeTerms: { en: "I agree to HojiiLink conditions and escrow protections.", om: "Haalawwan fi eegumsa kaffaltii HojiiLink irratti walii nan gala." },
  dontHaveAccount: { en: "Don't have an account?", om: "Herrega hin qabduu?" },
  alreadyHaveAccount: { en: "Already have an account?", om: "Duraan herrega qabdaa?" },

  // Job Submission Form
  createJobTitle: { en: "Post a New Project", om: "Hojii Haaraa Maxxansi" },
  jobTitleLabel: { en: "Job Title", om: "Maqaa Hojichaa" },
  jobCategoryLabel: { en: "Category", om: "Ramaddii Hojichaa" },
  jobDescLabel: { en: "Detailed Description", om: "Ibsa Bal'aa Hojichaa" },
  commaSkills: { en: "Required Skills (comma separated)", om: "Dandeettiiwwan Barbaachisan (komaan dhiheessi)" },
  minBudget: { en: "Minimum Budget (ETB)", om: "Horii Isa Xiqqaa (ETB)" },
  maxBudget: { en: "Maximum Budget (ETB)", om: "Horii Isa Guddaa (ETB)" },
  submitPostBtn: { en: "Publish This Job", om: "Hojii Kana Maxxansi" },

  // Proposal Submission Form
  submitProposalTitle: { en: "Submit Professional Bid", om: "Yaada Hojii (Proposal) Dhiheessi" },
  coverLetterLabel: { en: "Cover Letter / Why should we hire you?", om: "Yaada Ka'umsaa / Maaliif si qacarra?" },
  bidAmountLabel: { en: "Your Bid Amount (ETB)", om: "Gatii Ati Gaafattu (ETB)" },
  deliveryTimeline: { en: "Delivery Timeline (in Days)", om: "Guyyaa Hojicha Xumurtu (Guyyaadhaan)" },
  submitBidBtn: { en: "Post Proposal", om: "Iyyannoo Dhiheessi" },

  // Dashboard Metrics & Titles
  activeContracts: { en: "Active Contracts", om: "Kunturaata Hojjatamaa Jiru" },
  earnings: { en: "Total Earnings (ETB)", om: "Horii Argatte (ETB)" },
  spending: { en: "Total Spending (ETB)", om: "Kaffaltii Ati Goote (ETB)" },
  successRate: { en: "Completed Projects", om: "Hojiiwwan Milkaa'an" },
  noContractsFound: { en: "No active projects or contracts under management yet.", om: "Kunturaanni hojjetamaa jiru hin jiru." },
  statusFunded: { en: "Escrow Funded (Secure)", om: "Escrow Guutameera (Eegame)" },
  statusPending: { en: "Awaiting Funding", om: "Horii Eegaa Jiru" },
  statusReleased: { en: "Released to Freelancer", om: "Gara Freelancer'tti Gadi Dhihiise" },
  releasePaymentsBtn: { en: "Approve & Release Payment", om: "Mirkaneessi & Kaffaltii Gadi Dhihiisi" },
  fundMilestoneBtn: { en: "Fund Milestone Target", om: "Milestone Haaraa Kaffali" },

  // Freelancer Profiles
  skills: { en: "Skills:", om: "Dandeettiiwwan:" },
  hourlyRate: { en: "Hourly Rate:", om: "Gatii Sa'aati:" },
  portfolio: { en: "Featured Portfolio", om: "Hojiiwwan Portfolio Keessan" },
  portfolioTitle: { en: "Portfolio Title", om: "Maqaa Hojichaa" },
  addPortfolioItem: { en: "Add Portfolio Project", om: "Hojii Portfolio Dabaladhu" },
  experienceTitle: { en: "Work Experience", om: "Muxannoo Hojii" },
  educationTitle: { en: "Education History", om: "Seenaa Barnootaa" },
  verificationBadge: { en: "Verified Professional", om: "Ogeessa Mirkanaa'e" },
  premiumMembership: { en: "Featured Premium Pro", om: "Ogeessa Filatamaa Premium" },

  // Premium Page
  getPremiumTitle: { en: "Unlock Premium Startup Benefits", om: "Dandeettiiwwan Premium HojiiLink Banaa" },
  freelancerPremiumDesc: { en: "Featured profile badge, unlimited direct proposal bids, and personalized priority AI assistant matching algorithms.", om: "Maqaa dandeettii beeksifamaa, iyyannoolee yaada hojii daangaa malee fi herrega AI ogeessa sitti fidu." },
  clientPremiumDesc: { en: "Highlight jobs at top of homepage list, access deep AI applicant ranking tools, and get 24/7 dedicated local managers.", om: "Hojiiwwan keessan fuula dura irratti maxxansuu, madaallii yaada hojii AI ogeessaa fayyadamuu fi deeggersa bilbilaa argachuu." },
  upgradeNowBtn: { en: "Upgrade to Premium Pro - 450 ETB/month", om: "Gara Premium Ol Guddifadhu - 450 ETB/Ji'atti" },
  paymentSimulated: { en: "Payment will be automatically processed securely via Chapa Portal", om: "Kaffaltiin kun Chapa Portal kaffaltii nagaatiin raawwatama" },

  // Admin Panel
  adminOverview: { en: "System Analytics & Moderations", om: "Xiinxala Sirnaa & Giraafii" },
  platformUsers: { en: "Registered User Profiles", om: "Ogeessota & Abbaa Hojii" },
  verifyUserBtn: { en: "Grant Verified Badge", om: "Maqaa Mirkaneessi" },
  revokeVerifyBtn: { en: "Revoke Verification", om: "Mirkaneessa Kaasi" },
  verifyActiveJobs: { en: "Active Jobs Posted", om: "Hojiiwwan Maxxanfaman" },
  totalCapitalEscrow: { en: "Total Capital Escrow (ETB)", om: "Horii Escrow Keessa Jiru (ETB)" },
  revenueSystem: { en: "Platform Commission Earnings", om: "Kaffaltii Komishinii Platform" },

  // Chat Rooms
  startChatTitle: { en: "Secure Direct Chat", om: "Haasawa Nagaa Direct Chat" },
  typeMessagePlaceholder: { en: "Type your message in English or Afaan Oromo...", om: "Ergaa keessan jalqabaa barreessaa..." },
  sendMessageBtn: { en: "Send", om: "Ergi" },

  // AI Feature labels
  aiTranslating: { en: "AI Live Translator", om: "Hiika Hojii AI" },
  translateBtn: { en: "Translate to Afaan Oromo", om: "Gara Afaan Oromootti Hiiki" },
  translateToEnBtn: { en: "Translate to English", om: "Gara Afaan Ingiliffaatti Hiiki" }
};
