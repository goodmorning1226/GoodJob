"use client";

import { useMemo, useState } from "react";

type Talent = {
  id: number;
  nickname: string;
  headline: string;
  bio: string;
  location: string;
  experience: string;
  education: string;
  availability: string;
  fit: number;
  skills: string[];
  experiences: string[];
  resume: string[];
};

const talents: Talent[] = [
  {
    id: 1,
    nickname: "Yulun",
    headline: "產品探索者｜使用者研究 × 產品企劃",
    bio: "擅長把模糊問題拆成可研究與驗證的方向，期待參與數位產品的需求探索與迭代。",
    location: "台北市",
    experience: "1–2 年",
    education: "大學",
    availability: "可立即面談",
    fit: 92,
    skills: ["使用者研究", "產品企劃", "Figma", "資料分析"],
    experiences: [
      "木星數位科技・產品實習生",
      "校園活動探索 App",
      "全國創新提案競賽第二名",
    ],
    resume: [
      "規劃 12 場使用者訪談，整理為 3 項產品優化提案",
      "完成從問題定義、原型到測試的產品設計流程",
      "分析 186 份問卷與訪談資料",
    ],
  },
  {
    id: 2,
    nickname: "Mina",
    headline: "UX Researcher｜質化研究與洞察溝通",
    bio: "關注生活服務與數位健康，熟悉深度訪談、可用性測試和研究報告。",
    location: "新北市",
    experience: "2–3 年",
    education: "碩士",
    availability: "兩週後可面談",
    fit: 87,
    skills: ["使用者研究", "質化研究", "可用性測試", "簡報溝通"],
    experiences: ["健康 App 可用性研究", "金融服務顧客旅程研究"],
    resume: [
      "獨立執行 24 場深度訪談",
      "建立研究知識庫供 3 個產品團隊使用",
      "主持 6 場洞察工作坊",
    ],
  },
  {
    id: 3,
    nickname: "Kai",
    headline: "Product Operations｜流程與跨部門協作",
    bio: "喜歡讓團隊運作更順暢，具備專案追蹤、營運報表及跨部門協作經驗。",
    location: "台北市",
    experience: "1–2 年",
    education: "大學",
    availability: "可立即面談",
    fit: 84,
    skills: ["專案管理", "跨部門協作", "Excel", "產品營運"],
    experiences: ["SaaS 新創・營運實習", "校園專案管理平台"],
    resume: [
      "追蹤 4 條產品線每週交付進度",
      "將營運報表製作時間縮短 35%",
      "協調設計、工程與客服問題排程",
    ],
  },
  {
    id: 4,
    nickname: "Rin",
    headline: "Junior Product Designer｜互動與服務設計",
    bio: "從研究洞察發展清楚易用的產品流程，熟悉 Figma、原型與設計系統。",
    location: "台中市",
    experience: "1 年以下",
    education: "大學",
    availability: "一個月後",
    fit: 80,
    skills: ["Figma", "產品設計", "服務設計", "原型測試"],
    experiences: ["電商結帳流程改版", "校園服務設計專案"],
    resume: [
      "完成 18 個核心頁面與互動原型",
      "可用性測試任務成功率提升 21%",
      "建立基礎元件庫與使用規範",
    ],
  },
  {
    id: 5,
    nickname: "Aster",
    headline: "Data Analyst｜產品數據與行為洞察",
    bio: "以數據回答產品問題，熟悉 SQL、Excel 與視覺化，能把分析轉為團隊行動。",
    location: "台北市",
    experience: "2–3 年",
    education: "碩士",
    availability: "兩週後可面談",
    fit: 77,
    skills: ["資料分析", "SQL", "Excel", "Tableau"],
    experiences: ["內容平台產品分析", "訂閱轉換漏斗專案"],
    resume: [
      "建立 12 項產品核心指標儀表板",
      "找出註冊流失節點並提升轉換 8%",
      "每月支援 5 個跨部門分析需求",
    ],
  },
  {
    id: 6,
    nickname: "Noah",
    headline: "Growth Marketer｜內容策略與成效分析",
    bio: "結合內容創意與數據實驗，具備社群、SEO 和活動企劃經驗。",
    location: "高雄市",
    experience: "1–2 年",
    education: "大學",
    availability: "可立即面談",
    fit: 72,
    skills: ["內容策略", "數位行銷", "GA4", "活動企劃"],
    experiences: ["品牌社群成長專案", "青年永續活動企劃"],
    resume: [
      "三個月內提升自然觸及 46%",
      "規劃內容實驗並提升互動率 19%",
      "執行 300 人品牌活動",
    ],
  },
  {
    id: 7,
    nickname: "Ivy",
    headline: "Project Coordinator｜溝通與執行推進",
    bio: "擅長拆解任務與協調資源，期待投入產品或顧問專案。",
    location: "新竹市",
    experience: "1 年以下",
    education: "大學",
    availability: "一個月後",
    fit: 69,
    skills: ["專案管理", "簡報溝通", "活動企劃", "Notion"],
    experiences: ["數位轉型課程專案", "系學會大型活動"],
    resume: [
      "協調 15 人團隊完成兩日活動",
      "建立專案看板與每週風險追蹤",
      "完成客戶研究與提案簡報",
    ],
  },
  {
    id: 8,
    nickname: "Leo",
    headline: "Customer Success｜需求理解與客戶溝通",
    bio: "能快速理解使用問題並轉成產品回饋，具備服務流程與客戶教育經驗。",
    location: "台北市",
    experience: "2–3 年",
    education: "大學",
    availability: "兩週後可面談",
    fit: 66,
    skills: ["客戶成功", "需求訪談", "簡報溝通", "SaaS"],
    experiences: ["雲端服務客戶成功專員", "新客戶導入流程改善"],
    resume: [
      "協助 42 家企業客戶完成導入",
      "降低重複客服問題 28%",
      "彙整回饋推動 5 項產品改善",
    ],
  },
];

