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
import { readEvidence, writeEvidence } from "./ExperienceEvidence";

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

const careerInsights = [
  { label: "主要優勢", icon: "↗", title: "把研究洞察轉成產品方向", text: "你在 4 段不同經驗中都完成了從問題探索、洞察整理到方案提出的流程，這是目前證據最完整的能力組合。", source: "來自產品實習、商業競賽與 2 個課程專案" },
  { label: "可轉移能力", icon: "⌁", title: "從簡報溝通延伸到跨部門協作", text: "你多次負責提案與成果呈現。若補充如何協調不同意見，這些經驗可進一步支持跨部門協作能力。", source: "來自競賽提案、社團活動與實習成果發表" },
  { label: "建議補強", icon: "＋", title: "為資料分析補上決策影響", text: "目前記錄了分析方法，但較少描述分析結果如何影響產品或團隊決策。補充一項前後差異會更有說服力。", source: "檢視 3 段含資料分析的經驗" },
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

function Sparkline() {
  return (
    <div className="sparkline" aria-label="近六個月經驗累積趨勢">
      {[34, 45, 42, 61, 66, 83, 78, 96].map((height, index) => (
        <span key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export default function Home() {
  const [audience, setAudience] = useState<"user" | "business" | null>(null);
  const [notice, setNotice] = useState("");
  const [period, setPeriod] = useState("近 12 個月");
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
  const [skillGroup, setSkillGroup] = useState<keyof typeof skillGroups>("核心能力");
  const [insight, setInsight] = useState(0);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [summaryCopied, setSummaryCopied] = useState(false);

  useEffect(() => {
    const legacyKey = ["path", "ly-experiences-v1"].join("");
    const stored = window.localStorage.getItem("goodjob-experiences-v1") || window.localStorage.getItem(legacyKey);
    if (stored) {
      try {
        setExperiences(JSON.parse(stored));
        window.localStorage.setItem("goodjob-experiences-v1", stored);
      } catch { window.localStorage.removeItem("goodjob-experiences-v1"); }
    }
  }, []);

  useEffect(() => { window.localStorage.setItem("goodjob-experiences-v1", JSON.stringify(experiences)); }, [experiences]);

  useEffect(() => {
    setEvidenceCount(Object.values(readEvidence()).flat().length);
  }, [experiences]);

  const hasNewExperience = experiences.length > initialExperiences.length;

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

  async function copyCareerSummary() {
    const summary = "具備使用者研究、產品企劃與資料分析經驗，能從模糊問題中整理需求，並透過訪談與原型驗證提出具體方向。";
    try {
      await navigator.clipboard.writeText(summary);
      setSummaryCopied(true);
      window.setTimeout(() => setSummaryCopied(false), 1800);
    } catch {
      setNotice("目前無法存取剪貼簿，請稍後再試");
      window.setTimeout(() => setNotice(""), 2400);
    }
  }

  function handleNavigation(label: string) {
    if (label === "首頁分析" || label === "職涯分析") {
      setActiveView("首頁");
      window.setTimeout(() => document.getElementById("home-career-analysis")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      return;
    }
    if (["首頁", "我的經驗", "我的履歷", "職缺探索"].includes(label)) {
      setActiveView(label);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    previewFeature(label);
  }

  if (!audience) return <AudienceGate onSelect={setAudience} />;
  if (audience === "business") return <EnterprisePortal onSwitchRole={() => setAudience(null)} />;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GoodJob</span>
          <button className="brand-guide-button" onClick={() => setShowGuide(true)} aria-label="產品導覽">i</button>
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
          <button className="profile-mini profile-mini-trigger" onClick={() => setShowProfileEditor(true)} aria-label="編輯個人資料">
            <span className={profile.avatar ? "avatar has-image" : "avatar"} style={profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : undefined}>{!profile.avatar && (profile.name.slice(-1) || "人")}</span>
            <span><strong>{profile.name}</strong></span>
          </button>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">G</span><strong>GoodJob</strong></div>
          <label className="search-box">
            <span>⌕</span><input aria-label="搜尋經驗與技能" placeholder="搜尋經驗、技能或職缺" />
          </label>
          <div className="top-actions">
            <button className="icon-button" aria-label="通知">○<span className="notification-dot" /></button>
            <button className="add-button" onClick={() => setShowExperienceFlow(true)}>＋ 新增經驗</button>
          </div>
        </header>

        <div className="content">
          {activeView === "首頁" && <>
          <section className="welcome-row">
            <div>
              <p className="eyebrow">THURSDAY, AUGUST 27</p>
              <h1>早安，{profile.name.length >= 3 ? profile.name.slice(-2) : profile.name} <span>👋</span></h1>
              <p>每一段經驗都值得被好好記住。這是你目前的職涯全貌。</p>
            </div>
            <select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="選擇資料期間">
              <option>近 12 個月</option><option>全部時間</option><option>今年</option>
            </select>
          </section>

          <section className="hero-grid">
            <article className="career-card">
              <div className="career-copy">
                <span className="soft-label">你的職涯定位</span>
                <h2>以使用者洞察為起點，<br />逐步走向產品決策與影響力。</h2>
                <p>具備使用者研究、產品企劃與資料分析經驗，能從模糊問題中整理需求，並透過訪談與原型驗證提出具體方向。</p>
                <div className="career-card-actions">
                  <button onClick={copyCareerSummary}>{summaryCopied ? "✓ 已複製摘要" : "複製職涯摘要"}</button>
                  <button onClick={() => handleNavigation("我的經驗")}>查看相關經驗 <span>→</span></button>
                </div>
              </div>
              <div className="career-visual" aria-hidden="true">
                <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                <div className="orbit-dot dot-one" /><div className="orbit-dot dot-two" />
                <div className="center-gem">{experiences.length}<span>段經驗</span></div>
              </div>
            </article>

            <article className="progress-card">
              <div className="card-heading">
                <div><span className="soft-label">職涯檔案</span><h3>資料完整度</h3></div><span className="trend">↑ 12%</span>
              </div>
              <div className="progress-body">
                <div className="progress-ring"><span>72<small>%</small></span></div>
                <ul><li><span className="done">✓</span>基本資料</li><li><span className="done">✓</span>3 段核心經驗</li><li><span>3</span>項成果待補數據</li></ul>
              </div>
            </article>
          </section>

          <section className="metrics-grid">
            <article className="metric-card"><div className="metric-icon green">◇</div><div><strong>{experiences.length}</strong><span>段經驗</span></div><small>{hasNewExperience ? "剛剛新增 1 段" : "本月新增 2 段"}</small></article>
            <article className="metric-card"><div className="metric-icon purple">✦</div><div><strong>{hasNewExperience ? 21 : 18}</strong><span>項技能</span></div><small>{hasNewExperience ? "新增 3 項技能" : "6 項證據充分"}</small></article>
            <article className="metric-card wide-metric">
              <div><div className="metric-title"><span>職涯資產累積</span><strong>持續成長</strong></div><small>最近 6 個月新增 5 段可用經歷</small></div><Sparkline />
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="panel experiences-panel">
              <div className="panel-header"><div><span className="soft-label">RECENT</span><h3>最近經驗</h3></div><button onClick={() => handleNavigation("我的經驗")}>查看全部 <span>→</span></button></div>
              <div className="experience-list">
                {experiences.slice(0, 3).map((experience) => (
                  <button className="experience-item" key={experience.title} onClick={() => handleNavigation("我的經驗")}>
                    <span className="timeline-pin" style={{ background: experience.color }} />
                    <span className="experience-date">{experience.date}</span>
                    <span className="experience-content">
                      <span className="experience-meta"><em>{experience.type}</em>{experience.org}</span>
                      <strong>{experience.title}</strong><span className="experience-description">{experience.description}</span>
                      <span className="tag-row">{experience.tags.map((tag) => <i key={tag}>{tag}</i>)}</span>
                    </span><span className="item-arrow">›</span>
                  </button>
                ))}
              </div>
            </article>

            <div className="right-column">
              <article className="panel skills-panel">
                <div className="analysis-panel-header"><div><span className="page-kicker">SKILL EVIDENCE</span><h3>技能與證據</h3></div><button onClick={() => setShowExperienceFlow(true)}>補充證據　＋</button></div>
                <div className="analysis-tabs">{Object.keys(skillGroups).map((group) => <button className={skillGroup === group ? "active" : ""} key={group} onClick={() => setSkillGroup(group as keyof typeof skillGroups)}>{group}</button>)}</div>
                <div className="evidence-skill-list home-evidence-skill-list">
                  {skillGroups[skillGroup].map(([name, score, sources, status], index) => <button key={String(name)} onClick={() => previewFeature(String(name))}>
                    <span className="skill-number">{String(index + 1).padStart(2, "0")}</span><span className="skill-name"><strong>{name}</strong><small>{sources}</small></span><span className="analysis-skill-bar"><i style={{ width: String(score) + "%" }} /></span><span className={"evidence-status status-" + (index > 3 ? "weak" : index > 1 ? "growing" : "strong")}>{status}</span><span>›</span>
                  </button>)}
                </div>
              </article>

              <article className="next-step-card">
                <span className="next-icon">✦</span>
                <div><span className="soft-label">本週行動</span><h3>準備 Orbit 產品面試</h3><p>先用核心經驗完成一題自我介紹練習。</p></div>
                <button onClick={() => handleNavigation("職缺探索")}>瀏覽職缺</button>
              </article>
            </div>
          </section>

          <section className="home-career-analysis" id="home-career-analysis">
            <div className="home-analysis-heading"><div><span className="page-kicker">CAREER OVERVIEW</span><h2>從經驗看見你的職涯全貌</h2><p>技能證據、經驗組成、成長軌跡與下一步觀察，現在都集中在首頁。</p></div><span>{experiences.length} 段經驗 · {evidenceCount} 項附件證據</span></div>
            <div className="home-analysis-grid">
              <article className="analysis-panel distribution-panel">
                <div className="analysis-panel-header"><div><span className="page-kicker">EXPERIENCE MIX</span><h3>經驗分布</h3></div></div>
                <div className="distribution-chart"><div className="donut"><span><strong>{experiences.length}</strong>段經驗</span></div><ul><li><i className="c-one" /><span>專案</span><b>38%</b></li><li><i className="c-two" /><span>實習／工作</span><b>25%</b></li><li><i className="c-three" /><span>競賽</span><b>13%</b></li><li><i className="c-four" /><span>修課／研究／其他</span><b>24%</b></li></ul></div>
                <p className="distribution-note"><span>✦</span>你的經驗以實作專案為主，已具備明確方向；下一步可增加真實商業情境中的成果證據。</p>
              </article>

              <article className="analysis-panel growth-panel">
                <div className="analysis-panel-header"><div><span className="page-kicker">GROWTH TIMELINE</span><h3>能力發展軌跡</h3></div><span className="growth-legend"><i />責任與影響範圍</span></div>
                <div className="growth-track"><div className="growth-line"><span style={{ height: "28%" }} /><span style={{ height: "43%" }} /><span style={{ height: "66%" }} /><span style={{ height: "88%" }} /></div>{[
                  ["2023", "開始探索", "課程中首次進行訪談與資料整理", "參與者"], ["2024", "方法建立", "獨立規劃研究並完成互動原型", "執行者"], ["2025", "跨域整合", "將研究洞察轉為產品與提案方向", "規劃者"], ["2026", "擴大影響", "主導完整流程並協調團隊推進", "負責人"],
                ].map(([year, stage, text, role], index) => <div className={"growth-node node-" + (index + 1)} key={year}><span>{year}</span><i /><div><small>{role}</small><strong>{stage}</strong><p>{text}</p></div></div>)}</div>
              </article>
            </div>

            <section className="insight-section">
              <div className="insight-title"><div><span className="page-kicker">GOODJOB OBSERVATIONS</span><h2>從你的經驗中，我們看見了這些</h2></div><span>所有觀察都能查看來源，不使用人格推測</span></div>
              <div className="insight-layout"><div className="insight-list">{careerInsights.map((item, index) => <button className={insight === index ? "active" : ""} key={item.label} onClick={() => setInsight(index)}><span>{item.icon}</span><div><small>{item.label}</small><strong>{item.title}</strong></div><b>›</b></button>)}</div><article className="insight-detail"><span className="insight-detail-icon">{careerInsights[insight].icon}</span><small>{careerInsights[insight].label}</small><h3>{careerInsights[insight].title}</h3><p>{careerInsights[insight].text}</p><div><span>⌁</span><small>判斷依據</small><strong>{careerInsights[insight].source}</strong></div><button onClick={() => handleNavigation("我的經驗")}>查看相關經驗　→</button></article></div>
            </section>
          </section>
          </>}
          {activeView === "我的經驗" && <ExperienceLibrary experiences={experiences} onAdd={() => setShowExperienceFlow(true)} />}
          {activeView === "我的履歷" && <ResumeBuilder experiences={experiences} initialTarget={resumeTarget} />}
          {activeView === "職缺探索" && <JobAnalysis onCreateResume={(target) => { setResumeTarget(target); handleNavigation("我的履歷"); }} />}
        </div>
      </section>

      {notice && <div className="toast" role="status"><span>✦</span>{notice}</div>}
      {showExperienceFlow && <ExperienceFlow onClose={() => setShowExperienceFlow(false)} onComplete={completeExperience} />}
      {showGuide && <ProductGuide onClose={() => setShowGuide(false)} onNavigate={handleNavigation} />}
      {showProfileEditor && <ProfileEditModal profile={profile} onClose={() => setShowProfileEditor(false)} onSave={(nextProfile) => { setProfile(nextProfile); setShowProfileEditor(false); setNotice("個人資料已更新"); window.setTimeout(() => setNotice(""), 2400); }} />}
      <nav className="mobile-bottom-nav" aria-label="手機主要導覽">{[{label:"首頁",icon:"⌂"},{label:"我的經驗",icon:"◇"},{label:"我的履歷",icon:"▤"},{label:"職缺探索",icon:"◎"}].map((item) => <button className={activeView === item.label ? "active" : ""} key={item.label} onClick={() => handleNavigation(item.label)}><span>{item.icon}</span>{item.label === "我的經驗" ? "經驗" : item.label === "我的履歷" ? "履歷" : item.label === "職缺探索" ? "探索" : item.label}</button>)}</nav>
    </main>
  );
}
