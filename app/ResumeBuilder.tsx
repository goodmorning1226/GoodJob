"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { NewExperience } from "./ExperienceFlow";

type Props = { experiences: NewExperience[]; initialTarget?: string; embedded?: boolean; startInEditor?: boolean; onClose?: () => void; onGenerated?: () => void; onLibraryOpen?: () => void; onSaved?: () => void };
type Template = "ats" | "project" | "impact";
type TargetMode = "specific" | "general";

const templateInfo = {
  ats: { name: "ATS 專業版", note: "單欄、清楚、適合大多數企業系統" },
  project: { name: "專案導向版", note: "突出專案、競賽與實作成果" },
  impact: { name: "成果導向版", note: "強調數據、責任與工作影響" },
};

const sections = ["個人摘要", "工作與實習", "專案經驗", "教育背景", "技能", "競賽與獎項", "語言能力"];
const toolSkillNames = new Set(["Figma", "Excel", "GA4"]);
const domainSkillNames = new Set(["服務設計", "數位產品", "教育科技", "校園服務"]);
const experienceTypeTone: Record<string, string> = {
  "正職": "work", "工作": "work", "實習": "internship", "競賽": "competition",
  "專案": "project", "修課": "course", "社團": "club", "研究": "research", "其他": "other",
};
const sourceFilterOptions = ["全部", "正職", "實習", "修課", "專案", "競賽", "社團", "研究", "其他"];
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

function inferJobTags(title: string) {
  const normalized = title.toLowerCase();
  if (/product|產品|pm/.test(normalized)) return ["產品經理", "產品企劃", "跨部門協作"];
  if (/engineer|developer|工程|開發|frontend|backend|software/.test(normalized)) return ["工程", "軟體開發", "技術協作"];
  if (/design|designer|ux|ui|設計/.test(normalized)) return ["產品設計", "UX／UI", "使用者體驗"];
  if (/data|analyst|分析|數據|資料/.test(normalized)) return ["資料分析", "數據洞察", "商業分析"];
  if (/marketing|growth|行銷|成長/.test(normalized)) return ["行銷", "成長策略", "市場分析"];
  if (/research|研究/.test(normalized)) return ["使用者研究", "研究分析", "洞察整理"];
  return ["職務專業", "溝通協作"];
}

const jobCatalog: Record<string, { title: string; company: string; fit: number }[]> = {
  "產品管理": [
    { title: "Associate Product Manager", company: "Orbit 數位產品", fit: 82 },
    { title: "Product Operations Specialist", company: "島嶼科技", fit: 78 },
  ],
  "使用者研究": [
    { title: "UX Research Assistant", company: "日日生活科技", fit: 76 },
    { title: "Junior UX Researcher", company: "木星數位科技", fit: 73 },
  ],
  "資料分析": [
    { title: "Product Data Analyst", company: "森野數據", fit: 69 },
    { title: "Business Analyst", company: "光點顧問", fit: 65 },
  ],
};

