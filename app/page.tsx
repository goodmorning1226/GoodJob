"use client";

import { useEffect, useState } from "react";
import ExperienceFlow, { type NewExperience } from "./ExperienceFlow";
import ExperienceLibrary from "./ExperienceLibrary";
import JobAnalysis from "./JobAnalysis";
import ResumeBuilder from "./ResumeBuilder";
import AudienceGate from "./AudienceGate";
import EnterprisePortal from "./EnterprisePortal";
import ProductGuide from "./ProductGuide";
import ProfileEditModal, { type TalentProfile } from "./ProfileEditModal";
import { writeEvidence } from "./ExperienceEvidence";
import ChatWorkspace from "./ChatWorkspace";

const navItems = [
  { label: "首頁" },
  { label: "我的經驗" },
  { label: "我的履歷" },
  { label: "職缺探索" },
];

const skillGroups = {
  "核心能力": [
    ["使用者研究", 92, "4 段經驗", "證據充分"], ["產品企劃", 84, "3 段經驗", "證據充分"], ["資料分析", 72, "3 段經驗", "持續成長"], ["簡報溝通", 68, "4 段經驗", "證據充分"], ["跨部門協作", 55, "2 段經驗", "待補充"],
  ],
  "工具技能": [["Figma", 88, "3 段經驗", "證據充分"], ["Excel", 70, "2 段經驗", "有部分證據"], ["GA4", 46, "1 段經驗", "待補充"]],
  "領域知識": [["數位產品", 86, "4 段經驗", "證據充分"], ["教育科技", 61, "2 段經驗", "有部分證據"], ["校園服務", 78, "3 段經驗", "證據充分"]],
};

const experienceTypeTone: Record<string, string> = {
  "實習": "internship",
  "正職": "work",
  "工作": "work",
  "競賽": "competition",
  "專案": "project",
  "修課": "course",
  "社團": "club",
  "研究": "research",
};

const experienceDistributionCategories = [
  { label: "專案", types: ["專案"], color: "var(--type-project-border)" },
  { label: "正職", types: ["正職", "工作"], color: "var(--type-work-border)" },
  { label: "實習", types: ["實習"], color: "var(--type-internship-border)" },
  { label: "競賽", types: ["競賽"], color: "var(--type-competition-border)" },
  { label: "修課", types: ["修課"], color: "var(--type-course-border)" },
  { label: "社團", types: ["社團"], color: "var(--type-club-border)" },
  { label: "研究", types: ["研究"], color: "var(--type-research-border)" },
  { label: "其他", types: [], color: "var(--type-other-border)" },
];

const initialExperiences: NewExperience[] = [
  {
    type: "實習", date: "2025.07 — 2025.12", title: "產品實習生", org: "木星數位科技",
    description: "參與使用者研究與需求分析，將 12 場訪談洞察整理為產品優化提案。",
    tags: ["使用者研究", "產品企劃"], color: "#1c7c67",
  },
  {
    type: "競賽", date: "2025.03 — 2025.05", title: "校園創新商業競賽", org: "全國大專創新提案競賽",
    description: "負責市場研究與提案策略，帶領團隊完成驗證並獲得全國第二名。",
    tags: ["市場研究", "簡報溝通"], color: "#7457c6",
  },
  {
    type: "專案", date: "2024.09 — 2025.01", title: "校園活動探索 App", org: "互動設計課程專案",
    description: "從問題定義到原型測試，完成一套協助學生探索校園活動的服務流程。",
    tags: ["Figma", "服務設計"], color: "#d47b4a",
  },
  {
    type: "修課", date: "2024.09 — 2025.01", title: "服務設計", org: "國立大學 · 課堂專案：校園二手書交換服務",
    description: "學習服務藍圖、使用者研究與原型測試，並在課堂專案中負責訪談規劃、洞察整理與互動原型。",
    tags: ["服務設計", "使用者研究", "Figma"], color: "#3b78a0",
  },
  {
    type: "社團", date: "2024.02 — 2024.08", title: "設計思考工作坊召集人", org: "大學創新設計社",
    description: "規劃並執行 4 場設計思考工作坊，累積超過 120 位學生參與。",
    tags: ["活動企劃", "團隊協作", "引導技巧"], color: "#b26c86",
  },
  {
    type: "研究", date: "2023.10 — 2024.01", title: "生成式 AI 學習行為研究", org: "資訊管理專題研究",
    description: "整理 186 份問卷與訪談資料，分析學生採用生成式 AI 的主要行為模式。",
    tags: ["資料分析", "問卷設計", "Excel"], color: "#4e82a6",
  },
  {
    type: "競賽", date: "2023.05 — 2023.07", title: "永續校園提案挑戰", org: "青年永續創新競賽",
    description: "以校園剩食問題為題完成服務提案，進入決賽前十名。",
    tags: ["問題定義", "市場研究", "提案"], color: "#809a47",
  },
  {
    type: "專案", date: "2023.02 — 2023.06", title: "社群內容成效分析", org: "數位行銷課程專案",
    description: "分析三個月社群數據並調整內容策略，讓平均互動率提升 24%。",
    tags: ["資料分析", "內容策略", "Excel"], color: "#cf7f44",
  },
  {
    type: "社團", date: "2022.09 — 2023.01", title: "迎新活動企劃", org: "資訊管理學系學會",
    description: "與 12 人團隊規劃 200 人迎新活動，負責參與者流程與現場協調。",
    tags: ["活動企劃", "溝通協調"], color: "#7c71b5",
  },
];

