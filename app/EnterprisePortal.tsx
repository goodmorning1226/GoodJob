"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProfileEditModal from "./ProfileEditModal";
import ChatWorkspace from "./ChatWorkspace";

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

const candidateGrades = ["大二", "碩二", "大四", "大學畢業", "碩士畢業", "大三", "大一", "大學畢業"];
const candidatePrograms = ["台大資管", "政大心理", "台科大工管", "北科大工設", "台大經濟", "輔大廣告", "政大企管", "成大企管"];
const gradeOrder = ["大一", "大二", "大三", "大四", "大學畢業", "碩一", "碩二", "碩士畢業", "博士"];
const gradeFilterOptions = ["大一以上", "大二以上", "大三以上", "大四以上", "碩一以上", "碩二以上", "博士以上", "大學畢業", "碩士畢業"];
const candidateSubmittedAt = ["今天 09:42", "今天 08:15", "昨天 18:30", "昨天 14:05", "9 月 3 日", "9 月 2 日", "9 月 1 日", "8 月 31 日"];

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

function ApplicantResumePaper({ talent, resume }: { talent: Talent; resume: PublicResume }) {
  return <article className="pdf-resume-page applicant-resume-paper">
    <header><div><h1>{talent.nickname}</h1><p>{talent.headline}</p></div><span>{talent.availability}</span></header>
    <section><h2>PROFILE</h2><p>{resume.introduction}</p></section>
    <section><h2>CORE SKILLS</h2><div className="pdf-skill-list">{talent.skills.map((item) => <span key={item}>{item}</span>)}</div></section>
    <section><h2>EXPERIENCE</h2>{talent.experiences.map((item, index) => <article className="pdf-experience-entry" key={item}><header><strong>{item}</strong><span>{index === 0 ? "2025–2026" : "2025"}</span></header><small>{index === 0 ? talent.headline.split("｜")[0] : "專案核心成員"}</small><ul><li>{resume.bullets[index % resume.bullets.length]}</li><li>整合團隊回饋並將過程轉化為可追溯的成果與能力證據。</li></ul></article>)}</section>
    <section><h2>EDUCATION</h2><p><strong>{talent.education}</strong> · 相關領域學習與專題經驗</p></section>
    <footer><span>GoodJob 公開履歷</span><small>聯絡資料將於接受企業邀約後提供</small></footer>
  </article>;
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

function ResumeAiAnalysis({
  talent,
  resume,
  job,
  fit,
  onClose,
}: {
  talent: Talent;
  resume: PublicResume;
  job: { title: string; requirements: string[]; bonusRequirements: string[] };
  fit: number;
  onClose: () => void;
}) {
  const requirementAnalysis = [
    ...job.requirements.map((requirement) => ({ requirement, required: true })),
    ...job.bonusRequirements.map((requirement) => ({ requirement, required: false })),
  ].map((item, index) => ({ ...item, ...requirementResult(talent, item.requirement, index) }));
  const suitableReasons = requirementAnalysis.filter((item) => item.level !== "missing");
  const concerns = requirementAnalysis.filter((item) => item.level === "missing");
  const verdict = fit >= 85 ? "高度適合" : fit >= 70 ? "適合" : fit >= 55 ? "部分適合" : "目前適合度較低";

  return <div className="resume-ai-backdrop"><button className="resume-ai-backdrop-dismiss" type="button" aria-label="關閉 AI 履歷摘要" onClick={onClose} /><section className="resume-ai-modal" role="dialog" aria-modal="true" aria-labelledby="resume-ai-title"><header><div><span className="page-kicker">AI RESUME SUMMARY</span><h2 id="resume-ai-title">AI 履歷摘要</h2></div><button type="button" aria-label="關閉 AI 履歷摘要" onClick={onClose}>×</button></header><main><section className="resume-ai-overview"><div><span>應徵者</span><strong>{talent.nickname}</strong></div><div><span>應徵職位</span><strong>{job.title}</strong></div><div><span>整體適合度</span><strong>{fit}%</strong></div></section><section className="resume-ai-verdict"><h3>{verdict}</h3><p>綜合履歷中的技能、經驗成果與職缺條件，此候選人的整體適合度為 {fit}%。以下列出支持判斷的證據與仍需確認的落差。</p></section><section><h3>履歷摘要</h3><p>{resume.introduction}</p></section><section className="resume-ai-fit-section"><h3>適合此職缺的原因</h3>{suitableReasons.length ? <ul>{suitableReasons.map((item) => <li key={`${item.required}-${item.requirement}`}><strong>{item.requirement}</strong><span>{item.required ? "必備條件" : "加分條件"}</span><p>{item.evidence}</p></li>)}</ul> : <p>目前履歷中尚未找到能直接對應職缺條件的明確證據。</p>}</section><section className="resume-ai-gap-section"><h3>不適合或需確認的原因</h3>{concerns.length ? <ul>{concerns.map((item) => <li key={`${item.required}-${item.requirement}`}><strong>{item.requirement}</strong><span>{item.required ? "必備條件" : "加分條件"}</span><p>{item.required ? "履歷中尚未看到足以證明此項必備能力的具體經驗，可能影響上手速度。" : "履歷中未呈現此項加分能力，可在面談時確認是否具備相關經驗。"}</p></li>)}</ul> : <p>履歷已涵蓋目前列出的條件；仍建議於面談確認候選人的實際負責範圍與能力深度。</p>}</section><section className="resume-ai-note"><h3>面談建議</h3><p>優先針對尚無明確證據的條件提問，並請候選人說明具體情境、個人貢獻、決策方式與可量化成果。</p></section></main></section></div>;
}

export default function EnterprisePortal({
  onSwitchRole,
}: {
  onSwitchRole: () => void;
}) {
  const [view, setView] = useState<"jobs" | "resumes" | "messages" | "talent">("jobs");
  const [chatTalentName, setChatTalentName] = useState("Yulun");
  const [title, setTitle] = useState("Associate Product Manager");
  const [description, setDescription] = useState(
    "協助產品團隊進行需求研究、數據分析與功能規劃，並與設計及工程團隊合作推動產品迭代。",
  );
  const [requirements, setRequirements] = useState(
    "使用者研究\n產品需求分析\n跨部門協作\n數據分析能力",
  );
  const [bonusRequirements, setBonusRequirements] = useState("Figma\nSQL");
  const [activeJob, setActiveJob] = useState("Associate Product Manager");
  const [publishedJobDescription, setPublishedJobDescription] = useState(
    "協助產品團隊進行需求研究、數據分析與功能規劃，並與設計及工程團隊合作推動產品迭代。",
  );
  const [publishedJobRequirements, setPublishedJobRequirements] = useState(
    "使用者研究\n產品需求分析\n跨部門協作\n數據分析能力",
  );
  const [publishedJobBonusRequirements, setPublishedJobBonusRequirements] = useState("Figma\nSQL");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("全部地點");
  const [experience, setExperience] = useState("全部年資");
  const [skill, setSkill] = useState("全部技能");
  const [aiSkills, setAiSkills] = useState<string[]>([]);
  const [aiOpen, setAiOpen] = useState(false);
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
  const [interestedCandidates, setInterestedCandidates] = useState<number[]>([]);
  const [resumeReviewJob, setResumeReviewJob] = useState<string | null>(null);
  const [resumeReviewQuery, setResumeReviewQuery] = useState("");
  const [resumeReviewSort, setResumeReviewSort] = useState<"職缺適配度" | "最新投遞" | "有興趣">("職缺適配度");
  const [resumeGradeFilter, setResumeGradeFilter] = useState("全部學歷");
  const [resumeSkillFilters, setResumeSkillFilters] = useState<string[]>([]);
  const [resumeFilterOpen, setResumeFilterOpen] = useState(false);
  const [resumeProfileTalent, setResumeProfileTalent] = useState<Talent | null>(null);
  const [reviewResumeTalent, setReviewResumeTalent] = useState<Talent | null>(null);
  const [resumeAiOpen, setResumeAiOpen] = useState(false);
  const [applicantResumeZoom, setApplicantResumeZoom] = useState(100);
  const applicantResumeStageRef = useRef<HTMLElement | null>(null);
  const applicantResumePaperRef = useRef<HTMLDivElement | null>(null);
  const [showCompanyEditor, setShowCompanyEditor] = useState(false);
  const [jobEditorOpen, setJobEditorOpen] = useState(false);
  const [closingJobTitle, setClosingJobTitle] = useState<string | null>(null);
  const [companyProfile, setCompanyProfile] = useState({ name: "Orbit 數位產品", bio: "招募團隊", avatar: "" });
  const [managedJobQuery, setManagedJobQuery] = useState("");
  const [managedJobSort, setManagedJobSort] = useState<"最新發布" | "瀏覽數" | "有興趣" | "已結束">("最新發布");

  const companyJobs = useMemo(
    () => [
      {
        title: activeJob,
        requirements: publishedJobRequirements.split("\n").filter(Boolean),
        bonusRequirements: publishedJobBonusRequirements.split("\n").filter(Boolean),
      },
      ...fixedCompanyJobs
        .filter((job) => job.title !== activeJob)
        .map((job) => ({ ...job, bonusRequirements: [] as string[] })),
    ],
    [activeJob, publishedJobBonusRequirements, publishedJobRequirements],
  );
  const selectedJobMatch = companyJobs.find(
    (job) => job.title === selectedMatchJob,
  );
  const managedJobs = companyJobs.map((job, index) => ({
    ...job,
    description:
      index === 0
        ? publishedJobDescription
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
  const visibleManagedJobs = managedJobs
    .filter((job) => {
      const searchable = `${job.title} ${job.description} ${job.requirements.join(" ")} ${job.bonusRequirements.join(" ")}`.toLowerCase();
      return searchable.includes(managedJobQuery.trim().toLowerCase());
    })
    .sort((a, b) => managedJobSort === "瀏覽數"
      ? b.views - a.views
      : managedJobSort === "有興趣"
        ? b.interested - a.interested
        : managedJobSort === "已結束"
          ? Number(closedJobs.includes(b.title)) - Number(closedJobs.includes(a.title))
          : managedJobs.indexOf(a) - managedJobs.indexOf(b));

  const selectedReviewJob = managedJobs.find((job) => job.title === resumeReviewJob);
  const applicantResume = reviewResumeTalent ? getPublicResumes(reviewResumeTalent)[0] : null;
  const reviewJobIndex = Math.max(0, managedJobs.findIndex((job) => job.title === resumeReviewJob));
  const reviewCandidates = talents
    .slice(0, Math.max(3, talents.length - reviewJobIndex * 2))
    .map((talent, index) => ({
      talent,
      grade: candidateGrades[index],
      submittedAt: candidateSubmittedAt[index],
      submittedOrder: index,
      fit: Math.max(55, talent.fit - reviewJobIndex * 5 + ((talent.id + reviewJobIndex) % 3)),
    }))
    .filter(({ talent, grade }) => {
      const searchable = `${talent.nickname} ${talent.headline} ${talent.bio} ${talent.skills.join(" ")} ${talent.resume.join(" ")}`.toLowerCase();
      return searchable.includes(resumeReviewQuery.trim().toLowerCase())
        && (resumeGradeFilter === "全部學歷"
          || grade === resumeGradeFilter
          || (resumeGradeFilter.endsWith("以上")
            && gradeOrder.indexOf(grade) >= gradeOrder.indexOf(resumeGradeFilter.replace("以上", ""))))
        && resumeSkillFilters.every((item) => talent.skills.includes(item));
    })
    .sort((a, b) => resumeReviewSort === "最新投遞"
      ? a.submittedOrder - b.submittedOrder
      : resumeReviewSort === "有興趣"
        ? Number(interestedCandidates.includes(b.talent.id)) - Number(interestedCandidates.includes(a.talent.id)) || b.fit - a.fit
        : b.fit - a.fit);
  const resumeFilterCount = Number(resumeGradeFilter !== "全部學歷") + resumeSkillFilters.length;
  const visibleTalents = talents
    .filter((talent) => {
      const text = `${talent.nickname} ${talent.headline} ${talent.bio} ${talent.skills.join(" ")}`.toLowerCase();
      return text.includes(query.trim().toLowerCase())
        && (location === "全部地點" || talent.location === location)
        && (experience === "全部年資" || talent.experience === experience)
        && (skill === "全部技能" || talent.skills.includes(skill))
        && aiSkills.every((item) => talent.skills.includes(item));
    })
    .sort((a, b) => b.fit - a.fit);

  useEffect(() => {
    if (!resumeReviewJob && !resumeFilterOpen && !resumeProfileTalent && !selectedManagedJob && !jobEditorOpen && !closingJobTitle) return;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
    };
  }, [closingJobTitle, jobEditorOpen, resumeFilterOpen, resumeProfileTalent, resumeReviewJob, selectedManagedJob]);

  useEffect(() => {
    const paper = applicantResumePaperRef.current;
    if (!paper || !reviewResumeTalent) return;

    const handleResumeZoom = (event: WheelEvent) => {
      if ((!event.ctrlKey && !event.metaKey) || event.deltaY === 0) return;
      event.preventDefault();
      event.stopPropagation();

      const stage = applicantResumeStageRef.current;
      if (!stage) return;
      const nextZoom = Math.min(160, Math.max(60, applicantResumeZoom + (event.deltaY < 0 ? 10 : -10)));
      if (nextZoom === applicantResumeZoom) return;

      const paperRect = paper.getBoundingClientRect();
      const pointerX = event.clientX - paperRect.left;
      const pointerY = event.clientY - paperRect.top;
      const ratio = nextZoom / applicantResumeZoom;
      setApplicantResumeZoom(nextZoom);

      window.requestAnimationFrame(() => {
        const nextRect = paper.getBoundingClientRect();
        stage.scrollLeft += nextRect.left + pointerX * ratio - event.clientX;
        stage.scrollTop += nextRect.top + pointerY * ratio - event.clientY;
      });
    };

    paper.addEventListener("wheel", handleResumeZoom, { passive: false });
    return () => paper.removeEventListener("wheel", handleResumeZoom);
  }, [applicantResumeZoom, reviewResumeTalent]);

  function publishJob() {
    if (!title.trim() || !description.trim() || !requirements.trim()) return;
    const wasEditing = Boolean(editingJob);
    const publishedRequirements = requirements.trim() || (description.includes("研究")
      ? "使用者研究\n需求分析\n跨部門協作\n產品規劃"
      : "溝通協作\n問題分析\n專案執行");
    setRequirements(publishedRequirements);
    setActiveJob(title.trim());
    setPublishedJobDescription(description.trim());
    setPublishedJobRequirements(publishedRequirements);
    setPublishedJobBonusRequirements(bonusRequirements.trim());
    setNotice(
      editingJob ? "職缺內容已更新" : "職缺已發布，人才排序已依新職缺更新",
    );
    setSelectedManagedJob(wasEditing ? title.trim() : null);
    setEditingJob(null);
    setJobEditorOpen(false);
    setView("jobs");
    window.setTimeout(() => setNotice(""), 2600);
  }

  function startNewJob() {
    setEditingJob(null);
    setTitle("");
    setDescription("");
    setRequirements("");
    setBonusRequirements("");
    setJobEditorOpen(true);
  }

  function editCompanyJob(job: (typeof managedJobs)[number]) {
    setEditingJob(job.title);
    setTitle(job.title);
    setDescription(job.description);
    setRequirements(job.requirements.join("\n"));
    setBonusRequirements(job.bonusRequirements.join("\n"));
    setJobEditorOpen(true);
  }

  return (
    <main className="enterprise-shell">
      <aside className="enterprise-sidebar">
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GoodJob</span>
          <button className="enterprise-guide-button" aria-label="企業版導覽" onClick={() => { setNotice("企業版導覽將在下一階段開放"); window.setTimeout(() => setNotice(""), 2400); }}>?</button>
        </div>
        <nav>
          <button
            className={view === "jobs" ? "active" : ""}
            onClick={() => setView("jobs")}
          >
            已發布職缺
          </button>
          <button
            className={view === "resumes" ? "active" : ""}
            onClick={() => { setView("resumes"); setResumeReviewJob(null); }}
          >
            檢視履歷
          </button>
          <button className={view === "messages" ? "active" : ""} onClick={() => setView("messages")}>聯繫人才</button>
        </nav>
        <div className="enterprise-sidebar-bottom">
          <button onClick={onSwitchRole}>⇄ 切換展示身分</button>
          <button className="enterprise-company" onClick={() => setShowCompanyEditor(true)} aria-label="編輯企業資料">
            <span className={companyProfile.avatar ? "has-image" : ""} style={companyProfile.avatar ? { backgroundImage: `url(${companyProfile.avatar})` } : undefined}>{!companyProfile.avatar && (companyProfile.name.slice(0, 1) || "企")}</span>
            <div>
              <strong>{companyProfile.name}</strong>
            </div>
          </button>
        </div>
      </aside>
      <section className="enterprise-main">
        <div className="enterprise-content">
          {view === "jobs" ? (
            <section className="enterprise-jobs-page page-enter">
              <header className="page-title-row">
                <div>
                  <span className="page-kicker">YOUR OPEN ROLES</span>
                  <h1>已發布職缺</h1>
                  <p>管理企業發布的職缺、人才興趣與招募狀態</p>
                </div>
                <div className="enterprise-job-header-actions">
                  <label className="enterprise-job-search">
                    <span>⌕</span>
                    <input
                      value={managedJobQuery}
                      onChange={(event) => setManagedJobQuery(event.target.value)}
                      placeholder="搜尋職缺或關鍵字"
                    />
                  </label>
                  <select
                    value={managedJobSort}
                    onChange={(event) => setManagedJobSort(event.target.value as typeof managedJobSort)}
                    aria-label="職缺排序方式"
                  >
                    <option>最新發布</option>
                    <option>瀏覽數</option>
                    <option>有興趣</option>
                    <option>已結束</option>
                  </select>
                  <button className="add-button" onClick={startNewJob}>
                    ＋ 發布職缺
                  </button>
                </div>
              </header>
              <div className="company-job-summary">
                <article>
                  <span>招募中職缺</span>
                  <strong>
                    {
                      managedJobs.filter((job) => job.status === "招募中")
                        .length
                    }
                  </strong>
                </article>
                <article>
                  <span>有興趣的人才</span>
                  <strong>
                    {managedJobs.reduce((sum, job) => sum + job.interested, 0)}
                  </strong>
                </article>
                <article>
                  <span>累積瀏覽</span>
                  <strong>
                    {managedJobs.reduce((sum, job) => sum + job.views, 0)}
                  </strong>
                </article>
              </div>
              <div className="company-job-grid">
                {visibleManagedJobs.map((job) => (
                  <article
                    className={job.status === "已結束" ? "closed" : ""}
                    key={job.title}
                  >
                    <button
                      className="company-job-card-open"
                      aria-label={`查看 ${job.title} 職缺詳情`}
                      onClick={() => setSelectedManagedJob(job.title)}
                    />
                    <header>
                      <span className="company-job-logo">O</span>
                      <div>
                        {job.status !== "已結束" && <small>{job.postedAt}發布</small>}
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
                      <div className="company-job-metrics">
                        <span><b>{job.interested}</b> 人有興趣</span>
                        <span><b>{job.views}</b> 次瀏覽</span>
                      </div>
                      <div className="company-job-card-actions">
                        <button onClick={(event) => { event.stopPropagation(); editCompanyJob(job); }}>編輯職缺</button>
                        <button
                          className="danger"
                          disabled={job.status === "已結束"}
                          onClick={(event) => {
                            event.stopPropagation();
                            setClosingJobTitle(job.title);
                          }}
                        >
                          結束招募
                        </button>
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          ) : view === "resumes" ? (
            <>
              {resumeReviewJob && selectedReviewJob ? (
                reviewResumeTalent && applicantResume ? (
                  <section className="enterprise-resume-workspace enterprise-applicant-resume page-enter">
                    <header className="resume-workspace-header applicant-resume-header">
                      <button className="resume-workspace-back" onClick={() => { setResumeAiOpen(false); setReviewResumeTalent(null); }}>← 返回履歷列表</button>
                      <h1>{reviewResumeTalent.nickname}<span>應徵職位：{selectedReviewJob.title}</span></h1>
                      <div className="applicant-resume-actions"><button className="ai-summary-button" type="button" onClick={() => setResumeAiOpen(true)}><span aria-hidden="true">✦</span>AI 摘要</button><button className={`talent-interest-button${interestedCandidates.includes(reviewResumeTalent.id) ? " active" : ""}`} type="button" onClick={() => setInterestedCandidates((current) => current.includes(reviewResumeTalent.id) ? current.filter((id) => id !== reviewResumeTalent.id) : [...current, reviewResumeTalent.id])}>{interestedCandidates.includes(reviewResumeTalent.id) ? "✓ 有興趣" : "有興趣"}</button><button type="button" onClick={() => { setChatTalentName(reviewResumeTalent.nickname); setView("messages"); setReviewResumeTalent(null); setResumeReviewJob(null); }}>聯絡此人才</button></div>
                    </header>
                    <main className="applicant-resume-stage" ref={applicantResumeStageRef}><div className="applicant-resume-zoom-layer" ref={applicantResumePaperRef} style={{ zoom: applicantResumeZoom / 100 }}><ApplicantResumePaper talent={reviewResumeTalent} resume={applicantResume} /></div><span className="applicant-resume-zoom-hint">Ctrl + 滾輪縮放 · {applicantResumeZoom}%</span></main>
                    {resumeAiOpen && <ResumeAiAnalysis talent={reviewResumeTalent} resume={applicantResume} job={selectedReviewJob} fit={reviewCandidates.find(({ talent }) => talent.id === reviewResumeTalent.id)?.fit ?? reviewResumeTalent.fit} onClose={() => setResumeAiOpen(false)} />}
                  </section>
                ) : (
                <section className="enterprise-resume-workspace page-enter">
                  <header className="resume-workspace-header">
                    <button className="resume-workspace-back" onClick={() => { setResumeReviewJob(null); setResumeReviewQuery(""); }}>← 返回檢視履歷</button>
                    <h1>{selectedReviewJob.title}<span>（{reviewCandidates.length} 份履歷）</span></h1>
                    <div className="resume-review-toolbar">
                      <label className="resume-review-search"><span>⌕</span><input value={resumeReviewQuery} onChange={(event) => setResumeReviewQuery(event.target.value)} placeholder="搜尋姓名、技能或履歷關鍵字" /></label>
                      <button className={resumeFilterCount ? "active" : ""} onClick={() => setResumeFilterOpen(true)}>篩選{resumeFilterCount ? ` (${resumeFilterCount})` : ""}</button>
                      <select aria-label="履歷排序方式" value={resumeReviewSort} onChange={(event) => setResumeReviewSort(event.target.value as "職缺適配度" | "最新投遞" | "有興趣")}><option>職缺適配度</option><option>最新投遞</option><option>有興趣</option></select>
                    </div>
                  </header>
                    <div className="resume-review-panel-body">
                      {reviewCandidates.length ? <div className="received-resume-grid">{reviewCandidates.map(({ talent, grade, submittedAt, fit }) => {
                    return <article className="received-resume-card" key={talent.id}>
                      <button className="received-resume-open" aria-label={`查看 ${talent.nickname} 的履歷`} onClick={() => { setApplicantResumeZoom(100); setReviewResumeTalent(talent); }} />
                      <header><button className="received-resume-avatar" aria-label={`查看 ${talent.nickname} 的自我介紹`} onClick={() => setResumeProfileTalent(talent)}>{talent.nickname.slice(0, 1)}</button><div className="received-resume-identity"><div className="received-resume-name-line"><div className="received-resume-name"><h2>{talent.nickname}</h2></div><small className="received-resume-submitted">{submittedAt}</small></div><p>{candidatePrograms[talent.id - 1]} {grade}</p></div></header>
                      <div className="received-resume-skills">{talent.skills.map((item) => <span key={item}>{item}</span>)}</div>
                      <footer className="received-resume-footer"><div className="received-resume-fit"><span>適配度</span><strong>{fit}<small>%</small></strong></div><button className={interestedCandidates.includes(talent.id) ? "active" : ""} type="button" onClick={(event) => { event.stopPropagation(); setInterestedCandidates((current) => current.includes(talent.id) ? current.filter((id) => id !== talent.id) : [...current, talent.id]); }}>{interestedCandidates.includes(talent.id) ? "✓ 有興趣" : "有興趣"}</button></footer>
                    </article>;
                      })}</div> : <div className="resume-review-empty"><span>⌕</span><h2>找不到符合條件的履歷</h2><button onClick={() => { setResumeReviewQuery(""); setResumeGradeFilter("全部學歷"); setResumeSkillFilters([]); }}>清除搜尋與篩選</button></div>}
                    </div>
                </section>
                )
              ) : (
                <section className="enterprise-resume-overview page-enter">
                  <header className="page-title-row"><div><span className="page-kicker">RESUME REVIEW</span><h1>檢視履歷</h1><p>依職缺查看目前收到的履歷與適配排序。</p></div></header>
                  <div className="resume-job-grid">{managedJobs.map((job, index) => <button key={job.title} onClick={() => { setResumeReviewJob(job.title); setResumeReviewQuery(""); setResumeReviewSort("職缺適配度"); setResumeGradeFilter("全部學歷"); setResumeSkillFilters([]); }}><header><span className="company-job-logo">O</span><div><strong>{job.title}</strong></div></header><div className="resume-job-count"><div><strong>{Math.max(3, talents.length - index * 2)}</strong><span>份履歷</span></div><small>最新投遞：{candidateSubmittedAt[Math.min(index, candidateSubmittedAt.length - 1)]}</small></div></button>)}</div>
                </section>
              )}
              {resumeFilterOpen && <div className="enterprise-resume-filter-backdrop"><section className="enterprise-resume-filter-modal" role="dialog" aria-modal="true" aria-labelledby="resume-filter-title"><header><div><span className="page-kicker">FILTER RESUMES</span><h2 id="resume-filter-title">篩選履歷</h2></div><button aria-label="關閉篩選" onClick={() => setResumeFilterOpen(false)}>×</button></header><main><label className="resume-education-filter"><span>學歷</span><select value={resumeGradeFilter} onChange={(event) => setResumeGradeFilter(event.target.value)}><option>全部學歷</option>{gradeFilterOptions.map((item) => <option key={item}>{item}</option>)}</select></label><fieldset><legend>具備技能</legend><div>{[...new Set(talents.flatMap((item) => item.skills))].sort().map((item) => <label key={item}><input type="checkbox" checked={resumeSkillFilters.includes(item)} onChange={() => setResumeSkillFilters((current) => current.includes(item) ? current.filter((skill) => skill !== item) : [...current, item])} /><span>{item}</span></label>)}</div></fieldset></main><footer><button onClick={() => { setResumeGradeFilter("全部學歷"); setResumeSkillFilters([]); }}>清除全部</button><button className="primary-flow-button" onClick={() => setResumeFilterOpen(false)}>套用篩選</button></footer></section></div>}
              {resumeProfileTalent && <div className="resume-candidate-profile-backdrop"><section className="resume-candidate-profile" role="dialog" aria-modal="true" aria-labelledby="resume-candidate-name"><header><span className="received-resume-avatar">{resumeProfileTalent.nickname.slice(0, 1)}</span><div><h2 id="resume-candidate-name">{resumeProfileTalent.nickname}</h2></div><button aria-label="關閉投遞者資料" onClick={() => setResumeProfileTalent(null)}>×</button></header><main><h3>自我介紹</h3><p>{resumeProfileTalent.bio}</p></main></section></div>}
            </>
          ) : view === "messages" ? (
            <ChatWorkspace audience="business" initialContact={chatTalentName} />
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
                      {item} <span aria-hidden="true">×</span>
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
                  <article className="talent-card" key={talent.id}>
                    <header>
                      <span className="talent-avatar">
                        {talent.nickname.slice(0, 1)}
                      </span>
                      <div>
                        <small>{index < 3 ? "✦ 優先推薦" : "公開人才"}</small>
                        <h2>{talent.nickname}</h2>
                        <p>{talent.headline}</p>
                      </div>
                      <span className="talent-card-link">查看詳細 →</span>
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
                        <em>查看詳細 →</em>
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
                          <em>開啟履歷 →</em>
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
      {jobEditorOpen && (
        <div
          className="enterprise-job-drawer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={editingJob ? "編輯職缺" : "發布職缺"}
        >
          <button
            className="modal-backdrop-dismiss"
            aria-label="關閉職缺編輯"
            onClick={() => {
              setJobEditorOpen(false);
              setEditingJob(null);
              setSelectedManagedJob(null);
            }}
          />
          <aside className="enterprise-job-drawer">
            <header>
              <div>
                <span className="page-kicker">PUBLISH A ROLE</span>
                <h2>{editingJob ? "編輯職缺" : "發布職缺"}</h2>
              </div>
              <button
                className="flow-close"
                aria-label="關閉職缺編輯"
                onClick={() => {
                  setJobEditorOpen(false);
                  setEditingJob(null);
                  setSelectedManagedJob(null);
                }}
              >
                ×
              </button>
            </header>
            <div className="enterprise-job-drawer-content">
              <div className="job-publish-layout">
                <main>
                  <label>
                    <span>職缺名稱 <b>必填</b></span>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="例如：Associate Product Manager"
                    />
                  </label>
                  <label>
                    <span>職缺敘述 <b>必填</b></span>
                    <textarea
                      rows={9}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="描述這個角色的任務、團隊與期待…"
                    />
                  </label>
                  <div className="job-skill-fields">
                    <label>
                      <span>必備技能 <b>必填</b></span>
                      <textarea
                        rows={7}
                        value={requirements}
                        onChange={(event) => setRequirements(event.target.value)}
                        placeholder="每行輸入一項必備技能"
                      />
                    </label>
                    <label>
                      <span>加分技能 <small>選填</small></span>
                      <textarea
                        rows={7}
                        value={bonusRequirements}
                        onChange={(event) => setBonusRequirements(event.target.value)}
                        placeholder="每行輸入一項加分技能"
                      />
                    </label>
                  </div>
                </main>
              </div>
            </div>
            <footer className="enterprise-job-drawer-footer">
              <button
                className="enterprise-job-editor-cancel"
                onClick={() => {
                  setJobEditorOpen(false);
                  setEditingJob(null);
                }}
              >
                取消
              </button>
              <button
                className="primary-flow-button"
                disabled={!title.trim() || !description.trim() || !requirements.trim()}
                onClick={publishJob}
              >
                {editingJob ? "儲存變更" : "發布職缺　→"}
              </button>
            </footer>
          </aside>
        </div>
      )}
      {closingJobTitle && (
        <div className="resume-application-overlay enterprise-close-job-overlay">
          <section className="resume-application-modal confirmation enterprise-close-job-modal" role="dialog" aria-modal="true" aria-labelledby="close-job-title">
            <header>
              <div>
                <h2 id="close-job-title">確認結束招募</h2>
                <p>此操作會停止接受新的履歷投遞</p>
              </div>
              <button aria-label="關閉確認視窗" onClick={() => setClosingJobTitle(null)}>×</button>
            </header>
            <main className="resume-application-confirmation">
              <span aria-hidden="true">!</span>
              <p>確定要結束<strong>【{closingJobTitle}】</strong>的招募嗎？</p>
            </main>
            <footer>
              <button onClick={() => setClosingJobTitle(null)}>取消</button>
              <button
                className="danger"
                onClick={() => {
                  setClosedJobs((current) => current.includes(closingJobTitle) ? current : [...current, closingJobTitle]);
                  setClosingJobTitle(null);
                  setSelectedManagedJob(null);
                  setNotice("已結束此職缺的招募");
                  window.setTimeout(() => setNotice(""), 2400);
                }}
              >
                確認結束
              </button>
            </footer>
          </section>
        </div>
      )}
      {selectedCompanyJob && (
        <div
          className="profile-item-backdrop company-job-drawer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCompanyJob.title} 職缺管理`}
        >
          <button className="modal-backdrop-dismiss" aria-label="關閉職缺詳情" onClick={() => setSelectedManagedJob(null)} />
          <article className="profile-item-modal company-job-dialog">
            <header>
              <div className="company-job-drawer-title">
                <div className="company-job-heading-meta">
                  <em>{selectedCompanyJob.status}</em>
                  {selectedCompanyJob.status !== "已結束" && <small>{selectedCompanyJob.postedAt}發布</small>}
                </div>
                <h2>{selectedCompanyJob.title}</h2>
              </div>
              <button className="flow-close" aria-label="關閉職缺詳情" onClick={() => setSelectedManagedJob(null)}>×</button>
            </header>
            <main>
              <section className="company-job-interest-card">
                <div>
                  <span>有興趣人才</span>
                  <strong>
                    {selectedCompanyJob.interested}
                    <small>人</small>
                  </strong>
                </div>
                <div>
                  <span>職缺瀏覽</span>
                  <strong>
                    {selectedCompanyJob.views}
                    <small>次</small>
                  </strong>
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
            </main>
            <footer className="company-job-dialog-actions">
              <button onClick={() => editCompanyJob(selectedCompanyJob)}>編輯職缺</button>
              <button
                className="danger"
                disabled={selectedCompanyJob.status === "已結束"}
                onClick={() => setClosingJobTitle(selectedCompanyJob.title)}
              >
                {selectedCompanyJob.status === "已結束" ? "招募已結束" : "結束招募"}
              </button>
            </footer>
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
      {showCompanyEditor && <ProfileEditModal variant="company" profile={companyProfile} onClose={() => setShowCompanyEditor(false)} onSave={(profile) => { setCompanyProfile(profile); setShowCompanyEditor(false); setNotice("企業資料已更新"); window.setTimeout(() => setNotice(""), 2400); }} />}
    </main>
  );
}