export default function ResumeBuilder({ experiences, initialTarget, embedded = false, startInEditor = false, onClose, onGenerated, onLibraryOpen, onSaved }: Props) {
  const [mode, setMode] = useState<"library" | "wizard" | "editor">(startInEditor ? "editor" : initialTarget ? "wizard" : "library");
  const [wizardStep, setWizardStep] = useState(1);
  const [template, setTemplate] = useState<Template>("ats");
  const [language, setLanguage] = useState("繁體中文");
  const [pageCount, setPageCount] = useState("1 頁");
  const [targetJob, setTargetJob] = useState(initialTarget || "通用履歷");
  const [selectedExperiences, setSelectedExperiences] = useState([0, 1, 2, 4]);
  const [enabledSections, setEnabledSections] = useState(sections);
  const [sectionOrder, setSectionOrder] = useState(sections);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const previousSectionPositions = useRef<Map<string, number>>(new Map());
  const [resumeExperienceIndexes, setResumeExperienceIndexes] = useState([0, 1, 2]);
  const [activePanel, setActivePanel] = useState<"content" | "design">("content");
  const [exported, setExported] = useState(false);
  const [saved, setSaved] = useState(true);
  const [resumeTitle, setResumeTitle] = useState("自訂標題......");
  const [resumeZoom, setResumeZoom] = useState(85);
  const [resumePageHeight, setResumePageHeight] = useState(A4_HEIGHT);
  const [generating, setGenerating] = useState(false);
  const [targetMode, setTargetMode] = useState<TargetMode>(initialTarget ? "specific" : "general");
  const [selectedField, setSelectedField] = useState("");
  const [fieldQuery, setFieldQuery] = useState("");
  const [jobQuery, setJobQuery] = useState(initialTarget || "");
  const [inferredJobTags, setInferredJobTags] = useState<string[]>([]);
  const [customJobTags, setCustomJobTags] = useState<string[]>([]);
  const [newJobTag, setNewJobTag] = useState("");
  const [analyzingJobTags, setAnalyzingJobTags] = useState(false);
  const [fieldOpen, setFieldOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("全部");
  const [sourceFilterOpen, setSourceFilterOpen] = useState(false);
  const [resumeQuery, setResumeQuery] = useState("");
  const [activeSkillCategory, setActiveSkillCategory] = useState("核心能力");
  const sourceFilterMenu = useRef<HTMLDivElement>(null);
  const resumeCanvasArea = useRef<HTMLElement>(null);
  const resumeZoomArea = useRef<HTMLDivElement>(null);
  const resumePaper = useRef<HTMLDivElement>(null);
  const resumeTitleInput = useRef<HTMLInputElement>(null);
  const wizardContent = useRef<HTMLDivElement>(null);
  const pendingZoomAnchor = useRef<{ clientX: number; clientY: number; localX: number; localY: number; nextZoom: number } | null>(null);

  useEffect(() => {
    if (mode !== "wizard" || generating) return;
    if (wizardContent.current) wizardContent.current.scrollTop = 0;
  }, [generating, mode, wizardStep]);

  useEffect(() => {
    if (mode !== "editor" || window.matchMedia("(max-width: 760px)").matches) return;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "wizard") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mode]);

  useEffect(() => {
    if (mode !== "editor") return;
    const element = resumeZoomArea.current;
    if (!element) return;
    const zoomResume = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setResumeZoom((zoom) => {
        const nextZoom = Math.min(120, Math.max(60, zoom + (event.deltaY < 0 ? 5 : -5)));
        const page = resumeZoomArea.current;
        if (nextZoom === zoom || !page) return zoom;
        const pageRect = page.getBoundingClientRect();
        const scale = zoom / 100;
        pendingZoomAnchor.current = {
          clientX: event.clientX,
          clientY: event.clientY,
          localX: (event.clientX - pageRect.left) / scale,
          localY: (event.clientY - pageRect.top) / scale,
          nextZoom,
        };
        return nextZoom;
      });
    };
    element.addEventListener("wheel", zoomResume, { passive: false });
    return () => element.removeEventListener("wheel", zoomResume);
  }, [mode]);

  useEffect(() => {
    if (!sourceFilterOpen) return;
    const closeFilter = (event: MouseEvent) => {
      if (!sourceFilterMenu.current?.contains(event.target as Node)) setSourceFilterOpen(false);
    };
    document.addEventListener("mousedown", closeFilter);
    return () => document.removeEventListener("mousedown", closeFilter);
  }, [sourceFilterOpen]);

  useEffect(() => {
    if (targetMode !== "specific" || !jobQuery.trim()) {
      setInferredJobTags([]);
      setAnalyzingJobTags(false);
      return;
    }
    setAnalyzingJobTags(true);
    const timer = window.setTimeout(() => {
      setInferredJobTags(inferJobTags(jobQuery));
      setAnalyzingJobTags(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [jobQuery, targetMode]);

  useLayoutEffect(() => {
    const anchor = pendingZoomAnchor.current;
    const container = resumeCanvasArea.current;
    const page = resumeZoomArea.current;
    if (!anchor || !container || !page || anchor.nextZoom !== resumeZoom) return;
    const pageRect = page.getBoundingClientRect();
    const scale = resumeZoom / 100;
    const anchoredX = pageRect.left + anchor.localX * scale;
    const anchoredY = pageRect.top + anchor.localY * scale;
    container.scrollLeft += anchoredX - anchor.clientX;
    container.scrollTop += anchoredY - anchor.clientY;
    pendingZoomAnchor.current = null;
  }, [resumeZoom]);

  useLayoutEffect(() => {
    if (mode !== "editor") return;
    const page = resumePaper.current;
    if (!page) return;
    const updatePageHeight = () => setResumePageHeight(Math.max(A4_HEIGHT, page.scrollHeight));
    updatePageHeight();
    const observer = new ResizeObserver(updatePageHeight);
    observer.observe(page);
    return () => observer.disconnect();
  }, [mode]);

  const fieldOptions = Object.keys(jobCatalog).filter((field) => field.includes(fieldQuery.trim()));
  const jobOptions = (jobCatalog[selectedField] || []).filter((job) =>
    (job.title + " " + job.company).toLowerCase().includes(jobQuery.trim().toLowerCase())
  );
  const skillExperienceCounts = experiences.reduce<Record<string, number>>((counts, experience) => {
    new Set(experience.tags).forEach((skill) => { counts[skill] = (counts[skill] || 0) + 1; });
    return counts;
  }, {});
  const sortSkillsByLevel = (skills: string[]) => skills.sort((a, b) => skillExperienceCounts[b] - skillExperienceCounts[a] || a.localeCompare(b, "zh-Hant"));
  const categorizedSkills = [
    { label: "核心能力", skills: sortSkillsByLevel(Object.keys(skillExperienceCounts).filter((skill) => !toolSkillNames.has(skill) && !domainSkillNames.has(skill))) },
    { label: "工具技能", skills: sortSkillsByLevel(Object.keys(skillExperienceCounts).filter((skill) => toolSkillNames.has(skill))) },
    { label: "領域知識", skills: sortSkillsByLevel(Object.keys(skillExperienceCounts).filter((skill) => domainSkillNames.has(skill))) },
  ];
  const activeSkillGroup = categorizedSkills.find((category) => category.label === activeSkillCategory) ?? categorizedSkills[0];
  const skillLevel = (skill: string) => skillExperienceCounts[skill] >= 3 ? "mastered" : skillExperienceCounts[skill] === 2 ? "applied" : "beginner";
  const skillLevelLabel = (skill: string) => skillExperienceCounts[skill] >= 3 ? "精熟" : skillExperienceCounts[skill] === 2 ? "活用" : "入門";
  const sourceFilterCounts = sourceFilterOptions.reduce<Record<string, number>>((counts, option) => {
    counts[option] = option === "全部"
      ? experiences.length
      : experiences.filter((experience) => option === "正職" ? ["正職", "工作"].includes(experience.type) : experience.type === option).length;
    return counts;
  }, {});
  const filteredExperienceEntries = experiences.map((item, index) => ({ item, index })).filter(({ item }) => sourceFilter === "全部" || (sourceFilter === "正職" ? ["正職", "工作"].includes(item.type) : item.type === sourceFilter));
  const resumeFiles = [{ title: "Associate Product Manager", company: "Orbit 數位產品", template: "ATS 專業版", score: 82, date: "今天 14:32", color: "green" }, { title: "UX Research Assistant", company: "日日生活科技", template: "專案導向版", score: 76, date: "昨天", color: "purple" }, { title: "通用求職履歷", company: "未指定職缺", template: "ATS 專業版", score: null, date: "8 月 22 日", color: "orange" }];
  const filteredResumeFiles = resumeFiles.filter((resume) => `${resume.title} ${resume.company} ${resume.template}`.toLowerCase().includes(resumeQuery.trim().toLowerCase()));

  function toggleExperience(index: number) {
    setSelectedExperiences((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  function toggleSection(section: string) {
    setEnabledSections((current) => current.includes(section) ? current.filter((item) => item !== section) : [...current, section]);
    setSaved(false);
  }

  function moveDraggedSection(target: string) {
    if (!draggedSection || draggedSection === target) return;
    const positions = new Map<string, number>();
    document.querySelectorAll<HTMLElement>(".resume-editor-page .section-item").forEach((element) => {
      if (element.dataset.section) positions.set(element.dataset.section, element.getBoundingClientRect().top);
    });
    previousSectionPositions.current = positions;
    setSectionOrder((current) => {
      const targetIndex = current.indexOf(target);
      const reordered = current.filter((section) => section !== draggedSection);
      reordered.splice(targetIndex, 0, draggedSection);
      return reordered;
    });
    setSaved(false);
  }

  function addJobTag() {
    const tag = newJobTag.trim();
    if (!tag || inferredJobTags.includes(tag) || customJobTags.includes(tag)) return;
    setCustomJobTags((current) => [...current, tag]);
    setNewJobTag("");
  }

  function dropSection() {
    setDraggedSection(null);
  }

  useLayoutEffect(() => {
    if (!previousSectionPositions.current.size) return;
    document.querySelectorAll<HTMLElement>(".resume-editor-page .section-item").forEach((element) => {
      const previousTop = element.dataset.section ? previousSectionPositions.current.get(element.dataset.section) : undefined;
      if (previousTop === undefined) return;
      const offset = previousTop - element.getBoundingClientRect().top;
      if (offset) element.animate([{ transform: `translateY(${offset}px)` }, { transform: "translateY(0)" }], { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
    previousSectionPositions.current.clear();
  }, [sectionOrder]);

  function toggleResumeExperience(index: number) {
    setResumeExperienceIndexes((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    const targetSection = ["實習", "工作"].includes(experiences[index]?.type) ? "工作與實習" : "專案經驗";
    setEnabledSections((current) => current.includes(targetSection) ? current : [...current, targetSection]);
    setSaved(false);
  }

  function generateResume() {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setSaved(true);
      if (embedded && onGenerated) onGenerated();
      else setMode("editor");
    }, 1150);
  }

  function mockExport() {
    setExported(true);
    window.setTimeout(() => setExported(false), 2200);
  }

  function closeBuilder() {
    if (embedded && onClose) onClose();
    else {
      setMode("library");
      onLibraryOpen?.();
    }
  }

  function saveResume() {
    setSaved(true);
    if (embedded && onSaved) onSaved();
    else {
      setMode("library");
      onLibraryOpen?.();
    }
  }

  if (mode === "library") return (
    <section className="resume-library page-enter">
      <header className="page-title-row"><div><span className="page-kicker">RESUME STUDIO</span><h1>我的履歷</h1><p>將經驗快速轉化成專屬履歷。</p></div></header>
      <section className="resume-skill-overview"><header><h2>已具備技能</h2><div className="analysis-tabs resume-skill-tabs">{categorizedSkills.map((category) => <button className={activeSkillCategory === category.label ? "active" : ""} key={category.label} onClick={() => setActiveSkillCategory(category.label)}>{category.label}</button>)}</div><div className="skill-level-legend"><span><i className="mastered" />精熟</span><span><i className="applied" />活用</span><span><i className="beginner" />入門</span></div></header><div className="resume-active-skill-list">{activeSkillGroup.skills.length ? activeSkillGroup.skills.map((skill) => <span className={`skill-level-${skillLevel(skill)}`} title={`${skillLevelLabel(skill)}・出現在 ${skillExperienceCounts[skill]} 段經驗`} key={skill}>{skill}</span>) : <small>尚無技能</small>}</div></section>
      <div className="resume-list-heading"><div><h3>所有履歷</h3><span>3 個版本</span></div><div className="resume-list-controls"><label className="library-search"><span>⌕</span><input value={resumeQuery} onChange={(event) => setResumeQuery(event.target.value)} placeholder="搜尋履歷標題或內容關鍵字" /></label><button className="add-button" onClick={() => { setMode("wizard"); setWizardStep(1); setTargetMode("general"); setTargetJob("通用履歷"); }}>＋ 建立履歷</button></div></div>
      <div className="resume-file-grid">
        {filteredResumeFiles.map((resume) => <button className="resume-file" key={resume.title} onClick={() => { setTemplate(resume.template === "專案導向版" ? "project" : "ats"); setTargetJob(resume.score ? `${resume.title} · ${resume.company}` : "通用履歷"); setMode("editor"); }}><div className={`resume-thumbnail ${resume.color}`}><div><strong>宋宇倫</strong><span /><span /><b /><b /><b /><i /></div></div><div className="resume-file-info"><span>{resume.company}</span><h3>{resume.title}</h3><p>{resume.template} · 1 頁</p><div><small>更新於 {resume.date}</small></div></div></button>)}
        <button className="new-resume-file" onClick={() => { setMode("wizard"); setWizardStep(1); setTargetMode("general"); setTargetJob("通用履歷"); }}><span>＋</span><strong>建立履歷</strong><small>選擇職缺或從空白開始</small></button>
      </div>
    </section>
  );

  if (mode === "wizard") return (
    <div className="resume-wizard-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeBuilder(); }}>
    <section className="resume-wizard" onMouseDown={(event) => event.stopPropagation()}>
      <header className="resume-wizard-header flow-header"><div className="flow-brand"><span className="brand-mark">G</span><span>建立履歷</span></div><div className="stepper" aria-label={`步驟 ${wizardStep}，共 4 步`}>{["目標", "格式", "模板", "內容"].map((label, index) => <div className={wizardStep >= index + 1 ? "is-active" : ""} key={label}><span>{wizardStep > index + 1 ? "✓" : index + 1}</span><small>{label}</small></div>)}</div><button className="flow-close" aria-label="關閉建立履歷" onClick={closeBuilder}>×</button></header>
      {generating ? <div className="resume-generating"><div className="paper-stack"><span /><span /><span>✦</span></div><span className="flow-kicker">BUILDING YOUR RESUME</span><h2>正在挑選最適合的經驗</h2><p>根據職缺條件調整順序、重點與篇幅⋯</p><small>Prototype 模擬，不會呼叫任何 API</small></div> : <div className="resume-wizard-content" ref={wizardContent}>
        {wizardStep === 1 && <>
          <div className="wizard-title"><span className="flow-kicker">STEP 01 · TARGET</span><h2>這份履歷要用在哪裡？</h2><p>選擇目標後，我們會建議最相關的經驗與關鍵詞。</p></div>
          <div className="resume-target-options">
            <div className="target-path-grid">
              <button className={"general-resume-choice " + (targetMode === "general" ? "selected" : "")} onClick={() => { setTargetMode("general"); setTargetJob("通用履歷"); setSelectedField(""); setFieldQuery(""); setJobQuery(""); setFieldOpen(false); setJobOpen(false); }}>
                <span className="blank-target">◇</span><div><strong>建立通用履歷</strong><p>作為基礎版本或交流使用</p></div><b>{targetMode === "general" ? "✓" : "○"}</b>
              </button>
              <section className={"job-combobox-path " + (targetMode === "specific" ? "selected" : "")}>
                <button className="specific-target-selector" onClick={() => { setTargetMode("specific"); setTargetJob(jobQuery.trim()); }}><span>⌕</span><div><strong>選擇特定職缺</strong><small>先輸入職缺標題，AI 會判斷適合的標籤</small></div><b>{targetMode === "specific" ? "✓" : "○"}</b></button>
                {targetMode === "specific" && <div className="job-title-analysis">
                  <label className="job-title-field"><span>職缺標題（公司、職稱）</span><input value={jobQuery} placeholder="例如：Associate Product Manager" onFocus={() => setTargetMode("specific")} onChange={(event) => { setTargetMode("specific"); setJobQuery(event.target.value); setTargetJob(event.target.value.trim()); }} /></label>
                  <div className="job-tag-field">
                    <header><span>職缺標籤</span><small>{analyzingJobTags ? "AI 分析中…" : jobQuery.trim() ? "AI 建議，可自行補充" : "輸入標題後自動產生"}</small></header>
                    {(inferredJobTags.length > 0 || customJobTags.length > 0) && <div className="job-tag-list">{inferredJobTags.map((tag) => <span key={tag}>{tag}<small>AI</small><button aria-label={`移除 AI 標籤 ${tag}`} onClick={() => setInferredJobTags((current) => current.filter((item) => item !== tag))}>×</button></span>)}{customJobTags.map((tag) => <span className="custom" key={tag}>{tag}<button aria-label={`移除 ${tag}`} onClick={() => setCustomJobTags((current) => current.filter((item) => item !== tag))}>×</button></span>)}</div>}
                    <div className="add-job-tag"><input value={newJobTag} placeholder="補充標籤" onChange={(event) => setNewJobTag(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addJobTag(); } }} /><button disabled={!newJobTag.trim()} onClick={addJobTag}>新增</button></div>
                  </div>
                </div>}
              </section>

            </div>
          </div>
        </>}
        {wizardStep === 2 && <><div className="wizard-title"><span className="flow-kicker">STEP 02 · FORMAT</span><h2>選擇語言與篇幅</h2></div><div className="format-grid"><article><span>履歷語言</span><div>{["繁體中文", "English"].map((item) => <button className={language === item ? "selected" : ""} key={item} onClick={() => setLanguage(item)}><b>{item === "繁體中文" ? "中" : "EN"}</b><strong>{item}</strong><small>{language === item ? "✓ 已選擇" : "選擇"}</small></button>)}</div></article><article><span>履歷篇幅</span><div>{["1 頁", "2 頁"].map((item) => <button className={pageCount === item ? "selected" : ""} key={item} onClick={() => setPageCount(item)}><b className={`page-icon ${item === "2 頁" ? "two-pages" : "one-page"}`} aria-hidden="true"><i /><i /></b><strong>{item}</strong><small>{item === "1 頁" ? "精簡、適合新鮮人" : "保留更多經驗細節"}</small></button>)}</div></article></div></>}
        {wizardStep === 3 && <><div className="wizard-title"><span className="flow-kicker">STEP 03 · TEMPLATE</span><h2>選擇履歷模板</h2></div><div className="template-choice-grid">{(Object.keys(templateInfo) as Template[]).map((key) => <button className={template === key ? "selected" : ""} key={key} onClick={() => setTemplate(key)}><div className={`template-paper ${key}`}><header><b /><span /></header><i /><i /><section><span /><span /><span /></section><i /><i /></div><div><strong>{templateInfo[key].name}</strong><small>{templateInfo[key].note}</small></div><span>{template === key ? "✓" : "○"}</span></button>)}</div></>}
        {wizardStep === 4 && <><div className="wizard-title"><span className="flow-kicker">STEP 04 · CONTENT</span><h2>確認要放進履歷的經驗</h2></div><div className="experience-picker">{experiences.slice(0, 6).map((item, index) => <button className={selectedExperiences.includes(index) ? "selected" : ""} key={item.title} onClick={() => toggleExperience(index)}><span>{selectedExperiences.includes(index) ? "✓" : "+"}</span><div><small>{item.type} · {item.org}</small><strong>{item.title}</strong><p>{item.description}</p><span>{item.tags.map((tag) => <i key={tag}>{tag}</i>)}</span></div><b>{index < 3 ? "高度相關" : "可選"}</b></button>)}</div></>}
        <footer className={`wizard-footer${wizardStep === 1 ? " first-step" : ""}`}>{wizardStep > 1 && <button onClick={() => setWizardStep(wizardStep - 1)}>← 上一步</button>}<div><small>{wizardStep} / 4</small><i><b style={{ width: `${wizardStep * 25}%` }} /></i></div>{wizardStep < 4 ? <button className="primary-flow-button" disabled={wizardStep === 1 && !targetJob} onClick={() => setWizardStep(wizardStep + 1)}>下一步　→</button> : <button className="primary-flow-button" onClick={generateResume}>產生履歷　✦</button>}</footer>
      </div>}
    </section>
    </div>
  );

  return (
    <section className={`resume-editor-page page-enter${embedded ? " resume-editor-overlay" : ""}`}>
      <header className="editor-header"><button onClick={closeBuilder}>{embedded ? "← 職缺探索" : "← 我的履歷"}</button><div className="resume-title-editor"><input ref={resumeTitleInput} value={resumeTitle} style={{ width: Math.min(560, Math.max(120, [...resumeTitle].reduce((width, character) => width + (character.charCodeAt(0) > 255 ? 16 : 9), 24))) }} onChange={(event) => { setResumeTitle(event.target.value); setSaved(false); }} /><button aria-label="編輯履歷標題" title="編輯標題" onClick={() => resumeTitleInput.current?.focus()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></svg></button></div><div><button onClick={saveResume}>儲存履歷</button><button className="export-button" onClick={mockExport}>{exported ? "✓ 模擬匯出完成" : "匯出 PDF　↧"}</button></div></header>
      <div className="editor-toolbar"><div><button className={activePanel === "content" ? "active" : ""} onClick={() => setActivePanel("content")}>內容</button><button className={activePanel === "design" ? "active" : ""} onClick={() => setActivePanel("design")}>設計</button></div><span>目標：<b>{targetJob}</b></span><div><button aria-label="縮小履歷" disabled={resumeZoom <= 60} onClick={() => setResumeZoom((zoom) => Math.max(60, zoom - 5))}>−</button><span>{resumeZoom}%</span><button aria-label="放大履歷" disabled={resumeZoom >= 120} onClick={() => setResumeZoom((zoom) => Math.min(120, zoom + 5))}>＋</button></div></div>
      <div className="resume-editor-layout">
        <aside className="editor-left">
          {activePanel === "content" ? <><div className="editor-panel-title"><span>履歷區塊</span><small>拖曳調整順序</small></div><div className="section-list">{sectionOrder.map((section) => { const isVisible = enabledSections.includes(section); return <div className={`section-item ${isVisible ? "enabled" : ""}${draggedSection === section ? " dragging" : ""}`} data-section={section} draggable key={section} onDragStart={() => setDraggedSection(section)} onDragEnd={dropSection} onDragEnter={() => moveDraggedSection(section)} onDragOver={(event) => event.preventDefault()} onDrop={dropSection}><span className="section-drag-handle">⠿</span><strong>{section}</strong><span className="section-order-actions"><button className="section-toggle" aria-label={isVisible ? `隱藏${section}` : `顯示${section}`} title={isVisible ? "隱藏區塊" : "顯示區塊"} onClick={() => toggleSection(section)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.7" />{!isVisible && <path d="M4 4l16 16" />}</svg></button></span></div>; })}</div><div className="editor-experience-source"><div className="editor-source-header"><span>經驗資料庫</span><div className="editor-source-filter" ref={sourceFilterMenu}><button className={sourceFilter !== "全部" ? "active" : ""} onClick={() => setSourceFilterOpen((open) => !open)}>{sourceFilter === "全部" ? "篩選" : sourceFilter}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></button>{sourceFilterOpen && <div>{sourceFilterOptions.map((option) => <button className={sourceFilter === option ? "selected" : ""} key={option} onClick={() => { setSourceFilter(option); setSourceFilterOpen(false); }}><span>{option}</span><b>{sourceFilterCounts[option]}</b></button>)}</div>}</div></div><p>點擊即可加入或移出履歷</p>{filteredExperienceEntries.map(({ item, index }) => <button className={resumeExperienceIndexes.includes(index) ? "included" : ""} data-full-title={item.title} key={item.title} onClick={() => toggleResumeExperience(index)}><span className={`resume-source-type experience-type-${experienceTypeTone[item.type] ?? "other"}`}>{item.type === "工作" ? "正職" : item.type}</span><strong>{item.title}</strong><b>{resumeExperienceIndexes.includes(index) ? "✓" : "＋"}</b></button>)}</div></> : <><div className="editor-panel-title"><span>版面設計</span></div><label className="design-control"><span>模板</span><select value={template} onChange={(event) => setTemplate(event.target.value as Template)}>{(Object.keys(templateInfo) as Template[]).map((key) => <option value={key} key={key}>{templateInfo[key].name}</option>)}</select></label><label className="design-control"><span>主色</span><div className="color-options"><button className="active" /><button /><button /><button /></div></label><label className="design-control"><span>字體大小</span><input type="range" min="9" max="13" defaultValue="10" /></label><label className="design-control"><span>區塊間距</span><input type="range" min="8" max="20" defaultValue="13" /></label></>}
        </aside>

        <main className="resume-canvas" ref={resumeCanvasArea}><div className="resume-page-zoom" ref={resumeZoomArea} style={{ width: A4_WIDTH * resumeZoom / 100, height: resumePageHeight * resumeZoom / 100 }}><div className={`resume-page template-${template}`} ref={resumePaper} style={{ transform: `scale(${resumeZoom / 100})` }} contentEditable suppressContentEditableWarning onInput={() => setSaved(false)}>
          <header className="resume-name-block"><div><h1>宋宇倫</h1><h2>Associate Product Manager</h2></div><p>yulun@example.com　·　09xx-xxx-xxx<br />Taipei, Taiwan　·　linkedin.com/in/yulun</p></header>
          {enabledSections.includes("個人摘要") && <section style={{ order: sectionOrder.indexOf("個人摘要") }}><h3>個人摘要</h3><p>具備使用者研究與產品企劃經驗，擅長從需求探索、洞察整理到產品提案，能透過研究與數據協助團隊找出具體的產品方向。</p></section>}
          {enabledSections.includes("工作與實習") && <section style={{ order: sectionOrder.indexOf("工作與實習") }}><h3>工作與實習經驗</h3>{resumeExperienceIndexes.filter((index) => ["實習", "工作"].includes(experiences[index]?.type)).map((index) => { const item = experiences[index]; return <div className="resume-entry" key={item.title}><header><div><strong>{item.title}</strong><span>{item.org}</span></div><time>{item.date}</time></header><ul><li>{item.description}</li></ul></div>; })}</section>}
          {enabledSections.includes("專案經驗") && <section style={{ order: sectionOrder.indexOf("專案經驗") }}><h3>專案與其他經驗</h3>{resumeExperienceIndexes.filter((index) => !["實習", "工作"].includes(experiences[index]?.type)).map((index) => { const item = experiences[index]; return <div className="resume-entry" key={item.title}><header><div><strong>{item.title}</strong><span>{item.org}</span></div><time>{item.date}</time></header><ul><li>{item.description}</li></ul></div>; })}</section>}
          {enabledSections.includes("教育背景") && <section style={{ order: sectionOrder.indexOf("教育背景") }}><h3>教育背景</h3><div className="resume-entry compact"><header><div><strong>國立大學　資訊管理學系</strong><span>學士</span></div><time>2022 — 2026</time></header></div></section>}
          {enabledSections.includes("技能") && <section style={{ order: sectionOrder.indexOf("技能") }}><h3>技能</h3><p><b>研究與產品：</b>使用者訪談、需求分析、原型測試、產品企劃　　<b>工具：</b>Figma、Excel、GA4</p></section>}
          {enabledSections.includes("競賽與獎項") && <section style={{ order: sectionOrder.indexOf("競賽與獎項") }}><h3>競賽與獎項</h3><p>全國大專創新提案競賽・第二名</p></section>}
          {enabledSections.includes("語言能力") && <section style={{ order: sectionOrder.indexOf("語言能力") }}><h3>語言能力</h3><p>中文・母語　　英文・工作溝通</p></section>}
        </div></div><span className="page-indicator">第 1 頁，共 {pageCount === "1 頁" ? 1 : 2} 頁</span></main>

        <aside className="editor-right"><div className="match-score-card"><div><small>職缺符合度</small><strong>內容方向良好</strong></div></div><section className="editor-suggestions"><div className="editor-panel-title"><span>內容建議</span></div><article className="suggestion-high"><div><small className="suggestion-label"><span aria-hidden="true">↗</span>建議加強</small><strong>補充分析如何影響決策</strong><p>目前提到研究過程，但可以更清楚說明提案被採用後的改變。</p><button>套用建議</button></div></article><article><div><small className="suggestion-label"><span aria-hidden="true">✓</span>關鍵詞</small><strong>「使用者研究」已涵蓋</strong><p>出現在摘要與兩段經驗中，使用自然。</p></div></article><article className="suggestion-reminder"><div><small className="suggestion-label"><span aria-hidden="true">!</span>篇幅提醒</small><strong>目前接近一頁上限</strong><p>新增內容時，建議先縮短競賽描述。</p></div></article></section><section className="keyword-coverage"><div className="editor-panel-title"><span>職缺關鍵詞</span></div><div><span className="covered">需求分析　✓</span><span className="covered">使用者研究　✓</span><span className="covered">Figma　✓</span><span className="partial">數據分析　◐</span><span className="missing">敏捷開發　＋</span></div></section><div className="editor-trust-note"><span>⌁</span><p><b>內容來源可追溯</b>所有履歷敘述均來自已確認的經驗，未加入虛構資訊。</p></div></aside>
      </div>
    </section>
  );
}
