"use client";

import { useEffect, useMemo, useState } from "react";

type MatchStatus = "match" | "transfer" | "partial" | "gap";
type Requirement = { name: string; status: MatchStatus; note: string; source: string; required?: boolean };
type Job = { id: number; title: string; company: string; field: string; location: string; workMode: string; employment: string; salary: string; fit: number; interest: number; posted: string; summary: string; responsibilities: string[]; requirements: Requirement[] };

const jobs: Job[] = [
  { id: 1, title: "Associate Product Manager", company: "Orbit 數位產品", field: "產品管理", location: "台北市", workMode: "混合辦公", employment: "全職", salary: "NT$ 48K–65K", fit: 82, interest: 96, posted: "今天", summary: "協助產品團隊進行需求研究、數據分析與功能規劃，與設計及工程團隊合作推動產品迭代。", responsibilities: ["探索使用者需求並整理產品機會", "協助功能規格與優先順序規劃", "與設計、工程團隊共同推動產品迭代", "追蹤產品指標並提出改善方向"], requirements: [{ name: "使用者研究", status: "match", note: "具備訪談、測試與洞察整理經驗", source: "產品實習、校園活動探索 App", required: true }, { name: "產品需求分析", status: "match", note: "曾將研究洞察轉為產品優化提案", source: "木星數位科技產品實習", required: true }, { name: "數據分析能力", status: "partial", note: "具備研究經驗，商業決策影響仍可補強", source: "AI 學習行為研究、社群成效分析", required: true }, { name: "跨部門協作", status: "transfer", note: "可從競賽與社團協作經驗轉移", source: "商業競賽、設計工作坊", required: true }, { name: "2 年產品經驗", status: "gap", note: "目前以實習與專案經驗為主", source: "尚無直接符合紀錄", required: true }, { name: "Figma", status: "match", note: "三段經驗中曾使用", source: "互動設計與服務設計專案" }] },
  { id: 2, title: "UX Research Assistant", company: "日日生活科技", field: "使用者研究", location: "新北市", workMode: "遠端友善", employment: "約聘", salary: "NT$ 42K–55K", fit: 76, interest: 91, posted: "昨天", summary: "支援研究規劃、使用者招募、訪談執行與資料分析，協助產品團隊理解使用者行為。", responsibilities: ["協助規劃與執行使用者研究", "整理訪談逐字稿與洞察", "製作研究報告並與產品團隊分享"], requirements: [{ name: "質化研究", status: "match", note: "多次規劃並執行使用者訪談", source: "產品實習、課程專案", required: true }, { name: "研究資料整理", status: "match", note: "具備問卷與訪談資料分析經驗", source: "AI 學習行為研究", required: true }, { name: "研究報告撰寫", status: "partial", note: "有提案整理經驗，完整研究報告證據較少", source: "競賽與研究專題", required: true }, { name: "英文訪談", status: "gap", note: "目前沒有語言使用情境證據", source: "尚無直接符合紀錄" }] },
  { id: 3, title: "Product Operations Specialist", company: "島嶼科技", field: "產品管理", location: "台北市", workMode: "混合辦公", employment: "全職", salary: "NT$ 45K–58K", fit: 78, interest: 84, posted: "2 天前", summary: "協助跨部門產品專案推進、流程管理與營運數據追蹤，讓團隊更有效率地交付產品。", responsibilities: ["追蹤產品專案進度與風險", "整理營運數據與使用者回饋", "維護跨部門協作流程"], requirements: [{ name: "專案協作", status: "match", note: "具備多個團隊專案經驗", source: "實習、競賽與課程專案", required: true }, { name: "流程管理", status: "transfer", note: "活動規劃能力可轉移至流程追蹤", source: "設計思考工作坊", required: true }, { name: "數據報表", status: "partial", note: "有分析經驗但缺少固定營運報表案例", source: "社群成效分析", required: true }] },
  { id: 4, title: "Product Data Analyst", company: "森野數據", field: "資料分析", location: "台北市", workMode: "公司辦公", employment: "全職", salary: "NT$ 50K–70K", fit: 69, interest: 76, posted: "3 天前", summary: "分析產品使用行為、建立指標報表，並與產品經理合作提出可驗證的改善假設。", responsibilities: ["定義並追蹤產品核心指標", "分析使用者行為與轉換漏斗", "將分析結果轉為產品建議"], requirements: [{ name: "資料分析", status: "match", note: "具備問卷與社群資料分析經驗", source: "AI 學習行為研究、社群分析", required: true }, { name: "SQL", status: "gap", note: "經驗資料中尚未出現 SQL", source: "尚無直接符合紀錄", required: true }, { name: "產品思維", status: "transfer", note: "可由需求研究與產品提案經驗轉移", source: "產品實習", required: true }] },
  { id: 5, title: "數位行銷企劃", company: "拾光品牌顧問", field: "數位行銷", location: "台北市", workMode: "公司辦公", employment: "全職", salary: "NT$ 40K–52K", fit: 64, interest: 62, posted: "5 天前", summary: "負責社群內容策略、活動企劃與成效追蹤，根據數據提出優化方向。", responsibilities: ["規劃社群內容與行銷活動", "追蹤成效並提出優化建議", "協作完成品牌專案"], requirements: [{ name: "內容策略", status: "match", note: "曾依成效資料調整內容方向", source: "社群內容成效分析", required: true }, { name: "活動企劃", status: "match", note: "具備多場活動規劃與執行經驗", source: "工作坊、社團活動", required: true }, { name: "廣告投放", status: "gap", note: "尚無付費媒體投放紀錄", source: "尚無直接符合紀錄", required: true }] },
  { id: 6, title: "Junior Service Designer", company: "共好設計研究所", field: "服務設計", location: "台中市", workMode: "混合辦公", employment: "全職", salary: "NT$ 43K–56K", fit: 74, interest: 88, posted: "一週內", summary: "參與服務研究、旅程梳理與共創工作坊，將洞察發展為可測試的服務概念。", responsibilities: ["執行利害關係人訪談", "繪製顧客旅程與服務藍圖", "規劃並帶領共創工作坊"], requirements: [{ name: "服務設計", status: "match", note: "有完整課程專案與方法經驗", source: "服務設計課程", required: true }, { name: "工作坊引導", status: "match", note: "曾規劃四場設計思考工作坊", source: "大學創新設計社", required: true }, { name: "顧問專案經驗", status: "gap", note: "尚無正式顧問客戶經驗", source: "尚無直接符合紀錄" }] },
  { id: 7, title: "Junior Product Designer", company: "微光互動", field: "產品設計", location: "台北市", workMode: "遠端友善", employment: "全職", salary: "NT$ 46K–62K", fit: 81, interest: 90, posted: "今天", summary: "參與 Web 與 App 產品設計，從需求探索、流程規劃到互動原型，與產品及工程團隊共同完成迭代。", responsibilities: ["梳理使用者流程與資訊架構", "製作線框稿及高擬真互動原型", "參與使用者測試並依回饋迭代"], requirements: [{ name: "Figma", status: "match", note: "多個專案具備互動原型經驗", source: "校園活動探索 App、服務設計課程", required: true }, { name: "使用者流程", status: "match", note: "曾完成服務流程與互動流程規劃", source: "課程專案", required: true }, { name: "視覺設計", status: "partial", note: "有介面設計成果，但視覺系統證據較少", source: "互動設計課程專案", required: true }, { name: "設計系統", status: "gap", note: "尚未記錄設計系統維護經驗", source: "尚無直接符合紀錄" }] },
  { id: 8, title: "專案管理助理", company: "遠川顧問", field: "專案管理", location: "新竹市", workMode: "混合辦公", employment: "全職", salary: "NT$ 42K–54K", fit: 72, interest: 68, posted: "昨天", summary: "協助數位轉型專案的時程、會議與跨部門溝通，追蹤交付成果並維護專案文件。", responsibilities: ["維護專案時程與行動清單", "彙整會議紀錄與風險事項", "協調客戶及內部團隊的交付內容"], requirements: [{ name: "進度管理", status: "transfer", note: "活動與競賽經驗可轉移至專案追蹤", source: "迎新活動、商業競賽", required: true }, { name: "溝通協調", status: "match", note: "有多人團隊與跨角色合作經驗", source: "實習與社團活動", required: true }, { name: "專案文件", status: "partial", note: "具備簡報與研究整理能力", source: "競賽提案、研究專題" }, { name: "企業客戶經驗", status: "gap", note: "尚無 B2B 客戶協作紀錄", source: "尚無直接符合紀錄" }] },
  { id: 9, title: "學習產品企劃", company: "知行教育科技", field: "教育科技", location: "台北市", workMode: "混合辦公", employment: "全職", salary: "NT$ 45K–60K", fit: 79, interest: 94, posted: "2 天前", summary: "規劃線上學習產品功能與內容，透過學習者研究與數據觀察持續改善學習體驗。", responsibilities: ["訪談學習者並整理核心需求", "規劃學習功能與內容流程", "追蹤使用數據並提出迭代建議"], requirements: [{ name: "學習者研究", status: "match", note: "具備學生訪談與學習行為研究經驗", source: "AI 學習行為研究、產品實習", required: true }, { name: "產品企劃", status: "match", note: "曾將需求洞察轉成產品提案", source: "木星數位科技產品實習", required: true }, { name: "教育領域理解", status: "transfer", note: "校園服務與學習研究可支持領域理解", source: "課程專案、研究專題", required: true }, { name: "內容設計", status: "partial", note: "有提案與活動內容規劃，教學內容證據較少", source: "競賽、社團活動" }] },
  { id: 10, title: "Customer Success Associate", company: "CloudSeed 雲端服務", field: "客戶成功", location: "台北市", workMode: "遠端友善", employment: "全職", salary: "NT$ 44K–58K", fit: 67, interest: 64, posted: "3 天前", summary: "協助企業客戶導入 SaaS 產品、理解使用問題並整理需求，與產品團隊合作提升採用率。", responsibilities: ["引導新客戶完成產品導入", "整理客戶回饋與常見問題", "追蹤使用情況並提出改善建議"], requirements: [{ name: "需求訪談", status: "match", note: "具備結構化訪談與洞察整理經驗", source: "產品實習、課程專案", required: true }, { name: "簡報溝通", status: "match", note: "多次負責提案與成果呈現", source: "商業競賽、成果發表", required: true }, { name: "SaaS 經驗", status: "gap", note: "尚無 SaaS 導入或營運紀錄", source: "尚無直接符合紀錄", required: true }, { name: "客戶關係維護", status: "partial", note: "有活動參與者溝通，但企業客戶情境不足", source: "社團活動" }] },
  { id: 11, title: "Business Analyst Intern", company: "明日策略", field: "商業分析", location: "台北市", workMode: "公司辦公", employment: "實習", salary: "NT$ 220–260／時", fit: 71, interest: 80, posted: "4 天前", summary: "協助產業研究、資料整理與商業簡報，將市場資訊轉化為具體策略假設與建議。", responsibilities: ["蒐集並整理產業與競品資料", "建立分析表格與視覺化摘要", "支援客戶提案與策略簡報"], requirements: [{ name: "市場研究", status: "match", note: "具備競賽市場研究與需求驗證經驗", source: "校園創新商業競賽", required: true }, { name: "Excel", status: "match", note: "曾用於問卷及社群資料整理", source: "研究專題、社群成效分析", required: true }, { name: "商業簡報", status: "match", note: "有競賽提案與成果簡報經驗", source: "商業競賽", required: true }, { name: "財務模型", status: "gap", note: "目前沒有財務建模證據", source: "尚無直接符合紀錄" }] },
  { id: 12, title: "Growth Product Intern", company: "流星電商", field: "產品管理", location: "台北市", workMode: "混合辦公", employment: "實習", salary: "NT$ 200–240／時", fit: 75, interest: 86, posted: "一週內", summary: "協助成長團隊分析轉換流程、規劃實驗並追蹤指標，找出能改善新用戶體驗的產品機會。", responsibilities: ["整理漏斗數據與使用者回饋", "協助規劃成長實驗與驗證指標", "追蹤實驗結果並製作週報"], requirements: [{ name: "數據分析", status: "match", note: "具備問卷與社群成效分析經驗", source: "研究專題、社群內容分析", required: true }, { name: "產品研究", status: "match", note: "有訪談、需求分析及原型測試經驗", source: "產品實習、互動設計專案", required: true }, { name: "A/B Test", status: "gap", note: "尚未記錄正式實驗設計經驗", source: "尚無直接符合紀錄", required: true }, { name: "成長指標", status: "partial", note: "有互動率改善成果，產品漏斗證據較少", source: "社群內容成效分析" }] },
];