type PublicResume = {
  id: string;
  title: string;
  updatedAt: string;
  target: string;
  introduction: string;
  bullets: string[];
};

type PublicExperience = {
  id: string;
  title: string;
  period: string;
  role: string;
  background: string;
  actions: string[];
  outcome: string;
  skills: string[];
};

const fixedCompanyJobs = [
  {
    title: "Associate Product Manager",
    requirements: ["使用者研究", "產品需求分析", "跨部門協作", "數據分析能力"],
  },
  {
    title: "UX Researcher",
    requirements: ["使用者研究", "質化研究", "洞察溝通", "跨部門協作"],
  },
  {
    title: "Product Operations Specialist",
    requirements: ["專案管理", "資料分析", "跨部門協作", "流程優化"],
  },
];

function getPublicResumes(talent: Talent): PublicResume[] {
  return [
    {
      id: `${talent.id}-targeted`,
      title: `${talent.headline.split("｜")[0]}｜目標職缺版`,
      updatedAt: "2026 年 8 月更新",
      target: "產品、研究與營運相關職位",
      introduction: talent.bio,
      bullets: talent.resume,
    },
    {
      id: `${talent.id}-general`,
      title: "通用履歷｜完整經歷版",
      updatedAt: "2026 年 7 月更新",
      target: "開放跨領域機會",
      introduction: `具備 ${talent.skills.slice(0, 3).join("、")} 等能力，能將學習與專案經驗轉化為具體成果。`,
      bullets: [...talent.resume].reverse(),
    },
  ];
}

function getPublicExperiences(talent: Talent): PublicExperience[] {
  return talent.experiences.map((title, index) => ({
    id: `${talent.id}-experience-${index}`,
    title,
    period: index === 0 ? "2025.07–2026.01" : "2025.02–2025.06",
    role: index === 0 ? talent.headline.split("｜")[0] : "專案核心成員",
    background: `在${title}中負責釐清問題、協調合作方式，並將任務整理成可以驗證與交付的工作項目。`,
    actions: [
      `運用${talent.skills[index % talent.skills.length]}完成核心任務與資料整理`,
      `與團隊共同定義目標、追蹤進度並彙整重要發現`,
    ],
    outcome: talent.resume[index % talent.resume.length],
    skills: talent.skills.slice(index % 2, (index % 2) + 3),
  }));
}

function requirementResult(talent: Talent, requirement: string, index: number) {
  const aliases: Record<string, string[]> = {
    產品需求分析: ["產品企劃", "使用者研究", "資料分析"],
    洞察溝通: ["簡報溝通", "質化研究", "使用者研究"],
    流程優化: ["產品營運", "專案管理", "Excel"],
    跨部門協作: ["跨部門協作", "專案管理", "簡報溝通"],
    數據分析能力: ["資料分析", "SQL", "Excel", "GA4"],
  };
  const candidates = [requirement, ...(aliases[requirement] || [])];
  const matchedSkill = candidates.find((item) => talent.skills.includes(item));
  if (matchedSkill)
    return {
      status: "符合",
      level: "matched",
      evidence: `公開技能「${matchedSkill}」及相關經歷可作為直接證據`,
    };
  if ((talent.id + index) % 3 !== 0)
    return {
      status: "部分符合",
      level: "partial",
      evidence: `具相近的${talent.skills[index % talent.skills.length]}經驗，建議面談確認深度`,
    };
  return {
    status: "尚無證據",
    level: "missing",
    evidence: "公開資料中尚未找到可直接支持此要求的證據",
  };
}

