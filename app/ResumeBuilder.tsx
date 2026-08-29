"use client";

import { useState } from "react";
import type { NewExperience } from "./ExperienceFlow";

type Props = { experiences: NewExperience[]; initialTarget?: string };
type Template = "ats" | "project" | "impact";
type TargetMode = "recommended" | "specific" | "general";

const templateInfo = {
  ats: { name: "ATS 專業版", note: "單欄、清楚、適合大多數企業系統" },
  project: { name: "專案導向版", note: "突出專案、競賽與實作成果" },
  impact: { name: "成果導向版", note: "強調數據、責任與工作影響" },
};

const sections = ["個人摘要", "工作與實習", "專案經驗", "教育背景", "技能", "競賽與獎項", "語言能力"];

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

export default function ResumeBuilder({ experiences, initialTarget }: Props) {
  const [mode, setMode] = useState<"library" | "wizard" | "editor">(initialTarget ? "wizard" : "library");
  const [wizardStep, setWizardStep] = useState(initialTarget ? 2 : 1);
  const [template, setTemplate] = useState<Template>("ats");
  const [language, setLanguage] = useState("繁體中文");
  const [pageCount, setPageCount] = useState("1 頁");
  const [targetJob, setTargetJob] = useState(initialTarget || "Associate Product Manager · Orbit 數位產品");
  const [selectedExperiences, setSelectedExperiences] = useState([0, 1, 2, 4]);
  const [enabledSections, setEnabledSections] = useState(sections);
  const [sectionOrder, setSectionOrder] = useState(sections);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [resumeExperienceIndexes, setResumeExperienceIndexes] = useState([0, 1, 2]);
  const [activePanel, setActivePanel] = useState<"content" | "design">("content");
  const [exported, setExported] = useState(false);
  const [saved, setSaved] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetMode, setTargetMode] = useState<TargetMode>(initialTarget ? "specific" : "recommended");
  const [selectedField, setSelectedField] = useState("");
  const [fieldQuery, setFieldQuery] = useState("");
  const [jobQuery, setJobQuery] = useState("");
  const [fieldOpen, setFieldOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);

  const fieldOptions = Object.keys(jobCatalog).filter((field) => field.includes(fieldQuery.trim()));
  const jobOptions = (jobCatalog[selectedField] || []).filter((job) =>
    (job.title + " " + job.company).toLowerCase().includes(jobQuery.trim().toLowerCase())
  );

  function toggleExperience(index: number) {
    setSelectedExperiences((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  function toggleSection(section: string) {
    setEnabledSections((current) => current.includes(section) ? current.filter((item) => item !== section) : [...current, section]);
    setSaved(false);
  }

  function moveSection(section: string, direction: -1 | 1) {
    setSectionOrder((current) => {
      const index = current.indexOf(section);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
      return reordered;
    });
    setSaved(false);
  }

  function dropSection(target: string) {
    if (!draggedSection || draggedSection === target) return;
    setSectionOrder((current) => {
      const reordered = current.filter((section) => section !== draggedSection);
      reordered.splice(reordered.indexOf(target), 0, draggedSection);
      return reordered;
    });
    setDraggedSection(null);
    setSaved(false);
  }

  function toggleResumeExperience(index: number) {
    setResumeExperienceIndexes((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    const targetSection = ["實習", "工作"].includes(experiences[index]?.type) ? "工作與實習" : "專案經驗";
    setEnabledSections((current) => current.includes(targetSection) ? current : [...current, targetSection]);
    setSaved(false);
  }

  function generateResume() {
    setGenerating(true);
    window.setTimeout(() => { setGenerating(false); setMode("editor"); setSaved(true); }, 1150);
  }

  function mockExport() {
    setExported(true);
    window.setTimeout(() => setExported(false), 2200);
  }

  if (mode === "library") return (
    <section className="resume-library page-enter">
      <header className="page-title-row"><div><span className="page-kicker">RESUME STUDIO</span><h1>我的履歷</h1><p>一份職涯資料，為不同機會快速準備不同版本。</p></div><button className="add-button" onClick={() => { setMode("wizard"); setWizardStep(1); }}>＋ 建立新履歷</button></header>
      <article className="resume-library-hero"><div><span className="soft-label">目前推薦</span><h2>為 Orbit APM 職缺完成最後調整</h2><p>你的內容已符合 12 個核心關鍵詞；還有 2 項建議可以提升說服力。</p><button onClick={() => setMode("editor")}>繼續編輯　→</button></div><div className="resume-mini-paper"><span>宋宇倫</span><i /><i /><i /><b /><b /><b /></div></article>
      <div className="resume-list-heading"><div><h3>所有履歷</h3><span>3 個版本</span></div><select><option>最近更新</option><option>建立時間</option></select></div>
      <div className="resume-file-grid">
        {[{ title: "Associate Product Manager", company: "Orbit 數位產品", template: "ATS 專業版", score: 82, date: "今天 14:32", color: "green" }, { title: "UX Research Assistant", company: "日日生活科技", template: "專案導向版", score: 76, date: "昨天", color: "purple" }, { title: "通用求職履歷", company: "未指定職缺", template: "ATS 專業版", score: null, date: "8 月 22 日", color: "orange" }].map((resume, index) => <button className="resume-file" key={resume.title} onClick={() => { setTemplate(index === 1 ? "project" : "ats"); setMode("editor"); }}><div className={`resume-thumbnail ${resume.color}`}><div><strong>宋宇倫</strong><span /><span /><b /><b /><b /><i /></div></div><div className="resume-file-info"><span>{resume.company}</span><h3>{resume.title}</h3><p>{resume.template} · 1 頁</p><div><small>更新於 {resume.date}</small>{resume.score && <b>{resume.score}% 符合</b>}</div></div></button>)}
        <button className="new-resume-file" onClick={() => setMode("wizard")}><span>＋</span><strong>建立新履歷</strong><small>選擇職缺或從空白開始</small></button>
      </div>
    </section>
  );

  if (mode === "wizard") return (
    <section className="resume-wizard page-enter">
      <header className="resume-wizard-header"><button onClick={() => setMode("library")}>← 返回履歷</button><div>{[1,2,3,4].map((item) => <span className={wizardStep >= item ? "active" : ""} key={item}><b>{wizardStep > item ? "✓" : item}</b>{["目標", "格式", "模板", "內容"][item - 1]}</span>)}</div><small>建立新履歷</small></header>
      {generating ? <div className="resume-generating"><div className="paper-stack"><span /><span /><span>✦</span></div><span className="flow-kicker">BUILDING YOUR RESUME</span><h2>正在挑選最適合的經驗</h2><p>根據職缺條件調整順序、重點與篇幅⋯</p><small>Prototype 模擬，不會呼叫任何 API</small></div> : <div className="resume-wizard-content">
        {wizardStep === 1 && <>
          <div className="wizard-title"><span className="flow-kicker">STEP 01 · TARGET</span><h2>這份履歷要用在哪裡？</h2><p>選擇目標後，我們會建議最相關的經驗與關鍵詞。</p></div>
          <div className="resume-target-options">
            <section className="recommended-target">
              <button className={targetMode === "recommended" ? "selected" : ""} onClick={() => { setTargetMode("recommended"); setTargetJob("Associate Product Manager · Orbit 數位產品"); setSelectedField(""); setFieldQuery(""); setJobQuery(""); setFieldOpen(false); setJobOpen(false); }}>
                <span className="company-logo">O</span><div><small>推薦職缺</small><strong>Associate Product Manager</strong><p>Orbit 數位產品 · 82% 符合</p></div><b>{targetMode === "recommended" ? "✓" : "○"}</b>
              </button>
            </section>
            <div className="target-path-grid">
              <section className={"job-combobox-path " + (targetMode === "specific" ? "selected" : "")}>
                <button className="specific-target-selector" onClick={() => { setTargetMode("specific"); setTargetJob(""); }}><span>⌕</span><div><strong>選擇特定職缺</strong><small>先選領域，再選擇該領域的職缺</small></div><b>{targetMode === "specific" ? "✓" : "○"}</b></button>
                <div className="job-combobox-fields">
                  <label><span>1. 領域</span><div className="target-combobox">
                    <input role="combobox" aria-autocomplete="list" aria-expanded={fieldOpen} aria-controls="field-options" value={fieldQuery} placeholder="搜尋或選擇領域" onFocus={() => { setTargetMode("specific"); setTargetJob(""); setFieldOpen(true); }} onChange={(event) => { setTargetMode("specific"); setFieldQuery(event.target.value); setSelectedField(""); setJobQuery(""); setTargetJob(""); setFieldOpen(true); setJobOpen(false); }} />
                    {fieldOpen && <div className="combobox-menu" id="field-options" role="listbox">{fieldOptions.length ? fieldOptions.map((field) => <button role="option" aria-selected={selectedField === field} key={field} onClick={() => { setSelectedField(field); setFieldQuery(field); setJobQuery(""); setTargetJob(""); setFieldOpen(false); }}>{field}</button>) : <p>找不到這個領域</p>}</div>}
                  </div></label>
                  <label><span>2. 職缺</span><div className="target-combobox">
                    <input role="combobox" aria-autocomplete="list" aria-expanded={jobOpen} aria-controls="job-options" value={jobQuery} disabled={!selectedField} placeholder={selectedField ? "搜尋或選擇職缺" : "請先選擇領域"} onFocus={() => setJobOpen(true)} onChange={(event) => { setJobQuery(event.target.value); setTargetJob(""); setJobOpen(true); }} />
                    {jobOpen && selectedField && <div className="combobox-menu job-options" id="job-options" role="listbox">{jobOptions.length ? jobOptions.map((job) => <button role="option" aria-selected={targetJob === job.title + " · " + job.company} key={job.title} onClick={() => { setJobQuery(job.title); setTargetJob(job.title + " · " + job.company); setJobOpen(false); }}><span><strong>{job.title}</strong><small>{job.company}</small></span><b>{job.fit}%</b></button>) : <p>找不到符合的職缺，請改用通用履歷。</p>}</div>}
                  </div></label>
                </div>
              </section>

              <button className={"general-resume-choice " + (targetMode === "general" ? "selected" : "")} onClick={() => { setTargetMode("general"); setTargetJob("通用履歷"); setSelectedField(""); setFieldQuery(""); setJobQuery(""); setFieldOpen(false); setJobOpen(false); }}>
                <span className="blank-target">◇</span><div><small>不指定職缺</small><strong>建立通用履歷</strong><p>作為基礎版本或交流使用</p></div><b>{targetMode === "general" ? "✓" : "○"}</b>
              </button>
            </div>
          </div>
        </>}
        {wizardStep === 2 && <><div className="wizard-title"><span className="flow-kicker">STEP 02 · FORMAT</span><h2>選擇語言與篇幅</h2><p>之後仍可修改，GoodJob 會依篇幅調整內容密度。</p></div><div className="format-grid"><article><span>履歷語言</span><div>{["繁體中文", "English"].map((item) => <button className={language === item ? "selected" : ""} key={item} onClick={() => setLanguage(item)}><b>{item === "繁體中文" ? "中" : "EN"}</b><strong>{item}</strong><small>{language === item ? "✓ 已選擇" : "選擇"}</small></button>)}</div></article><article><span>履歷篇幅</span><div>{["1 頁", "2 頁"].map((item) => <button className={pageCount === item ? "selected" : ""} key={item} onClick={() => setPageCount(item)}><b className="page-icon">▤</b><strong>{item}</strong><small>{item === "1 頁" ? "精簡、適合新鮮人" : "保留更多經驗細節"}</small></button>)}</div></article></div></>}
        {wizardStep === 3 && <><div className="wizard-title"><span className="flow-kicker">STEP 03 · TEMPLATE</span><h2>選擇履歷模板</h2><p>三種模板都以清楚閱讀與內容可信為優先。</p></div><div className="template-choice-grid">{(Object.keys(templateInfo) as Template[]).map((key) => <button className={template === key ? "selected" : ""} key={key} onClick={() => setTemplate(key)}><div className={`template-paper ${key}`}><header><b /><span /></header><i /><i /><section><span /><span /><span /></section><i /><i /></div><div><strong>{templateInfo[key].name}</strong><small>{templateInfo[key].note}</small></div><span>{template === key ? "✓" : "○"}</span></button>)}</div></>}
        {wizardStep === 4 && <><div className="wizard-title"><span className="flow-kicker">STEP 04 · CONTENT</span><h2>確認要放進履歷的經驗</h2><p>已依照目標職缺排序，你可以自由加入或移除。</p></div><div className="experience-picker">{experiences.slice(0, 6).map((item, index) => <button className={selectedExperiences.includes(index) ? "selected" : ""} key={item.title} onClick={() => toggleExperience(index)}><span>{selectedExperiences.includes(index) ? "✓" : "+"}</span><div><small>{item.type} · {item.org}</small><strong>{item.title}</strong><p>{item.description}</p><span>{item.tags.map((tag) => <i key={tag}>{tag}</i>)}</span></div><b>{index < 3 ? "高度相關" : "可選"}</b></button>)}</div></>}
        <footer className="wizard-footer"><button onClick={() => wizardStep === 1 ? setMode("library") : setWizardStep(wizardStep - 1)}>{wizardStep === 1 ? "取消" : "← 上一步"}</button><div><small>{wizardStep} / 4</small><i><b style={{ width: `${wizardStep * 25}%` }} /></i></div>{wizardStep < 4 ? <button className="primary-flow-button" disabled={wizardStep === 1 && !targetJob} onClick={() => setWizardStep(wizardStep + 1)}>下一步　→</button> : <button className="primary-flow-button" onClick={generateResume}>產生履歷　✦</button>}</footer>
      </div>}
    </section>
  );

  return (
    <section className="resume-editor-page page-enter">
      <header className="editor-header"><button onClick={() => setMode("library")}>← 我的履歷</button><div><input defaultValue="Associate Product Manager｜Orbit" onChange={() => setSaved(false)} /><span>{saved ? "✓ 已儲存" : "尚未儲存"}</span></div><div><button onClick={() => { setSaved(true); }}>儲存版本</button><button className="export-button" onClick={mockExport}>{exported ? "✓ 模擬匯出完成" : "匯出 PDF　↧"}</button></div></header>
      <div className="editor-toolbar"><div><button className={activePanel === "content" ? "active" : ""} onClick={() => setActivePanel("content")}>內容</button><button className={activePanel === "design" ? "active" : ""} onClick={() => setActivePanel("design")}>設計</button></div><span>目標：<b>{targetJob}</b></span><div><button>−</button><span>85%</span><button>＋</button></div></div>
      <div className="resume-editor-layout">
        <aside className="editor-left">
          {activePanel === "content" ? <><div className="editor-panel-title"><span>履歷區塊</span><small>拖曳或使用箭頭排序</small></div><div className="section-list">{sectionOrder.map((section, index) => <div className={"section-item " + (enabledSections.includes(section) ? "enabled" : "")} draggable key={section} onDragStart={() => setDraggedSection(section)} onDragEnd={() => setDraggedSection(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropSection(section)}><span className="section-drag-handle">⠿</span><strong>{section}</strong><span className="section-order-actions"><button disabled={index === 0} title="向上移動" onClick={() => moveSection(section, -1)}>↑</button><button disabled={index === sectionOrder.length - 1} title="向下移動" onClick={() => moveSection(section, 1)}>↓</button><button className="section-toggle" title={enabledSections.includes(section) ? "隱藏區塊" : "顯示區塊"} onClick={() => toggleSection(section)}>{enabledSections.includes(section) ? "●" : "○"}</button></span></div>)}</div><div className="editor-experience-source"><span>經驗資料庫</span><p>點擊即可加入或移出履歷</p>{experiences.map((item, index) => <button className={resumeExperienceIndexes.includes(index) ? "included" : ""} key={item.title} onClick={() => toggleResumeExperience(index)}><span>{item.type}</span><strong>{item.title}</strong><b>{resumeExperienceIndexes.includes(index) ? "✓" : "＋"}</b></button>)}</div></> : <><div className="editor-panel-title"><span>版面設計</span></div><label className="design-control"><span>模板</span><select value={template} onChange={(event) => setTemplate(event.target.value as Template)}>{(Object.keys(templateInfo) as Template[]).map((key) => <option value={key} key={key}>{templateInfo[key].name}</option>)}</select></label><label className="design-control"><span>主色</span><div className="color-options"><button className="active" /><button /><button /><button /></div></label><label className="design-control"><span>字體大小</span><input type="range" min="9" max="13" defaultValue="10" /></label><label className="design-control"><span>區塊間距</span><input type="range" min="8" max="20" defaultValue="13" /></label></>}
        </aside>

        <main className="resume-canvas"><div className={`resume-page template-${template}`} contentEditable suppressContentEditableWarning onInput={() => setSaved(false)}>
          <header className="resume-name-block"><div><h1>宋宇倫</h1><h2>Associate Product Manager</h2></div><p>yulun@example.com　·　09xx-xxx-xxx<br />Taipei, Taiwan　·　linkedin.com/in/yulun</p></header>
          {enabledSections.includes("個人摘要") && <section style={{ order: sectionOrder.indexOf("個人摘要") }}><h3>個人摘要</h3><p>具備使用者研究與產品企劃經驗，擅長從需求探索、洞察整理到產品提案，能透過研究與數據協助團隊找出具體的產品方向。</p></section>}
          {enabledSections.includes("工作與實習") && <section style={{ order: sectionOrder.indexOf("工作與實習") }}><h3>工作與實習經驗</h3>{resumeExperienceIndexes.filter((index) => ["實習", "工作"].includes(experiences[index]?.type)).map((index) => { const item = experiences[index]; return <div className="resume-entry" key={item.title}><header><div><strong>{item.title}</strong><span>{item.org}</span></div><time>{item.date}</time></header><ul><li>{item.description}</li></ul></div>; })}</section>}
          {enabledSections.includes("專案經驗") && <section style={{ order: sectionOrder.indexOf("專案經驗") }}><h3>專案與其他經驗</h3>{resumeExperienceIndexes.filter((index) => !["實習", "工作"].includes(experiences[index]?.type)).map((index) => { const item = experiences[index]; return <div className="resume-entry" key={item.title}><header><div><strong>{item.title}</strong><span>{item.org}</span></div><time>{item.date}</time></header><ul><li>{item.description}</li></ul></div>; })}</section>}
          {enabledSections.includes("教育背景") && <section style={{ order: sectionOrder.indexOf("教育背景") }}><h3>教育背景</h3><div className="resume-entry compact"><header><div><strong>國立大學　資訊管理學系</strong><span>學士</span></div><time>2022 — 2026</time></header></div></section>}
          {enabledSections.includes("技能") && <section style={{ order: sectionOrder.indexOf("技能") }}><h3>技能</h3><p><b>研究與產品：</b>使用者訪談、需求分析、原型測試、產品企劃　　<b>工具：</b>Figma、Excel、GA4</p></section>}
          {enabledSections.includes("競賽與獎項") && <section style={{ order: sectionOrder.indexOf("競賽與獎項") }}><h3>競賽與獎項</h3><p>全國大專創新提案競賽・第二名</p></section>}
          {enabledSections.includes("語言能力") && <section style={{ order: sectionOrder.indexOf("語言能力") }}><h3>語言能力</h3><p>中文・母語　　英文・工作溝通</p></section>}
        </div><span className="page-indicator">第 1 頁，共 {pageCount === "1 頁" ? 1 : 2} 頁</span></main>

        <aside className="editor-right"><div className="match-score-card"><div className="small-fit-ring"><span>82</span></div><div><small>職缺符合度</small><strong>內容方向良好</strong><p>12 / 15 個重要條件已有對應</p></div></div><section className="editor-suggestions"><div className="editor-panel-title"><span>內容建議</span><small>3 項</small></div><article className="suggestion-high"><span>↗</span><div><small>建議加強</small><strong>補充分析如何影響決策</strong><p>目前提到研究過程，但可以更清楚說明提案被採用後的改變。</p><button>套用建議</button></div></article><article><span>✓</span><div><small>關鍵詞</small><strong>「使用者研究」已涵蓋</strong><p>出現在摘要與兩段經驗中，使用自然。</p></div></article><article><span>!</span><div><small>篇幅提醒</small><strong>目前接近一頁上限</strong><p>新增內容時，建議先縮短競賽描述。</p></div></article></section><section className="keyword-coverage"><div className="editor-panel-title"><span>職缺關鍵詞</span><small>12 / 15</small></div><div><span className="covered">需求分析　✓</span><span className="covered">使用者研究　✓</span><span className="covered">Figma　✓</span><span className="partial">數據分析　◐</span><span className="missing">敏捷開發　＋</span></div></section><div className="editor-trust-note"><span>⌁</span><p><b>內容來源可追溯</b>所有履歷敘述均來自已確認的經驗，未加入虛構資訊。</p></div></aside>
      </div>
    </section>
  );
}