type ResumeChoice = { id: string; title: string; company: string; template: string; updated: string; color: string };

const resumeChoices: ResumeChoice[] = [
  { id: "orbit-apm", title: "Associate Product Manager", company: "Orbit 數位產品", template: "ATS 專業版", updated: "今天 14:32", color: "green" },
  { id: "ux-research", title: "UX Research Assistant", company: "日日生活科技", template: "專案導向版", updated: "昨天", color: "purple" },
  { id: "general", title: "通用求職履歷", company: "未指定職缺", template: "ATS 專業版", updated: "8 月 22 日", color: "orange" },
];

const statusCopy: Record<MatchStatus, { label: string; icon: string }> = { match: { label: "明確符合", icon: "✓" }, transfer: { label: "部分符合", icon: "◐" }, partial: { label: "部分符合", icon: "◐" }, gap: { label: "尚未具備", icon: "×" } };
type Props = { onCreateResume: (target: string) => void };

export default function JobAnalysis({ onCreateResume }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>([2]);
  const [query, setQuery] = useState("");
  const [field, setField] = useState("全部領域");
  const [minimumFit, setMinimumFit] = useState("不限匹配度");
  const [sort, setSort] = useState("匹配度最高");
  const [, setDetailTab] = useState<"overview" | "match">("overview");
  const [showRequirementAnalysis, setShowRequirementAnalysis] = useState(false);
  const [applicationJob, setApplicationJob] = useState<Job | null>(null);
  const [applicationResumeId, setApplicationResumeId] = useState("");
  const [applicationQuery, setApplicationQuery] = useState("");
  const [showApplicationConfirmation, setShowApplicationConfirmation] = useState(false);
  const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);
  const filteredJobs = useMemo(() => {
    const result = jobs.filter((job) => {
      const textMatch = (job.title + job.company + job.summary).toLowerCase().includes(query.trim().toLowerCase());
      const fitFloor = minimumFit === "70% 以上" ? 70 : minimumFit === "80% 以上" ? 80 : 0;
      return textMatch && (field === "全部領域" || job.field === field) && job.fit >= fitFloor && (sort !== "我的收藏" || savedIds.includes(job.id));
    });
    return [...result].sort((a, b) => sort === "最新發布" ? a.id - b.id : b.fit - a.fit);
  }, [field, minimumFit, query, savedIds, sort]);
  const current = jobs.find((job) => job.id === selectedId);
  const filteredResumeChoices = resumeChoices.filter((resume) => `${resume.title} ${resume.company} ${resume.template}`.toLowerCase().includes(applicationQuery.trim().toLowerCase()));
  const applicationResume = resumeChoices.find((resume) => resume.id === applicationResumeId);
  function toggleSaved(id: number) { setSavedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]); }
  function openApplication(job: Job) {
    setApplicationJob(job);
    setApplicationResumeId("");
    setApplicationQuery("");
    setShowApplicationConfirmation(false);
    setShowApplicationSuccess(false);
  }
  function closeApplication() {
    setApplicationJob(null);
    setApplicationResumeId("");
    setApplicationQuery("");
    setShowApplicationConfirmation(false);
    setShowApplicationSuccess(false);
  }
  useEffect(() => {
    if (!showRequirementAnalysis && !applicationJob) return;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
    };
  }, [showRequirementAnalysis, applicationJob]);

  function renderApplicationDialog() {
    if (!applicationJob) return null;
    return <div className="resume-application-overlay">
      <section className={`resume-application-modal${showApplicationConfirmation || showApplicationSuccess ? " confirmation" : ""}`} role="dialog" aria-modal="true" aria-labelledby="resume-application-title">
        <header><div><h2 id="resume-application-title">{showApplicationSuccess ? "已投遞履歷" : showApplicationConfirmation ? "確認投遞" : "我的履歷"}</h2>{!showApplicationConfirmation && !showApplicationSuccess && <p>{applicationJob.company} · {applicationJob.title}</p>}</div><button aria-label="關閉投遞視窗" onClick={closeApplication}>×</button></header>
        {showApplicationSuccess && applicationResume ? <>
          <main className="resume-application-confirmation" role="status"><span aria-hidden="true">✓</span><p>已成功投遞<strong>【{applicationResume.title}】</strong>至<strong>【{applicationJob.company}、{applicationJob.title}】</strong>。</p></main>
          <footer><button className="primary" onClick={closeApplication}>完成</button></footer>
        </> : showApplicationConfirmation && applicationResume ? <>
          <main className="resume-application-confirmation"><span aria-hidden="true">✓</span><p>確定要投遞<strong>【{applicationResume.title}】</strong>至<strong>【{applicationJob.company}、{applicationJob.title}】</strong>？</p></main>
          <footer><button onClick={() => setShowApplicationConfirmation(false)}>取消</button><button className="primary" onClick={() => setShowApplicationSuccess(true)}>確認</button></footer>
        </> : <>
          <main className="resume-application-picker"><label className="resume-application-search" aria-label="搜尋履歷"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg><input value={applicationQuery} onChange={(event) => setApplicationQuery(event.target.value)} placeholder="搜尋履歷標題或內容關鍵字" /></label><div className="resume-application-list">{filteredResumeChoices.length ? filteredResumeChoices.map((resume) => <button type="button" className={applicationResumeId === resume.id ? "selected" : ""} aria-pressed={applicationResumeId === resume.id} key={resume.id} onClick={() => setApplicationResumeId(resume.id)}><span className={`resume-application-thumbnail ${resume.color}`}><i /><i /><i /></span><span><strong>{resume.title}</strong><small>{resume.company}</small><small>{resume.template} · 更新於 {resume.updated}</small></span><b>{applicationResumeId === resume.id ? "✓" : "○"}</b></button>) : <p className="resume-application-empty">找不到符合關鍵字的履歷。</p>}</div></main>
          <footer><button onClick={closeApplication}>取消</button><button className="primary" disabled={!applicationResumeId} onClick={() => setShowApplicationConfirmation(true)}>投遞</button></footer>
        </>}
      </section>
    </div>;
  }

  if (current) {
    return <section className="job-explorer-page page-enter">
      <div className="job-detail-nav"><button className="job-back-button" onClick={() => setSelectedId(null)}>← 返回職缺探索</button><button className={`job-detail-save-button${savedIds.includes(current.id) ? " saved" : ""}`} aria-label={savedIds.includes(current.id) ? "取消收藏職缺" : "收藏職缺"} onClick={() => toggleSaved(current.id)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S4 16 2.5 10.8C1.4 7 3.8 4 7.1 4c2.1 0 3.9 1.2 4.9 2.9C13 5.2 14.8 4 16.9 4c3.3 0 5.7 3 4.6 6.8C20 16 12 20.5 12 20.5Z" /></svg><span>{savedIds.includes(current.id) ? "已收藏" : "收藏職缺"}</span></button></div>
      <article className="explore-job-detail">
        <header className="explore-detail-heading"><span className="company-logo">{current.company.slice(0, 1)}</span><div><small>{current.company}</small><h1>{current.title}</h1><p>{current.location} · {current.workMode} · {current.employment} · {current.salary}</p></div><div className="detail-heading-actions"><div className="detail-primary-actions"><button className="primary-flow-button" onClick={() => onCreateResume(current.title + " · " + current.company)}>建立履歷</button><button type="button" onClick={() => openApplication(current)}>投遞履歷</button></div></div></header>
        <div className="explore-unified-detail">
          <main className="job-description-column">
            <section><h2>職缺介紹</h2><p>{current.summary}</p></section>
            <section><h2>工作內容</h2><ul>{current.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section className="company-requirements-section"><div className="company-requirements-heading"><h2>應具備條件</h2><div><span>匹配度 <strong>{current.fit}%</strong></span><button aria-expanded={showRequirementAnalysis} onClick={() => setShowRequirementAnalysis(true)}>查看分析</button></div></div><ul>{current.requirements.map((item) => <li className={item.required ? "required" : ""} key={item.name}>{item.name} {item.required ? "（必要條件）" : "（加分條件）"}</li>)}</ul></section>
          </main>
        </div>
      </article>
      {showRequirementAnalysis && <div className="job-analysis-overlay"><button className="modal-backdrop-dismiss" aria-label="關閉條件分析" onClick={() => setShowRequirementAnalysis(false)} /><aside className="job-analysis-drawer" role="dialog" aria-modal="true" aria-labelledby="job-analysis-title"><header><div><h2 id="job-analysis-title">條件分析</h2><p>{current.title} · {current.company}</p></div><button aria-label="關閉條件分析" onClick={() => setShowRequirementAnalysis(false)}>×</button></header><div className="job-analysis-drawer-content"><div className="drawer-match-summary"><span>匹配度<strong>{current.fit}%</strong></span><small>{current.fit >= 80 ? "高度符合" : current.fit >= 70 ? "多數符合" : "部分符合"}</small></div><section className="job-match-breakdown"><div className="requirement-list drawer-requirement-list">{current.requirements.map((item) => <article key={item.name}><div className="requirement-copy"><span>{item.required && <em>必要</em>}<strong>{item.name}</strong></span><p><span>經驗分析：</span>{item.note}</p><p className="requirement-source"><span>具體經驗：</span>{item.source}</p></div><div className={`requirement-result ${item.status}`}><span>{statusCopy[item.status].icon}</span><b>{statusCopy[item.status].label}</b></div></article>)}</div></section></div><footer className="job-analysis-drawer-footer"><button className="primary" onClick={() => { setShowRequirementAnalysis(false); onCreateResume(current.title + " · " + current.company); }}>建立履歷</button><button type="button" onClick={() => { setShowRequirementAnalysis(false); openApplication(current); }}>投遞履歷</button></footer></aside></div>}
      {renderApplicationDialog()}
    </section>;
  }

  return <section className="job-explorer-page page-enter">
    <header className="page-title-row">
      <div><span className="page-kicker">JOB DISCOVERY</span><h1>職缺探索</h1><p>找到最適合你的職缺。</p></div>
    </header>
    <div className="job-results-heading">
      <div><strong><b>{filteredJobs.length}</b> 個職缺</strong></div>
      <div className="job-results-actions">
        <div className="job-header-controls">
          <label className="library-search library-header-search job-header-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋職缺、公司或關鍵字" /></label>
          <select className="job-header-field job-field-filter" value={field} onChange={(event) => setField(event.target.value)} aria-label="領域篩選"><option value="全部領域">全部領域</option>{[...new Set(jobs.map((job) => job.field))].map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <label><select aria-label="排序方式" value={sort} onChange={(event) => setSort(event.target.value)}><option>匹配度最高</option><option>最新發布</option><option>我的收藏</option></select></label>
      </div>
    </div>
    {filteredJobs.length
      ? <div className="job-discovery-grid">{filteredJobs.map((job) => <article className="job-discovery-card" key={job.id}>
          <button className="job-card-open" aria-label={`查看 ${job.company} ${job.title}`} onClick={() => { setSelectedId(job.id); setDetailTab("overview"); }} />
          <header><span className="company-avatar">{job.company.slice(0, 1)}</span><div><small>{job.company}</small><h2>{job.title}</h2></div><button className={savedIds.includes(job.id) ? "saved" : ""} aria-label={savedIds.includes(job.id) ? "取消收藏" : "收藏職缺"} onClick={() => toggleSaved(job.id)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S4 16 2.5 10.8C1.4 7 3.8 4 7.1 4c2.1 0 3.9 1.2 4.9 2.9C13 5.2 14.8 4 16.9 4c3.3 0 5.7 3 4.6 6.8C20 16 12 20.5 12 20.5Z" /></svg></button></header>
          <div className="job-card-meta"><span>{job.location}</span><span>{job.workMode}</span><span>{job.employment}</span></div>
          <p>{job.summary}</p>
          <footer><div><strong>{job.fit}<span>%</span></strong><em>匹配度</em></div><div className="job-card-actions"><button onClick={() => onCreateResume(job.title + " · " + job.company)}>建立履歷</button><button type="button" onClick={() => openApplication(job)}>投遞履歷</button></div></footer>
        </article>)}</div>
      : <div className="job-empty-state"><span>⌕</span><h2>找不到符合條件的職缺</h2><p>試著調整搜尋條件或領域篩選。</p><button onClick={() => { setQuery(""); setField("全部領域"); setMinimumFit("不限匹配度"); setSort("匹配度最高"); }}>清除所有篩選</button></div>}
    {renderApplicationDialog()}
  </section>;
}
