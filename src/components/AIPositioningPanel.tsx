/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, HelpCircle, Activity, Edit3, Compass, RefreshCw, Layers, Terminal } from "lucide-react";

interface AIPositioningPanelProps {
  language: "EN" | "OM";
  currentUser: any;
  getHeaders: () => any;
}

export default function AIPositioningPanel({ language, currentUser, getHeaders }: AIPositioningPanelProps) {
  const [activeTab, setActiveTab] = useState<"translate" | "jobDesc" | "proposal" | "cv" | "cost" | "interview">("translate");

  // State Management
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Translation States
  const [transInput, setTransInput] = useState("");
  const [transTarget, setTransTarget] = useState<"English" | "Afaan Oromo">("Afaan Oromo");

  // Job description States
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("Software Development");
  const [keyPoints, setKeyPoints] = useState("");

  // Proposal States
  const [targetTitle, setTargetTitle] = useState("");
  const [targetDesc, setTargetDesc] = useState("");
  const [freelancerSkills, setFreelancerSkills] = useState("");

  // CV / Portfolio States
  const [titleForCV, setTitleForCV] = useState("");
  const [bioForCV, setBioForCV] = useState("");
  const [skillsForCV, setSkillsForCV] = useState("");

  // Project Cost States
  const [scopeDetails, setScopeDetails] = useState("");
  const [complexity, setComplexity] = useState("Medium");
  const [devDays, setDevDays] = useState("7");

  // Interview States
  const [roleTitle, setRoleTitle] = useState("");
  const [keyTopics, setKeyTopics] = useState("");

  const safeJson = async (res: Response, fallback: any = null) => {
    try {
      const text = await res.text();
      if (!text || text.trim() === "") return fallback;
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  };

  const runAIService = async (endpoint: string, payload: any) => {
    setLoading(true);
    setResult("");
    setError(null);
    try {
      const res = await fetch(`/api/gemini/${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await safeJson(res, {});
        setResult(data.text);
      } else {
        const errData = await safeJson(res, {});
        setError(errData.error || "Unable to run Gemini AI service.");
      }
    } catch {
      setError("Network or server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {language === "OM" ? "Wiirtuu Gargaarsa AI" : "Gemini AI Smart Assistant Hub"}
            </h3>
            <p className="text-xs text-slate-400">
              {language === "OM" ? "HojiiLink Ethiopia meeshaalee humna qabaniin guutameera." : "High-fidelity natural language modules for professional branding."}
            </p>
          </div>
        </div>
        <span className="text-2xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
          Powered by Gemini 3.5
        </span>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 mb-6 text-xs border-b border-slate-800/60 pb-3">
        <button
          onClick={() => { setActiveTab("translate"); setResult(""); setError(null); }}
          className={`px-3 py-1.5 rounded-lg border transition ${
            activeTab === "translate" 
              ? "bg-amber-500 text-slate-950 border-amber-400 font-medium" 
              : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {language === "OM" ? "Hiika Afaanii" : "Live Translator"}
        </button>
        <button
          onClick={() => { setActiveTab("jobDesc"); setResult(""); setError(null); }}
          className={`px-3 py-1.5 rounded-lg border transition ${
            activeTab === "jobDesc" 
              ? "bg-amber-500 text-slate-950 border-amber-400 font-medium" 
              : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {language === "OM" ? "Maxxansa Ibsa Hojii" : "Job Desc Writer"}
        </button>
        <button
          onClick={() => { setActiveTab("proposal"); setResult(""); setError(null); }}
          className={`px-3 py-1.5 rounded-lg border transition ${
            activeTab === "proposal" 
              ? "bg-amber-500 text-slate-950 border-amber-400 font-medium" 
              : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {language === "OM" ? "Yaada Hojii (Proposal)" : "Proposal Composer"}
        </button>
        <button
          onClick={() => { setActiveTab("cv"); setResult(""); setError(null); }}
          className={`px-3 py-1.5 rounded-lg border transition ${
            activeTab === "cv" 
              ? "bg-amber-500 text-slate-950 border-amber-400 font-medium" 
              : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {language === "OM" ? "Milaalicha CV/Bio" : "CV Helper"}
        </button>
        <button
          onClick={() => { setActiveTab("cost"); setResult(""); setError(null); }}
          className={`px-3 py-1.5 rounded-lg border transition ${
            activeTab === "cost" 
              ? "bg-amber-500 text-slate-950 border-amber-400 font-medium" 
              : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {language === "OM" ? "Maddii Horii (Cost)" : "Cost Estimator"}
        </button>
        <button
          onClick={() => { setActiveTab("interview"); setResult(""); setError(null); }}
          className={`px-3 py-1.5 rounded-lg border transition ${
            activeTab === "interview" 
              ? "bg-amber-500 text-slate-950 border-amber-400 font-medium" 
              : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {language === "OM" ? "Gaaffiilee Qormaataa" : "Interview Prep"}
        </button>
      </div>

      {/* Render active tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          {activeTab === "translate" && (
            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-medium block">
                {language === "OM" ? "Barruu hiikamuuf dhihaate" : "English or Afaan Oromo text to translate"}
              </label>
              <textarea
                value={transInput}
                onChange={(e) => setTransInput(e.target.value)}
                placeholder={language === "OM" ? "Asitti barreessi..." : "Enter keywords, expressions, job bios..."}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-2xs text-slate-400 block mb-1">Target Language</label>
                  <select
                    value={transTarget}
                    onChange={(e: any) => setTransTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-xs text-slate-200"
                  >
                    <option value="Afaan Oromo">Afaan Oromo</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <button
                  disabled={loading}
                  onClick={() => runAIService("translate", { text: transInput, targetLang: transTarget })}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium px-4 py-2 rounded text-xs self-end h-[34px] flex items-center justify-center gap-2"
                >
                  {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                  {language === "OM" ? "Hiiki" : "Translate"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "jobDesc" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Bilingual fintech screen localizer"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Category</label>
                <input
                  type="text"
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Core points / Skills</label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="e.g. Remote timeline, native Afaan Oromo, escrow secure"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs"
                />
              </div>
              <button
                disabled={loading}
                onClick={() => runAIService("generate-job-desc", { title: jobTitle, category: jobCategory, keyPoints })}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium py-2 rounded text-xs flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                {language === "OM" ? "Ibsa Barreessi" : "Draft Description"}
              </button>
            </div>
          )}

          {activeTab === "proposal" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Job Title on Bid</label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  placeholder="e.g. Translations for cooperatives"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Job Details (Optional)</label>
                <textarea
                  value={targetDesc}
                  onChange={(e) => setTargetDesc(e.target.value)}
                  placeholder="Paste brief parameters..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">My Skills & Bio Highlight</label>
                <input
                  type="text"
                  value={freelancerSkills}
                  onChange={(e) => setFreelancerSkills(e.target.value)}
                  placeholder="React, CSS, native Oromo speaker"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <button
                disabled={loading}
                onClick={() => runAIService("generate-proposal", { jobTitle: targetTitle, jobDesc: targetDesc, skills: freelancerSkills })}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium py-2 rounded text-xs flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                {language === "OM" ? "Ka'umsa Barreessi" : "Generate Custom Bid"}
              </button>
            </div>
          )}

          {activeTab === "cv" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">My Professional Speciality</label>
                <input
                  type="text"
                  value={titleForCV}
                  onChange={(e) => setTitleForCV(e.target.value)}
                  placeholder="e.g. Mobile Developer and UI Designer"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Core Skills</label>
                <input
                  type="text"
                  value={skillsForCV}
                  onChange={(e) => setSkillsForCV(e.target.value)}
                  placeholder="TypeScript, Figma, translation"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Biography description</label>
                <textarea
                  value={bioForCV}
                  onChange={(e) => setBioForCV(e.target.value)}
                  placeholder="Write a brief professional summary..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs"
                />
              </div>
              <button
                disabled={loading}
                onClick={() => runAIService("cv-check", { title: titleForCV, skills: skillsForCV, bio: bioForCV })}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium py-2 rounded text-xs flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                {language === "OM" ? "CV Mirkaneessi" : "Evaluate & Optimize CV / Bio"}
              </button>
            </div>
          )}

          {activeTab === "cost" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Project Scope & Features</label>
                <textarea
                  value={scopeDetails}
                  onChange={(e) => setScopeDetails(e.target.value)}
                  placeholder="Build localized landing page with Chapa pay webhooks..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Complexity</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-xs"
                  >
                    <option value="Low">Low (Simple Single View)</option>
                    <option value="Medium">Medium (Database + Logic)</option>
                    <option value="High">High (Fintech / Native Mobile)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Dev Timeline (Days)</label>
                  <input
                    type="number"
                    value={devDays}
                    onChange={(e) => setDevDays(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-xs"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => runAIService("cost-estimate", { scope: scopeDetails, complexity, devDays })}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium py-2 rounded text-xs flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                {language === "OM" ? "Gatii Tilmaami" : "Calculate Estimated Price"}
              </button>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Target Role</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Translation coordinator or React Dev"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Topics / Focus</label>
                <input
                  type="text"
                  value={keyTopics}
                  onChange={(e) => setKeyTopics(e.target.value)}
                  placeholder="Afaan Oromo localization flow, React patterns"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <button
                disabled={loading}
                onClick={() => runAIService("interview-questions", { roleTitle, keyTopics })}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium py-2 rounded text-xs flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                {language === "OM" ? "Gaaffii Qopheessi" : "Generate Interview prep Kit"}
              </button>
            </div>
          )}
        </div>

        {/* AI OUTPUT CONTAINER */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl h-full flex flex-col min-h-[295px]">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3 text-2xs font-mono text-slate-400 uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Response Output terminal</span>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 py-10">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs font-medium animate-pulse">Gemini model is processing, please hold...</p>
            </div>
          ) : error ? (
            <div className="flex-1 text-red-400 text-xs py-2">
              <p className="font-semibold mb-1">AI execution missed:</p>
              <p className="bg-red-950/20 p-3 rounded border border-red-900/30 font-mono text-3xs">{error}</p>
            </div>
          ) : result ? (
            <div className="flex-1 text-slate-200 text-xs prose prose-invert overflow-y-auto max-h-[350px] whitespace-pre-wrap pr-1">
              {result}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-10">
              <Compass className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-xs">Your drafted output will appear here.</p>
              <p className="text-3xs text-slate-600 max-w-[200px] mt-1">Configured using the highest-speed server-side cognitive proxy model.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