export default function EnterprisePortal({
  onSwitchRole,
}: {
  onSwitchRole: () => void;
}) {
  const [view, setView] = useState<"talent" | "jobs" | "publish">("talent");
  const [title, setTitle] = useState("Associate Product Manager");
  const [description, setDescription] = useState(
    "協助產品團隊進行需求研究、數據分析與功能規劃，並與設計及工程團隊合作推動產品迭代。",
  );
  const [requirements, setRequirements] = useState(
    "使用者研究\n產品需求分析\n跨部門協作\n數據分析能力",
  );
  const [activeJob, setActiveJob] = useState("Associate Product Manager");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("全部地點");
  const [experience, setExperience] = useState("全部年資");
  const [skill, setSkill] = useState("全部技能");
  const [aiSkills, setAiSkills] = useState<string[]>([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    "告訴我你想找什麼樣的人，我會把描述拆成篩選條件並重新排序人才。",
  ]);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [selectedResume, setSelectedResume] = useState<PublicResume | null>(
    null,
  );
  const [resumeZoom, setResumeZoom] = useState(85);
  const [selectedExperience, setSelectedExperience] =
    useState<PublicExperience | null>(null);
  const [selectedMatchJob, setSelectedMatchJob] = useState<string | null>(null);
  const [selectedManagedJob, setSelectedManagedJob] = useState<string | null>(
    null,
  );
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [closedJobs, setClosedJobs] = useState<string[]>([]);
  const [invited, setInvited] = useState<number[]>([]);

  const companyJobs = useMemo(
    () => [
      {
        title: activeJob,
        requirements: requirements.split("\n").filter(Boolean),
      },
      ...fixedCompanyJobs.filter((job) => job.title !== activeJob),
    ],
    [activeJob, requirements],
  );
  const selectedJobMatch = companyJobs.find(
    (job) => job.title === selectedMatchJob,
  );
  const managedJobs = companyJobs.map((job, index) => ({
    ...job,
    description:
      index === 0
        ? description
        : job.title === "Associate Product Manager"
          ? "協助產品團隊進行需求研究、數據分析與功能規劃，並與設計及工程團隊合作推動產品迭代。"
          : job.title === "UX Researcher"
            ? "負責規劃與執行使用者研究，將洞察轉化為團隊可採取的產品方向。"
            : "協助產品營運流程、跨部門協作與指標追蹤，持續改善團隊效率。",
    interested: [34, 21, 16][index] || 12,
    views: [286, 174, 131][index] || 98,
    postedAt: ["3 天前", "8 月 24 日", "8 月 18 日"][index] || "8 月 12 日",
    status: closedJobs.includes(job.title) ? "已結束" : "招募中",
  }));
  const selectedCompanyJob = managedJobs.find(
    (job) => job.title === selectedManagedJob,
  );

  const visibleTalents = useMemo(
    () =>
      talents
        .filter((talent) => {
          const text = (
            talent.nickname +
            talent.headline +
            talent.bio +
            talent.skills.join(" ")
          ).toLowerCase();
          return (
            text.includes(query.trim().toLowerCase()) &&
            (location === "全部地點" || talent.location === location) &&
            (experience === "全部年資" || talent.experience === experience) &&
            (skill === "全部技能" || talent.skills.includes(skill)) &&
            aiSkills.every((item) => talent.skills.includes(item))
          );
        })
        .sort((a, b) => b.fit - a.fit),
    [aiSkills, experience, location, query, skill],
  );

  function publishJob() {
    if (!title.trim() || !description.trim()) return;
    if (!requirements.trim())
      setRequirements(
        description.includes("研究")
          ? "使用者研究\n需求分析\n跨部門協作\n產品規劃"
          : "溝通協作\n問題分析\n專案執行",
      );
    setActiveJob(title.trim());
    setNotice(
      editingJob ? "職缺內容已更新" : "職缺已發布，人才排序已依新職缺更新",
    );
    setEditingJob(null);
    setView("jobs");
    window.setTimeout(() => setNotice(""), 2600);
  }

  function startNewJob() {
    setEditingJob(null);
    setTitle("");
    setDescription("");
    setRequirements("");
    setView("publish");
  }

  function editCompanyJob(job: (typeof managedJobs)[number]) {
    setEditingJob(job.title);
    setTitle(job.title);
    setDescription(job.description);
    setRequirements(job.requirements.join("\n"));
    setSelectedManagedJob(null);
    setView("publish");
  }

  function askAi() {
    const prompt = aiInput.trim();
    if (!prompt) return;
    const found = [
      ["研究", "使用者研究"],
      ["產品", "產品企劃"],
      ["數據", "資料分析"],
      ["figma", "Figma"],
      ["專案", "專案管理"],
    ]
      .filter(([key]) => prompt.toLowerCase().includes(key))
      .map(([, value]) => value);
    setAiSkills(found);
    setAiMessages((current) => [
      ...current,
      `你：${prompt}`,
      found.length
        ? `GoodJob：已轉成 ${found.join("、")} 等條件，人才清單已更新。`
        : "GoodJob：我先保留現有條件並依語意重新檢視；你也可以加入技能或年資關鍵字。",
    ]);
    setAiInput("");
  }

  return (
    <main className="enterprise-shell">
      <aside className="enterprise-sidebar">
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GoodJob</span>
          <em>企業版</em>
        </div>
        <div className="enterprise-company">
          <span>O</span>
          <div>
            <strong>Orbit 數位產品</strong>
            <small>招募團隊</small>
          </div>
        </div>
        <nav>
          <button
            className={view === "talent" ? "active" : ""}
            onClick={() => setView("talent")}
          >
            <span>◎</span>人才瀏覽
          </button>
          <button
            className={view === "jobs" || view === "publish" ? "active" : ""}
            onClick={() => setView("jobs")}
          >
            <span>▦</span>我的職缺
          </button>
        </nav>
        <div className="enterprise-sidebar-bottom">
          <div>
            <small>目前配對職缺</small>
            <strong>{activeJob}</strong>
            <span>公開中</span>
          </div>
          <button onClick={onSwitchRole}>⇄ 切換展示身分</button>
        </div>
      </aside>
      <section className="enterprise-main">
        <header className="enterprise-topbar">
          <div>
            <span className="page-kicker">GOODJOB FOR BUSINESS</span>
            <strong>人才配對工作台</strong>
          </div>
          <div>
            <button>？ 企業版導覽</button>
            <span className="enterprise-avatar">O</span>
          </div>
        </header>
        <div className="enterprise-content">
          {view === "publish" ? (
            <section className="job-publish-page page-enter">
              <header className="page-title-row">
                <div>
                  <span className="page-kicker">PUBLISH A ROLE</span>
                  <h1>{editingJob ? "編輯職缺" : "發布職缺"}</h1>
                  <p>
                    提供職缺核心資訊；要求可以留空，Prototype
                    會依標題與敘述自動整理。
                  </p>
                </div>
                <button
                  className="add-button secondary"
                  onClick={() => setView("jobs")}
                >
                  ← 返回我的職缺
                </button>
              </header>
              <div className="job-publish-layout">
                <main>
                  <label>
                    <span>
                      職缺名稱 <b>必填</b>
                    </span>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="例如：Associate Product Manager"
                    />
                  </label>
                  <label>
                    <span>
                      職缺敘述 <b>必填</b>
                    </span>
                    <textarea
                      rows={9}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="描述這個角色的任務、團隊與期待…"
                    />
                  </label>
                  <label>
                    <span>
                      要求點 <small>選填，每行一項</small>
                    </span>
                    <textarea
                      rows={7}
                      value={requirements}
                      onChange={(event) => setRequirements(event.target.value)}
                      placeholder="留空時，會依現有資訊自動摘要"
                    />
                  </label>
                  <button
                    className="primary-flow-button"
                    disabled={!title.trim() || !description.trim()}
                    onClick={publishJob}
                  >
                    {editingJob ? "儲存職缺變更　→" : "發布職缺並開始配對　→"}
                  </button>
                </main>
                <aside>
                  <span>✦</span>
                  <h2>條件摘要預覽</h2>
                  <p>
                    企業提供的內容會被整理成可逐項比對的條件，用來計算人才匹配度。
                  </p>
                  <div>
                    {(requirements.trim()
                      ? requirements.split("\n")
                      : ["將由 AI 根據職缺內容整理"]
                    )
                      .filter(Boolean)
                      .map((item) => (
                        <span key={item}>✓ {item}</span>
                      ))}
                  </div>
                  <small>Prototype 僅在本機模擬摘要，不會呼叫 API。</small>
                </aside>
              </div>
            </section>
          ) : view === "jobs" ? (
            <section className="enterprise-jobs-page page-enter">
              <header className="page-title-row">
                <div>
                  <span className="page-kicker">YOUR OPEN ROLES</span>
                  <h1>我的職缺</h1>
                  <p>管理 Orbit 數位產品發布的職缺、人才興趣與招募狀態。</p>
                </div>
                <button className="add-button" onClick={startNewJob}>
                  ＋ 發布新職缺
                </button>
              </header>
              <div className="company-job-summary">
                <article>
                  <span>招募中</span>
                  <strong>
                    {
                      managedJobs.filter((job) => job.status === "招募中")
                        .length
                    }
                  </strong>
                  <small>個公開職缺</small>
                </article>
                <article>
                  <span>人才興趣</span>
                  <strong>
                    {managedJobs.reduce((sum, job) => sum + job.interested, 0)}
                  </strong>
                  <small>位人才表示有興趣</small>
                </article>
                <article>
                  <span>累積瀏覽</span>
                  <strong>
                    {managedJobs.reduce((sum, job) => sum + job.views, 0)}
                  </strong>
                  <small>次職缺瀏覽</small>
                </article>
              </div>
              <div className="company-job-grid">
                {managedJobs.map((job, index) => (
                  <button
                    className={job.status === "已結束" ? "closed" : ""}
                    key={job.title}
                    onClick={() => setSelectedManagedJob(job.title)}
                  >
                    <header>
                      <span className="company-job-logo">O</span>
                      <div>
                        <small>Orbit 數位產品</small>
                        <strong>{job.title}</strong>
                      </div>
                      <em>{job.status}</em>
                    </header>
                    <p>{job.description}</p>
                    <div className="company-job-tags">
                      {job.requirements.slice(0, 3).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <footer>
                      <span>
                        <b>{job.interested}</b> 人有興趣
                      </span>
                      <span>
                        <b>{job.views}</b> 次瀏覽
                      </span>
                      <small>{job.postedAt}發布</small>
                      <em>查看管理　→</em>
                    </footer>
                    {index === 0 && job.status === "招募中" && (
                      <i>目前用於人才配對</i>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="enterprise-talent-page page-enter">
              <header className="page-title-row">
                <div>
                  <span className="page-kicker">TALENT DISCOVERY</span>
                  <h1>人才瀏覽</h1>
                  <p>依「{activeJob}」的條件排序，最符合的人才優先顯示。</p>
                </div>
                <button className="add-button" onClick={() => setView("jobs")}>
                  ▦ 查看我的職缺
                </button>
              </header>
              <div className="talent-toolbar">
                <label>
                  <span>⌕</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜尋暱稱、技能或自介"
                  />
                </label>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                >
                  <option>全部地點</option>
                  {[...new Set(talents.map((item) => item.location))].map(
                    (item) => (
                      <option key={item}>{item}</option>
                    ),
                  )}
                </select>
                <select
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                >
                  <option>全部年資</option>
                  {[...new Set(talents.map((item) => item.experience))].map(
                    (item) => (
                      <option key={item}>{item}</option>
                    ),
                  )}
                </select>
                <select
                  value={skill}
                  onChange={(event) => setSkill(event.target.value)}
                >
                  <option>全部技能</option>
                  {[...new Set(talents.flatMap((item) => item.skills))]
                    .sort()
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </select>
                <button
                  className={aiOpen ? "active" : ""}
                  onClick={() => setAiOpen(!aiOpen)}
                >
                  ✦ AI 找人才
                </button>
              </div>
              {aiSkills.length > 0 && (
                <div className="ai-filter-chips">
                  <span>AI 條件</span>
                  {aiSkills.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setAiSkills((current) =>
                          current.filter((skill) => skill !== item),
                        )
                      }
                    >
                      {item}　×
                    </button>
                  ))}
                  <button onClick={() => setAiSkills([])}>清除</button>
                </div>
              )}
              <div className="talent-results-heading">
                <div>
                  <strong>{visibleTalents.length} 位公開人才</strong>
                  <span>依匹配度由高到低排列</span>
                </div>
                <small>只顯示使用者主動公開的資料</small>
              </div>
              <div className="talent-grid">
                {visibleTalents.map((talent, index) => (
                  <article
                    className="talent-card"
                    key={talent.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`查看 ${talent.nickname} 的公開資料`}
                    onClick={() => setSelectedTalent(talent)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedTalent(talent);
                      }
                    }}
                  >
                    <header>
                      <span className="talent-avatar">
                        {talent.nickname.slice(0, 1)}
                      </span>
                      <div>
                        <small>{index < 3 ? "✦ 優先推薦" : "公開人才"}</small>
                        <h2>{talent.nickname}</h2>
                        <p>{talent.headline}</p>
                      </div>
                      <span className="talent-card-link">查看詳細　→</span>
                    </header>
                    <small className="talent-summary-label">
                      {talent.id % 3 === 0 ? "本人撰寫摘要" : "✦ AI 統整摘要"}
                    </small>
                    <p className="talent-card-summary">
                      {talent.bio.length > 76
                        ? `${talent.bio.slice(0, 76)}…`
                        : talent.bio}
                    </p>
                    <div>
                      {talent.skills.slice(0, 4).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <footer>
                      <span>
                        {talent.skills.length} 項公開技能 · 點擊查看完整 Profile
                      </span>
                      <strong>
                        {talent.fit}
                        <small>%</small>
                        <em>匹配度</em>
                      </strong>
                    </footer>
                  </article>
                ))}
              </div>
              {visibleTalents.length === 0 && (
                <div className="talent-empty">
                  <span>⌕</span>
                  <h2>目前沒有符合全部條件的人才</h2>
                  <button
                    onClick={() => {
                      setQuery("");
                      setLocation("全部地點");
                      setExperience("全部年資");
                      setSkill("全部技能");
                      setAiSkills([]);
                    }}
                  >
                    清除篩選
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </section>
      {aiOpen && (
        <aside className="talent-ai-drawer">
          <header>
            <div>
              <span>✦</span>
              <div>
                <strong>AI 人才搜尋</strong>
                <small>用自然語言描述理想人選</small>
              </div>
            </div>
            <button onClick={() => setAiOpen(false)}>×</button>
          </header>
          <div className="talent-ai-messages">
            {aiMessages.map((message, index) => (
              <p
                className={message.startsWith("你：") ? "user" : ""}
                key={index}
              >
                {message}
              </p>
            ))}
          </div>
          <div className="talent-ai-examples">
            <span>試著問</span>
            {[
              "找有使用者研究和產品經驗的人",
              "想找會數據分析的人",
              "找熟悉 Figma 的新鮮人",
            ].map((item) => (
              <button key={item} onClick={() => setAiInput(item)}>
                {item}
              </button>
            ))}
          </div>
          <footer>
            <textarea
              rows={3}
              value={aiInput}
              onChange={(event) => setAiInput(event.target.value)}
              placeholder="我想找…"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  askAi();
                }
              }}
            />
            <button onClick={askAi}>送出　↑</button>
          </footer>
          <small>本機規則模擬，不會傳送資料</small>
        </aside>
      )}
      {selectedTalent && (
        <div
          className="talent-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="人才公開資料"
        >
          <article className="talent-profile-modal">
            <header>
              <button onClick={() => setSelectedTalent(null)}>×</button>
              <span className="talent-avatar large">
                {selectedTalent.nickname.slice(0, 1)}
              </span>
              <div>
                <small>公開人才 Profile</small>
                <h2>{selectedTalent.nickname}</h2>
                <p>{selectedTalent.headline}</p>
              </div>
              <b>{selectedTalent.fit}% 匹配</b>
            </header>
            <div className="talent-profile-body">
              <main>
                <section>
                  <h3>自我介紹</h3>
                  <p>{selectedTalent.bio}</p>
                </section>
                <section>
                  <h3>公開經歷</h3>
                  <div className="public-record-grid experience-record-list">
                    {getPublicExperiences(selectedTalent).map((item) => (
                      <button
                        className="public-record-card experience-record-row"
                        key={item.id}
                        onClick={() => setSelectedExperience(item)}
                      >
                        <span className="experience-row-mark">◇</span>
                        <span className="experience-row-content">
                          <small>
                            {item.period} · {item.role}
                          </small>
                          <strong>{item.title}</strong>
                          <p>{item.outcome}</p>
                        </span>
                        <em>查看詳細　→</em>
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h3>公開履歷</h3>
                  <div className="public-record-grid resume-record-grid">
                    {getPublicResumes(selectedTalent).map((resume) => (
                      <button
                        className="resume-cover-card"
                        key={resume.id}
                        onClick={() => {
                          setResumeZoom(85);
                          setSelectedResume(resume);
                        }}
                      >
                        <span className="resume-cover-sheet">
                          <span className="resume-cover-name">
                            {selectedTalent.nickname}
                          </span>
                          <span className="resume-cover-role">
                            {selectedTalent.headline}
                          </span>
                          <i />
                          <b>PROFILE</b>
                          <span className="resume-cover-lines">
                            <i />
                            <i />
                          </span>
                          <b>EXPERIENCE</b>
                          <span className="resume-cover-lines">
                            <i />
                            <i />
                            <i />
                          </span>
                        </span>
                        <span className="resume-cover-meta">
                          <strong>{resume.title}</strong>
                          <small>
                            {resume.updatedAt} · {resume.target}
                          </small>
                          <em>開啟履歷　→</em>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </main>
              <aside>
                <section className="job-match-panel">
                  <div className="job-match-heading">
                    <div>
                      <h3>職缺能力匹配</h3>
                      <small>點擊職缺查看完整分析</small>
                    </div>
                    <b>{companyJobs.length} 個職缺</b>
                  </div>
                  <div className="job-match-list">
                    {companyJobs.map((job, jobIndex) => {
                      const matchedCount = job.requirements.filter(
                        (item, index) =>
                          requirementResult(selectedTalent, item, index)
                            .level === "matched",
                      ).length;
                      const score =
                        jobIndex === 0
                          ? selectedTalent.fit
                          : Math.max(58, selectedTalent.fit - 6 - jobIndex * 5);
                      return (
                        <article key={job.title}>
                          <button
                            onClick={() => setSelectedMatchJob(job.title)}
                          >
                            <span>
                              <strong>{job.title}</strong>
                              <small>
                                {matchedCount}/{job.requirements.length}{" "}
                                項有直接證據
                              </small>
                            </span>
                            <b>{score}%</b>
                            <em>→</em>
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
                <section>
                  <h3>基本條件</h3>
                  <p>
                    <span>地點</span>
                    <strong>{selectedTalent.location}</strong>
                  </p>
                  <p>
                    <span>年資</span>
                    <strong>{selectedTalent.experience}</strong>
                  </p>
                  <p>
                    <span>學歷</span>
                    <strong>{selectedTalent.education}</strong>
                  </p>
                  <p>
                    <span>狀態</span>
                    <strong>{selectedTalent.availability}</strong>
                  </p>
                </section>
                <section>
                  <h3>公開技能</h3>
                  <div>
                    {selectedTalent.skills.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </section>
                <small>
                  姓名、Email 與電話未公開；對方接受邀約後才能交換聯絡方式。
                </small>
              </aside>
            </div>
            <footer>
              <button onClick={() => setSelectedTalent(null)}>關閉</button>
              <button
                className="primary-flow-button"
                disabled={invited.includes(selectedTalent.id)}
                onClick={() => {
                  setInvited((current) => [...current, selectedTalent.id]);
                  setNotice(`已向 ${selectedTalent.nickname} 發出職缺邀約`);
                  window.setTimeout(() => setNotice(""), 2500);
                }}
              >
                {invited.includes(selectedTalent.id)
                  ? "✓ 已發出邀約"
                  : "發出職缺邀約　→"}
              </button>
            </footer>
          </article>
        </div>
      )}
      {selectedCompanyJob && (
        <div
          className="profile-item-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCompanyJob.title} 職缺管理`}
        >
          <article className="profile-item-modal company-job-dialog">
            <header>
              <button onClick={() => setSelectedManagedJob(null)}>
                × 關閉
              </button>
              <span>職缺管理</span>
              <small>{selectedCompanyJob.status}</small>
            </header>
            <main>
              <section className="company-job-dialog-heading">
                <span className="company-job-logo">O</span>
                <div>
                  <small>
                    Orbit 數位產品 · {selectedCompanyJob.postedAt}發布
                  </small>
                  <h2>{selectedCompanyJob.title}</h2>
                  <p>{selectedCompanyJob.status}</p>
                </div>
              </section>
              <section className="company-job-interest-card">
                <div>
                  <span>有興趣人才</span>
                  <strong>
                    {selectedCompanyJob.interested}
                    <small> 人</small>
                  </strong>
                  <p>人才收藏職缺或表示希望進一步了解。</p>
                </div>
                <div>
                  <span>職缺瀏覽</span>
                  <strong>
                    {selectedCompanyJob.views}
                    <small> 次</small>
                  </strong>
                  <p>自發布後累積的公開頁面瀏覽次數。</p>
                </div>
              </section>
              <section>
                <h3>職缺敘述</h3>
                <p>{selectedCompanyJob.description}</p>
              </section>
              <section>
                <h3>職缺要求</h3>
                <div className="company-job-requirement-list">
                  {selectedCompanyJob.requirements.map((item) => (
                    <span key={item}>✓ {item}</span>
                  ))}
                </div>
              </section>
              <footer className="company-job-dialog-actions">
                <button onClick={() => editCompanyJob(selectedCompanyJob)}>
                  編輯職缺
                </button>
                <button
                  className="danger"
                  disabled={selectedCompanyJob.status === "已結束"}
                  onClick={() => {
                    setClosedJobs((current) => [
                      ...current,
                      selectedCompanyJob.title,
                    ]);
                    setSelectedManagedJob(null);
                    setNotice("已結束此職缺的招募");
                    window.setTimeout(() => setNotice(""), 2400);
                  }}
                >
                  {selectedCompanyJob.status === "已結束"
                    ? "招募已結束"
                    : "結束職缺招募"}
                </button>
              </footer>
            </main>
          </article>
        </div>
      )}
      {selectedJobMatch && selectedTalent && (
        <div
          className="profile-item-backdrop job-match-dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedJobMatch.title} 能力匹配`}
        >
          <article className="profile-item-modal job-match-dialog">
            <header>
              <button onClick={() => setSelectedMatchJob(null)}>× 關閉</button>
              <span>職缺能力匹配</span>
              <small>依公開資料分析</small>
            </header>
            <main>
              <section className="job-match-dialog-heading">
                <div>
                  <span className="page-kicker">MATCH BY REQUIREMENT</span>
                  <h2>{selectedJobMatch.title}</h2>
                  <p>{selectedTalent.nickname} 的公開能力證據</p>
                </div>
                <strong>
                  {Math.max(
                    58,
                    selectedTalent.fit -
                      Math.max(
                        0,
                        companyJobs.findIndex(
                          (job) => job.title === selectedJobMatch.title,
                        ),
                      ) *
                        6,
                  )}
                  <small>%</small>
                  <em>整體匹配</em>
                </strong>
              </section>
              <section>
                <div className="match-dialog-legend">
                  <h3>逐項需求比對</h3>
                  <span>
                    <i className="matched" />
                    符合
                  </span>
                  <span>
                    <i className="partial" />
                    部分符合
                  </span>
                  <span>
                    <i className="missing" />
                    尚無證據
                  </span>
                </div>
                <div className="requirement-match-list dialog-requirement-list">
                  {selectedJobMatch.requirements.map((item, index) => {
                    const result = requirementResult(
                      selectedTalent,
                      item,
                      index,
                    );
                    return (
                      <div key={item}>
                        <i className={result.level}>
                          {result.level === "matched"
                            ? "✓"
                            : result.level === "partial"
                              ? "△"
                              : "—"}
                        </i>
                        <span>
                          <strong>{item}</strong>
                          <small>{result.evidence}</small>
                        </span>
                        <em className={result.level}>{result.status}</em>
                      </div>
                    );
                  })}
                </div>
              </section>
              <small className="match-dialog-note">
                僅根據使用者主動公開的履歷、技能與經歷判斷；沒有公開證據不代表不具備該能力。
              </small>
            </main>
          </article>
        </div>
      )}
      {selectedResume && selectedTalent && (
        <div
          className="profile-item-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={selectedResume.title}
        >
          <article className="pdf-viewer-modal">
            <header className="pdf-viewer-toolbar">
              <button onClick={() => setSelectedResume(null)}>← 返回</button>
              <div>
                <strong>{selectedResume.title}.pdf</strong>
                <small>{selectedResume.updatedAt}</small>
              </div>
              <span>1 / 1</span>
              <div className="pdf-zoom-controls">
                <button
                  onClick={() =>
                    setResumeZoom((value) => Math.max(55, value - 10))
                  }
                >
                  −
                </button>
                <b>{resumeZoom}%</b>
                <button
                  onClick={() =>
                    setResumeZoom((value) => Math.min(115, value + 10))
                  }
                >
                  ＋
                </button>
              </div>
              <button
                onClick={() => {
                  setNotice("Prototype 預覽：尚未產生實際 PDF 檔案");
                  window.setTimeout(() => setNotice(""), 2400);
                }}
              >
                ↓ 下載
              </button>
            </header>
            <div className="pdf-preview-stage">
              <article
                className="pdf-resume-page"
                style={{ width: `${resumeZoom}%` }}
              >
                <header>
                  <div>
                    <h1>{selectedTalent.nickname}</h1>
                    <p>{selectedTalent.headline}</p>
                  </div>
                  <span>
                    {selectedTalent.location} · {selectedTalent.availability}
                  </span>
                </header>
                <section>
                  <h2>PROFILE</h2>
                  <p>{selectedResume.introduction}</p>
                </section>
                <section>
                  <h2>CORE SKILLS</h2>
                  <div className="pdf-skill-list">
                    {selectedTalent.skills.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </section>
                <section>
                  <h2>EXPERIENCE</h2>
                  {selectedTalent.experiences.map((item, index) => (
                    <article className="pdf-experience-entry" key={item}>
                      <header>
                        <strong>{item}</strong>
                        <span>{index === 0 ? "2025–2026" : "2025"}</span>
                      </header>
                      <small>
                        {index === 0
                          ? selectedTalent.headline.split("｜")[0]
                          : "專案核心成員"}
                      </small>
                      <ul>
                        <li>
                          {
                            selectedResume.bullets[
                              index % selectedResume.bullets.length
                            ]
                          }
                        </li>
                        <li>
                          整合團隊回饋並將過程轉化為可追溯的成果與能力證據。
                        </li>
                      </ul>
                    </article>
                  ))}
                </section>
                <section>
                  <h2>EDUCATION</h2>
                  <p>
                    <strong>{selectedTalent.education}</strong> ·
                    相關領域學習與專題經驗
                  </p>
                </section>
                <footer>
                  <span>GoodJob 公開履歷</span>
                  <small>聯絡資料將於接受企業邀約後提供</small>
                </footer>
              </article>
            </div>
          </article>
        </div>
      )}
      {selectedExperience && selectedTalent && (
        <div
          className="profile-item-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={selectedExperience.title}
        >
          <article className="profile-item-modal experience-document-modal">
            <header>
              <button onClick={() => setSelectedExperience(null)}>
                ← 返回公開 Profile
              </button>
              <span>公開經歷</span>
              <small>{selectedExperience.period}</small>
            </header>
            <main>
              <span className="page-kicker">EXPERIENCE DETAIL</span>
              <h2>{selectedExperience.title}</h2>
              <p className="experience-document-role">
                {selectedExperience.role} · {selectedExperience.period}
              </p>
              <section>
                <h3>背景</h3>
                <p>{selectedExperience.background}</p>
              </section>
              <section>
                <h3>負責事項與行動</h3>
                <ul>
                  {selectedExperience.actions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="experience-outcome">
                <h3>成果</h3>
                <p>{selectedExperience.outcome}</p>
              </section>
              <section>
                <h3>技能證據</h3>
                <div className="document-skill-list">
                  {selectedExperience.skills.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </section>
            </main>
          </article>
        </div>
      )}
      {notice && (
        <div className="toast enterprise-toast">
          <span>✦</span>
          {notice}
        </div>
      )}
    </main>
  );
}