export default function Home() {
  const [audience, setAudience] = useState<"user" | "business" | null>(null);
  const [notice, setNotice] = useState("");
  const [experiences, setExperiences] = useState(initialExperiences);
  const [showExperienceFlow, setShowExperienceFlow] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [profile, setProfile] = useState<TalentProfile>({
    name: "宋宇倫",
    bio: "喜歡把模糊問題拆成可以研究與驗證的方向，具備使用者研究、產品企劃與資料分析經驗。",
    avatar: "",
  });
  const [activeView, setActiveView] = useState("首頁");
  const [resumeTarget, setResumeTarget] = useState<string | undefined>();
  const [showJobResumeFlow, setShowJobResumeFlow] = useState(false);
  const [showGeneratedResumeEditor, setShowGeneratedResumeEditor] = useState(false);
  const [skillGroup, setSkillGroup] = useState<keyof typeof skillGroups>("核心能力");

  useEffect(() => {
    const legacyKey = ["path", "ly-experiences-v1"].join("");
    const stored = window.localStorage.getItem("goodjob-experiences-v1") || window.localStorage.getItem(legacyKey);
    if (stored) {
      const timer = window.setTimeout(() => {
        try {
          setExperiences(JSON.parse(stored));
          window.localStorage.setItem("goodjob-experiences-v1", stored);
        } catch { window.localStorage.removeItem("goodjob-experiences-v1"); }
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => { window.localStorage.setItem("goodjob-experiences-v1", JSON.stringify(experiences)); }, [experiences]);

  const hasNewExperience = experiences.length > initialExperiences.length;
  const knownDistributionTypes = new Set(experienceDistributionCategories.flatMap((category) => category.types));
  const distributionData = experienceDistributionCategories
    .map((category) => {
      const count = category.label === "其他"
        ? experiences.filter((experience) => !knownDistributionTypes.has(experience.type)).length
        : experiences.filter((experience) => category.types.includes(experience.type)).length;
      return { ...category, count, percentage: experiences.length ? Math.round(count / experiences.length * 100) : 0 };
    })
    .sort((first, second) => second.count - first.count);
  let distributionCursor = 0;
  const distributionGradient = experiences.length
    ? `conic-gradient(${distributionData.map((category) => {
      const start = distributionCursor;
      distributionCursor += category.count / experiences.length * 100;
      return `${category.color} ${start}% ${distributionCursor}%`;
    }).join(", ")})`
    : "#e7ece8";

  function previewFeature(label: string) {
    setNotice(`${label}將在下一個 Prototype 階段開放`);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function completeExperience(experience: NewExperience) {
    const { evidence = [], ...experienceRecord } = experience;
    if (evidence.length) writeEvidence(experienceRecord.title, evidence);
    setExperiences((current) => [experienceRecord, ...current]);
    setShowExperienceFlow(false);
    setNotice("經驗已儲存，Dashboard 也同步更新了");
    window.setTimeout(() => setNotice(""), 3000);
  }

  function resetTalentPrototype() {
    ["goodjob-experiences-v1", "goodjob-evidence-v1", "goodjob-resume-experience-links-v1", "goodjob-chat-messages-v1"].forEach((key) => window.localStorage.removeItem(key));
    setExperiences(initialExperiences);
    setProfile({
      name: "宋宇倫",
      bio: "喜歡把模糊問題拆成可以研究與驗證的方向，具備使用者研究、產品企劃與資料分析經驗。",
      avatar: "",
    });
    setShowExperienceFlow(false);
    setShowJobResumeFlow(false);
    setShowGeneratedResumeEditor(false);
    setResumeTarget(undefined);
    setActiveView("首頁");
    setNotice("人才端示範資料已重設");
    window.setTimeout(() => setNotice(""), 2400);
  }

  function handleNavigation(label: string) {
    if (label === "首頁分析" || label === "職涯分析") {
      setActiveView("首頁");
      window.setTimeout(() => document.getElementById("home-career-analysis")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      return;
    }
    if (["首頁", "我的經驗", "我的履歷", "職缺探索", "聊天室"].includes(label)) {
      if (label !== "我的履歷") {
        setShowGeneratedResumeEditor(false);
        if (!showJobResumeFlow) setResumeTarget(undefined);
      }
      setActiveView(label);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    previewFeature(label);
  }

  if (!audience) return <>
    <AudienceGate onSelect={setAudience} onShowGuide={() => setShowGuide(true)} />
    {showGuide && <ProductGuide audience="talent" onClose={() => setShowGuide(false)} onReset={resetTalentPrototype} onNavigate={(view) => { setAudience("user"); handleNavigation(view); }} />}
  </>;
  if (audience === "business") return <EnterprisePortal onSwitchRole={() => setAudience(null)} />;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GoodJob</span>
          <button className="brand-guide-button" onClick={() => setShowGuide(true)} aria-label="產品導覽"><span aria-hidden="true">?</span></button>
        </div>

        <nav className="primary-nav" aria-label="主要導覽">
          {navItems.map((item) => (
            <button className={`nav-item ${activeView === item.label ? "active" : ""}`} key={item.label} onClick={() => handleNavigation(item.label)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item role-switch-button" onClick={() => setAudience(null)}><span className="nav-icon">⇄</span>切換展示身分</button>
          <div className="profile-mini-row">
            <button className="profile-mini profile-mini-trigger" onClick={() => setShowProfileEditor(true)} aria-label="編輯個人資料">
              <span className={profile.avatar ? "avatar has-image" : "avatar"} style={profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : undefined}>{!profile.avatar && (profile.name.slice(-1) || "人")}</span>
              <span><strong>{profile.name}</strong></span>
            </button>
            <button className={`profile-chat-button${activeView === "聊天室" ? " active" : ""}`} type="button" aria-label="開啟聊天室" onClick={() => { setActiveView("聊天室"); window.scrollTo({ top: 0, behavior: "smooth" }); }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14v10H9l-4 3v-13Z" /><path d="M8.5 9h7M8.5 12h5" /></svg></button>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <div className="content">
          {activeView === "首頁" && <div className="home-page page-enter">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">THURSDAY, AUGUST 27</p>
              <h1>早安，{profile.name.length >= 3 ? profile.name.slice(-2) : profile.name} <span>👋</span></h1>
              <p>你的努力都會轉化成你的能力。查看你的職涯分析。</p>
            </div>
          </section>

          <section className="hero-grid">
            <article className="career-card">
              <div className="career-copy">
                <span className="soft-label">你的職涯定位</span>
                <h2>以使用者洞察為起點，<br />逐步走向產品決策與影響力。</h2>
                <p>具備使用者研究、產品企劃與資料分析經驗，能從模糊問題中整理需求，並透過訪談與原型驗證提出具體方向。</p>
              </div>
              <div className="career-visual">
                <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
                <div className="orbit-dot dot-one" aria-hidden="true" /><div className="orbit-dot dot-two" aria-hidden="true" />
                <button className="center-gem career-metric-gem" onClick={() => handleNavigation("我的經驗")} aria-label="前往我的經驗">
                  <strong><b>{experiences.length}</b> <span>段經驗</span></strong>
                  <small>本月新增 <b>{hasNewExperience ? 1 : 2}</b> 段</small>
                </button>
                <button className="skill-gem career-metric-gem" onClick={() => handleNavigation("我的履歷")} aria-label="前往我的履歷">
                  <strong><b>{hasNewExperience ? 21 : 18}</b> <span>項技能</span></strong>
                  <small>本月新增 <b>3</b> 項</small>
                </button>
              </div>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="panel experiences-panel">
              <div className="panel-header"><div><span className="soft-label">RECENT</span><h3>最近經驗</h3></div><button className="panel-view-all" onClick={() => handleNavigation("我的經驗")}>查看全部 <span aria-hidden="true">→</span></button></div>
              <div className="experience-list">
                {experiences.slice(0, 3).map((experience) => (
                  <button className="experience-item" key={experience.title} onClick={() => handleNavigation("我的經驗")}>
                    <span className="timeline-pin" style={{ color: `var(--type-${experienceTypeTone[experience.type] ?? "other"})`, background: `var(--type-${experienceTypeTone[experience.type] ?? "other"})` }} />
                    <span className="experience-date">{experience.date}</span>
                    <span className="experience-content">
                      <span className="experience-meta"><em className={`experience-type experience-type-${experienceTypeTone[experience.type] ?? "other"}`}>{experience.type === "工作" ? "正職" : experience.type}</em><span>{experience.org}</span></span>
                      <strong>{experience.title}</strong>
                      <span className="experience-description">{experience.description}</span>
                      <span className="tag-row">{experience.tags.map((tag) => <i key={tag}>{tag}</i>)}</span>
                    </span><span className="item-arrow">›</span>
                  </button>
                ))}
              </div>
            </article>

            <div className="right-column">
              <article className="panel skills-panel">
                <div className="analysis-panel-header"><div><span className="page-kicker">SKILL EVIDENCE</span><h3>技能與證據</h3></div><button className="panel-view-all" onClick={() => handleNavigation("我的履歷")}>查看全部 <span aria-hidden="true">→</span></button></div>
                <div className="analysis-tabs">{Object.keys(skillGroups).map((group) => <button className={skillGroup === group ? "active" : ""} key={group} onClick={() => setSkillGroup(group as keyof typeof skillGroups)}>{group}</button>)}</div>
                <div className="evidence-skill-list home-evidence-skill-list">
                  {skillGroups[skillGroup].slice(0, 3).map(([name, score, sources, status], index) => <button key={String(name)} onClick={() => previewFeature(String(name))}>
                    <span className="skill-number">{String(index + 1).padStart(2, "0")}</span><span className="skill-name"><strong>{name}</strong><small>{sources}</small></span><span className="analysis-skill-bar"><i style={{ width: String(score) + "%" }} /></span><span className={"evidence-status status-" + (index > 3 ? "weak" : index > 1 ? "growing" : "strong")}>{status}</span>
                  </button>)}
                </div>
              </article>

              <article className="panel recent-actions-panel">
                <div className="recent-actions-content">
                  <section className="recent-action-row resume-action-row">
                    <div className="recent-action-copy"><small>正在編輯的履歷</small><strong>Orbit APM 履歷</strong></div>
                    <button className="recent-action-button" onClick={() => handleNavigation("我的履歷")}>繼續編輯</button>
                  </section>
                  <section className="recent-action-row">
                    <div className="recent-action-copy job-action-copy"><small>可能適合的職缺</small><div className="job-action-main"><button className="recent-job-link" onClick={() => handleNavigation("職缺探索")}><strong>Orbit 數位產品 · Associate Product Manager</strong></button><button className="recent-action-button" onClick={() => handleNavigation("職缺探索")}>探索更多</button></div></div>
                  </section>
                </div>
              </article>
            </div>
          </section>

          <section className="home-career-analysis" id="home-career-analysis">
            <div className="home-analysis-heading"><div><span className="page-kicker">CAREER OVERVIEW</span><h2>職涯全貌與成長軌跡</h2></div></div>
            <div className="home-analysis-grid">
              <article className="analysis-panel distribution-panel">
                <div className="analysis-panel-header"><div><span className="page-kicker">EXPERIENCE MIX</span><h3>經驗分布</h3></div></div>
                <div className="distribution-chart">
                  <div className="donut" style={{ background: distributionGradient }}><span><strong>{experiences.length}</strong>段經驗</span></div>
                  <ul>{distributionData.map((category) => <li key={category.label}><i style={{ background: category.color }} /><span>{category.label}（{category.count}項）</span><b>{category.percentage}%</b></li>)}</ul>
                </div>
                <p className="distribution-note"><span>✦</span>你的經驗以實作專案為主，已具備明確方向；下一步可增加真實商業情境中的成果證據。</p>
              </article>

              <article className="analysis-panel growth-panel">
                <div className="analysis-panel-header"><div><span className="page-kicker">GROWTH TIMELINE</span><h3>能力發展軌跡</h3></div></div>
                <div className="growth-track"><div className="growth-line" />{[
                  ["2023", "開始探索", "課程中首次進行訪談與資料整理", "參與者"], ["2024", "方法建立", "獨立規劃研究並完成互動原型", "執行者"], ["2025", "跨域整合", "將研究洞察轉為產品與提案方向", "規劃者"], ["2026", "擴大影響", "主導完整流程並協調團隊推進", "負責人"], ["未來", "下一步行動", "補強真實商業情境中的成果證據", "行動建議"],
                ].map(([year, stage, text, role], index) => <div className={"growth-node node-" + (index + 1)} key={year}><span>{year}</span><i /><div><small>{role}</small><strong>{stage}</strong><p>{text}</p></div></div>)}</div>
              </article>
            </div>

          </section>
          </div>}
          {activeView === "我的經驗" && <ExperienceLibrary experiences={experiences} onAdd={() => setShowExperienceFlow(true)} onUpdate={(original, updated) => setExperiences((current) => current.map((item) => item === original ? updated : item))} />}
          {activeView === "我的履歷" && <ResumeBuilder experiences={experiences} initialTarget={resumeTarget} startInEditor={showGeneratedResumeEditor} onLibraryOpen={() => { setShowGeneratedResumeEditor(false); setResumeTarget(undefined); }} />}
          {activeView === "職缺探索" && <JobAnalysis onCreateResume={(target) => { setResumeTarget(target); setShowJobResumeFlow(true); }} />}
          {activeView === "聊天室" && <ChatWorkspace audience="talent" />}
        </div>
      </section>

      {notice && <div className="toast" role="status"><span>✦</span>{notice}</div>}
      {showExperienceFlow && <ExperienceFlow onClose={() => setShowExperienceFlow(false)} onComplete={completeExperience} />}
      {showJobResumeFlow && <ResumeBuilder key={`job-resume-${resumeTarget}`} experiences={experiences} initialTarget={resumeTarget} embedded onClose={() => { setShowJobResumeFlow(false); setResumeTarget(undefined); }} onGenerated={() => { setShowJobResumeFlow(false); setShowGeneratedResumeEditor(true); handleNavigation("我的履歷"); }} />}
      {showGuide && <ProductGuide audience="talent" onClose={() => setShowGuide(false)} onReset={resetTalentPrototype} onNavigate={handleNavigation} />}
      {showProfileEditor && <ProfileEditModal profile={profile} onClose={() => setShowProfileEditor(false)} onSave={(nextProfile) => { setProfile(nextProfile); setShowProfileEditor(false); setNotice("個人資料已更新"); window.setTimeout(() => setNotice(""), 2400); }} />}
      <nav className="mobile-bottom-nav" aria-label="手機主要導覽">{[{label:"首頁",icon:"⌂"},{label:"我的經驗",icon:"◇"},{label:"我的履歷",icon:"▤"},{label:"職缺探索",icon:"◎"},{label:"聊天室",icon:"▢"}].map((item) => <button className={activeView === item.label ? "active" : ""} key={item.label} onClick={() => item.label === "聊天室" ? setActiveView("聊天室") : handleNavigation(item.label)}><span>{item.icon}</span>{item.label === "我的經驗" ? "經驗" : item.label === "我的履歷" ? "履歷" : item.label === "職缺探索" ? "探索" : item.label}</button>)}</nav>
    </main>
  );
}
