"use client";

import { useEffect, useRef, useState } from "react";
import type { EvidenceItem } from "./ExperienceEvidence";
import {
  analyzeExperienceStory,
  buildStructuredSummary,
  incompleteStoryExample,
  type ExperienceSchemaKey,
  type ExperienceSchemaResult,
} from "./experienceSchema";

export type NewExperience = {
  type: string;
  date: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
  color: string;
  evidence?: EvidenceItem[];
  completeness?: number;
  schema?: Partial<Record<ExperienceSchemaKey, string>>;
  missingSchemaFields?: ExperienceSchemaKey[];
};

type PendingAttachment = { id: number; fileName: string; type: string; name: string };

type Props = {
  onClose: () => void;
  onComplete: (experience: NewExperience) => void;
};

const resultSkillGroups = {
  "核心能力": ["使用者研究", "流程優化", "原型測試", "團隊協作"],
  "工具技能": ["Figma"],
  "領域知識": ["校園服務"],
} as const;

type SkillGroup = keyof typeof resultSkillGroups;
type AddedSkill = { name: string; group: SkillGroup; status: "certified" | "questionable" };

export default function ExperienceFlow({ onClose, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [analysisTarget, setAnalysisTarget] = useState<2 | 4 | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [type, setType] = useState("專案");
  const [startDate, setStartDate] = useState("2026-02");
  const [endDate, setEndDate] = useState("2026-06");
  const [competitionStartDate, setCompetitionStartDate] = useState("2026-02-01");
  const [competitionEndDate, setCompetitionEndDate] = useState("2026-06-30");
  const [story, setStory] = useState(incompleteStoryExample);
  const [summary, setSummary] = useState("主導校園二手書交換流程的使用者研究與原型設計，透過 8 位使用者測試，將核心交換流程由 7 步精簡至 4 步。");
  const [resumeOutputs, setResumeOutputs] = useState<Record<string, string>>({
    "精簡版": "重新設計校園二手書交換流程，透過使用者測試將完成步驟由 7 步縮短至 4 步。",
    "標準版": "主導校園二手書交換流程的使用者研究與互動原型設計，訪談並測試 8 位使用者，將核心交換流程由 7 步精簡至 4 步。",
    "STAR 面試版": "背景：學生反映校內二手書交換流程繁複。\n行動：我規劃訪談、整理痛點並以 Figma 製作原型，邀請 8 位使用者測試。\n成果：團隊將主要流程從 7 步精簡至 4 步，降低完成交換的操作負擔。",
  });
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [courseName, setCourseName] = useState("服務設計");
  const [courseOrg, setCourseOrg] = useState("國立大學");
  const [courseTerm, setCourseTerm] = useState("2026 春季");
  const [companyName, setCompanyName] = useState("");
  const [positionName, setPositionName] = useState("");
  const [competitionOrg, setCompetitionOrg] = useState("");
  const [competitionName, setCompetitionName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubPosition, setClubPosition] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [schemaAnalysis, setSchemaAnalysis] = useState<ExperienceSchemaResult[]>([]);
  const [schemaAnswers, setSchemaAnswers] = useState<Partial<Record<ExperienceSchemaKey, string>>>({});
  const [addedSkills, setAddedSkills] = useState<AddedSkill[]>([]);
  const [skillModalStep, setSkillModalStep] = useState<"closed" | "category" | "input" | "analyzing">("closed");
  const [newSkillGroup, setNewSkillGroup] = useState<SkillGroup | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [skillNotice, setSkillNotice] = useState("");
  const attachmentInput = useRef<HTMLInputElement>(null);
  const flowShell = useRef<HTMLDivElement>(null);

  function closeFlow() {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onClose, 250);
  }

  useEffect(() => {
    if (analysisTarget === null) return;
    const timer = window.setTimeout(() => {
      setStep(analysisTarget);
      setAnalysisTarget(null);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [analysisTarget]);

  useEffect(() => {
    const scrollArea = flowShell.current?.querySelector<HTMLElement>(".flow-content, .processing-step");
    if (scrollArea) scrollArea.scrollTop = 0;
  }, [analysisTarget, step]);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  function saveExperience() {
    const savedSchema = Object.fromEntries(schemaAnalysis.map((field) => [field.key, schemaValue(schemaAnalysis, schemaAnswers, field.key)])) as Partial<Record<ExperienceSchemaKey, string>>;
    const isEmployment = type === "實習" || type === "工作";
    const isCompetition = type === "競賽";
    const isClub = type === "社團";
    const savedStartDate = isCompetition ? competitionStartDate : startDate;
    const savedEndDate = isCompetition ? competitionEndDate : endDate;
    onComplete({
      type,
      date: type === "修課" ? courseTerm : `${savedStartDate.replaceAll("-", ".")} — ${savedEndDate.replaceAll("-", ".")}`,
      title: type === "修課" ? courseName : isEmployment ? positionName : isCompetition ? competitionName : type === "專案" ? projectTitle : isClub ? clubPosition : type === "研究" ? researchTitle : "校園二手書交換服務設計",
      org: type === "修課" ? courseOrg + " · " + courseTerm : isEmployment ? companyName : isCompetition ? competitionOrg : isClub ? clubName : type === "研究" ? "研究經驗" : "服務設計課程專案",
      description: resumeOutputs["標準版"] || summary,
      tags: [...new Set(["使用者研究", "Figma", "流程優化", ...addedSkills.map((skill) => skill.name)])],
      color: "#3b78a0",
      completeness: schemaCompleteness,
      schema: savedSchema,
      missingSchemaFields: unresolvedSchemaFields.map((field) => field.key),
      evidence: attachments.map((item, index) => ({
        id: Date.now() + index,
        type: item.type,
        name: item.name,
        fileName: item.fileName,
        note: "建立經歷時一併加入",
        outcome: item.type.includes("獎") ? `${item.name} 證明這段經歷的成果獲得外部評選肯定。` : `${item.name} 補充了執行方法、成果呈現與可驗證的影響。`,
        skills: item.type.includes("獎") ? ["成果交付", "提案溝通"] : item.type.includes("簡報") ? ["簡報溝通", "洞察整理"] : ["文件撰寫", "成果呈現"],
        resumeLine: item.type.includes("獎") ? `以專案成果獲得 ${item.name} 肯定。` : `整理並完成 ${item.name}，呈現專案方法與成果。`,
        createdAt: "剛剛",
      })),
    });
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file, index) => {
      const lower = file.name.toLowerCase();
      const inferredType = lower.includes("獎") || lower.includes("certificate") ? "獎狀／證書" : lower.endsWith(".ppt") || lower.endsWith(".pptx") ? "成果簡報" : "專案報告";
      return { id: Date.now() + index, fileName: file.name, type: inferredType, name: file.name.replace(/\.[^.]+$/, "") };
    });
    setAttachments((current) => [...current, ...next].slice(0, 5));
  }

  function schemaValue(analysis: ExperienceSchemaResult[], answers: Partial<Record<ExperienceSchemaKey, string>>, key: ExperienceSchemaKey) {
    if (Object.prototype.hasOwnProperty.call(answers, key)) return answers[key] || "";
    return analysis.find((item) => item.key === key)?.value || "";
  }

  function applyStructuredDetails(analysis: ExperienceSchemaResult[], answers: Partial<Record<ExperienceSchemaKey, string>>) {
    const nextRole = schemaValue(analysis, answers, "role");
    const nextTools = [schemaValue(analysis, answers, "action"), schemaValue(analysis, answers, "method")].filter((item, index, items) => item && items.indexOf(item) === index).join("；");
    const nextImpact = [schemaValue(analysis, answers, "result"), schemaValue(analysis, answers, "evidence")].filter((item, index, items) => item && items.indexOf(item) === index).join("；");
    const nextSummary = buildStructuredSummary(analysis, answers);
    if (nextSummary) {
      setSummary(nextSummary);
      const concise = [nextRole, nextImpact].filter(Boolean).join("；");
      const star = [
        "背景：" + (schemaValue(analysis, answers, "context") || "尚未補充"),
        "目標：" + (schemaValue(analysis, answers, "goal") || "尚未補充"),
        "行動：" + ([nextRole, nextTools].filter(Boolean).join("；") || "尚未補充"),
        "成果：" + (nextImpact || "尚未補充"),
      ].join("\n");
      setResumeOutputs({ "精簡版": concise || nextSummary, "標準版": nextSummary, "STAR 面試版": star });
    }
  }

  function reviewStory() {
    const analysis = analyzeExperienceStory(story).map((item) => item.key === "evidence" && attachments.length
      ? { ...item, detected: true, value: String(attachments.length) + " 份成果附件可作為驗證證據" }
      : item);
    setSchemaAnalysis(analysis);
    setSchemaAnswers({});
    setAnalysisTarget(2);
  }

  function openSkillModal() {
    setNewSkillGroup(null);
    setNewSkillName("");
    setSkillModalStep("category");
  }

  function analyzeAndAddSkill() {
    const name = newSkillName.trim();
    if (!name || !newSkillGroup) return;
    const alreadyExists = [...Object.values(resultSkillGroups).flat(), ...addedSkills.map((skill) => skill.name)]
      .some((skill) => skill.toLowerCase() === name.toLowerCase());
    if (alreadyExists) {
      setSkillNotice("這項技能已在技能面板中");
      return;
    }
    setSkillNotice("");
    setSkillModalStep("analyzing");
    window.setTimeout(() => {
      const evidenceText = `${story} ${summary} ${resumeOutputs["標準版"]} ${attachments.map((item) => `${item.name} ${item.type}`).join(" ")}`.toLowerCase();
      const status = evidenceText.includes(name.toLowerCase()) ? "certified" : "questionable";
      setAddedSkills((current) => [...current, { name, group: newSkillGroup, status }]);
      setSkillModalStep("closed");
      setSkillNotice(status === "certified" ? `「${name}」已有內容佐證，已標註為認證` : `「${name}」目前佐證不足，已標註為有疑慮`);
      window.setTimeout(() => setSkillNotice(""), 3000);
    }, 900);
  }

  function finishClarification() {
    applyStructuredDetails(schemaAnalysis, schemaAnswers);
    setAnalysisTarget(4);
  }

  function reorganizeFromSchema() {
    applyStructuredDetails(schemaAnalysis, schemaAnswers);
    setStep(4);
  }

  const missingSchemaFields = schemaAnalysis.filter((item) => !item.detected);
  const unresolvedSchemaFields = schemaAnalysis.filter((field) => !schemaValue(schemaAnalysis, schemaAnswers, field.key).trim());
  const schemaCompleteness = schemaAnalysis.length
    ? Math.round(((schemaAnalysis.length - unresolvedSchemaFields.length) / schemaAnalysis.length) * 100)
    : 0;
  const hasValidDateRange = type === "修課"
    ? true
    : type === "競賽"
    ? Boolean(competitionStartDate && competitionEndDate && competitionStartDate <= competitionEndDate)
    : Boolean(startDate && endDate && startDate <= endDate);
  const hasValidEmploymentFields = !["實習", "工作"].includes(type) || Boolean(companyName.trim() && positionName.trim());
  const hasValidCompetitionFields = type !== "競賽" || Boolean(competitionOrg.trim() && competitionName.trim());
  const hasValidProjectFields = type !== "專案" || Boolean(projectTitle.trim());
  const hasValidClubFields = type !== "社團" || Boolean(clubName.trim() && clubPosition.trim());
  const hasValidResearchFields = type !== "研究" || Boolean(researchTitle.trim());
  const visibleStep = analysisTarget === 2 ? 2 : analysisTarget === 4 || step >= 3 ? 3 : step;

  return (
    <div className={`flow-overlay${isClosing ? " closing" : ""}`} role="dialog" aria-modal="true" aria-label="新增經驗">
      <button className="modal-backdrop-dismiss" aria-label="關閉新增經驗" onClick={closeFlow} />
      <div className="flow-shell" ref={flowShell}>
        <header className="flow-header">
          <div className="flow-brand"><span className="brand-mark">G</span><span>新增一段經驗</span></div>
          <div className="stepper" aria-label={`步驟 ${visibleStep}，共 3 步`}>
            {["描述", "補充", "整理"].map((label, index) => (
              <div className={visibleStep >= index + 1 ? "is-active" : ""} key={label}>
                <span>{visibleStep > index + 1 ? "✓" : index + 1}</span><small>{label}</small>
              </div>
            ))}
          </div>
          <button className="flow-close" onClick={closeFlow} aria-label="關閉新增經驗">×</button>
        </header>

        {analysisTarget !== null && (
          <section className="processing-step analysis-transition">
            <div className="analysis-transition-card">
              <div className="analysis-loader" aria-hidden="true" />
              <span className="flow-kicker">GOODJOB · ANALYZING</span>
              <h2>{analysisTarget === 2 ? "正在分析你的描述" : "正在整理這段經驗"}</h2>
              <p>{analysisTarget === 2 ? "找出經驗中已具備與還能補充的細節" : "將描述轉化成履歷可用語言"}</p>
            </div>
          </section>
        )}

        {analysisTarget === null && step === 1 && (
          <section className="flow-content entry-step">
            <div className="flow-intro">
              <span className="flow-kicker">STEP 01 · CAPTURE</span>
              <p>不用想著怎麼寫履歷，像跟朋友分享一樣盡情描述就好</p>
            </div>

            <div className="capture-card">
              <div className="field-row">
                <label htmlFor="experience-type">這是什麼類型的經驗？</label>
                <select id="experience-type" value={type} onChange={(event) => setType(event.target.value)}>
                  <option>專案</option><option>修課</option><option>實習</option><option value="工作">正職</option><option>競賽</option><option>社團</option><option>研究</option>
                </select>
              </div>
              {type !== "修課" && <div className="experience-date-fields">
                {type === "競賽" ? <>
                  <label><span>開始日期</span><input type="date" value={competitionStartDate} max={competitionEndDate || undefined} onChange={(event) => setCompetitionStartDate(event.target.value)} /></label>
                  <label><span>結束日期</span><input type="date" value={competitionEndDate} min={competitionStartDate || undefined} onChange={(event) => setCompetitionEndDate(event.target.value)} /></label>
                </> : <>
                  <label><span>開始日期</span><input type="month" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} /></label>
                  <label><span>結束日期</span><input type="month" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} /></label>
                </>}
              </div>}
              {(type === "實習" || type === "工作") && <div className="employment-capture-fields">
                <label><span>公司名稱</span><input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="例如：木星數位科技" /></label>
                <label><span>職位名稱</span><input value={positionName} onChange={(event) => setPositionName(event.target.value)} placeholder={type === "實習" ? "例如：產品實習生" : "例如：產品經理"} /></label>
              </div>}
              {type === "競賽" && <div className="competition-capture-fields">
                <label><span>主辦單位</span><input value={competitionOrg} onChange={(event) => setCompetitionOrg(event.target.value)} placeholder="例如：全國大專創新提案競賽" /></label>
                <label><span>競賽名稱</span><input value={competitionName} onChange={(event) => setCompetitionName(event.target.value)} placeholder="例如：校園創新商業競賽" /></label>
              </div>}
              {type === "專案" && <div className="project-capture-fields">
                <label><span>專案主題</span><input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="例如：校園二手書交換服務設計" /></label>
              </div>}
              {type === "社團" && <div className="club-capture-fields">
                <label><span>社團名稱</span><input value={clubName} onChange={(event) => setClubName(event.target.value)} placeholder="例如：學生會" /></label>
                <label><span>職位</span><input value={clubPosition} onChange={(event) => setClubPosition(event.target.value)} placeholder="例如：活動長" /></label>
              </div>}
              {type === "研究" && <div className="research-capture-fields">
                <label><span>研究標題</span><input value={researchTitle} onChange={(event) => setResearchTitle(event.target.value)} placeholder="例如：大學生數位學習行為研究" /></label>
              </div>}
              {type === "修課" && <div className="course-capture-fields">
                <label><span>課程名稱</span><input value={courseName} onChange={(event) => setCourseName(event.target.value)} placeholder="例如：服務設計" /></label>
                <label><span>開課單位／學校</span><input value={courseOrg} onChange={(event) => setCourseOrg(event.target.value)} placeholder="例如：國立大學" /></label>
                <label><span>修課學期</span><input value={courseTerm} onChange={(event) => setCourseTerm(event.target.value)} placeholder="例如：2026 春季" /></label>
              </div>}
              <div className="story-field">
                <span>{type === "修課" ? "這堂課你學到什麼、做了哪些課堂專案等" : "盡情描述這段經驗"}</span>
                <small><b>小提示</b> 可以包含你的角色、做了什麼，以及最後做出什麼成果。</small>
                <textarea aria-label="盡情描述這段經驗" value={story} onChange={(event) => setStory(event.target.value)} rows={8} />
              </div>
            </div>

            <section className="capture-attachments">
              <header><div><span>成果附件（選填） <b className="capture-attachment-count">{attachments.length}/5</b></span><p>附上書面報告、簡報、獎狀等證明文件</p></div></header>
              <input ref={attachmentInput} type="file" multiple accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png" onChange={(event) => addFiles(event.target.files)} />
              {attachments.length === 0 ? <button className="capture-attachment-empty" onClick={() => attachmentInput.current?.click()}>＋ 選擇檔案</button> : <div className="capture-attachment-list">{attachments.map((item) => <article key={item.id}><span>{item.type.includes("獎") ? "◇" : item.type.includes("簡報") ? "▤" : "≡"}</span><div><input aria-label="成果名稱" value={item.name} onChange={(event) => setAttachments((current) => current.map((file) => file.id === item.id ? {...file,name:event.target.value} : file))} /><small>{item.fileName}</small></div><button aria-label="移除成果附件" onClick={() => setAttachments((current) => current.filter((file) => file.id !== item.id))}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" /></svg></button></article>)}{attachments.length < 5 && <button className="add-another-attachment" onClick={() => attachmentInput.current?.click()}>＋ 選擇檔案</button>}</div>}
            </section>

            <div className="flow-actions flow-actions-end"><button className="primary-flow-button" disabled={!story.trim() || !hasValidDateRange || !hasValidEmploymentFields || !hasValidCompetitionFields || !hasValidProjectFields || !hasValidClubFields || !hasValidResearchFields || (type === "修課" && !courseName.trim())} onClick={reviewStory}>下一步：分析完整度 <span>→</span></button></div>
          </section>
        )}

        {analysisTarget === null && step === 2 && (
          <section className="flow-content questions-step">
            <div className="flow-intro">
              <span className="flow-kicker">STEP 02 · CLARIFY</span>
              <p className="remaining-fields-note">還有 <strong>{unresolvedSchemaFields.length}</strong> 個欄位可以補充</p>
            </div>

            <div className="question-layout">
              <aside className="story-preview"><span>敘述拆解結果</span><p>{story}</p><div className="schema-review-list">{schemaAnalysis.map((field) => <div className={field.detected ? "detected" : "missing"} key={field.key}><b>{field.detected ? "✓" : "＋"}</b><span><strong>{field.label}</strong><small>{field.detected ? field.value : "尚未提到"}</small></span></div>)}</div></aside>
              <div className="question-list">
                {missingSchemaFields.map((field, index) => <label key={field.key}><span><b>{index + 1}</b> {field.question}</span><textarea rows={3} placeholder={field.placeholder} value={schemaAnswers[field.key] || ""} onChange={(event) => setSchemaAnswers((current) => ({ ...current, [field.key]: event.target.value }))} /></label>)}
              </div>
            </div>

            <div className="flow-actions flow-actions-end question-actions"><button className="text-button" onClick={() => setStep(1)}>← 上一步</button><button className="primary-flow-button" onClick={finishClarification}>下一步：整理經驗 <span>→</span></button></div>
          </section>
        )}

        {analysisTarget === null && step === 4 && (
          <section className="flow-content result-step">
            <div className="result-heading">
              <div><span className="flow-kicker">STEP 03 · ORGANIZE</span><p>將經驗轉化成履歷可用語言</p></div>
            </div>

            <div className="result-layout">
              <div className="result-main">
                <article className="result-card output-card">
                  <p>{resumeOutputs["標準版"]}</p>
                </article>
                <article className="result-card evidence-card">
                  <div className="result-card-title"><span>經驗結構</span></div>
                  <dl>
                    {([
                      ["context", "項目背景"],
                      ["role", "我的角色"],
                      ["action", "主要行動"],
                      ["result", "具體成果"],
                    ] as const).map(([key, label]) => <div key={key}><dt>{label}</dt><dd className={schemaValue(schemaAnalysis, schemaAnswers, key) ? "" : "schema-value-missing"}>{schemaValue(schemaAnalysis, schemaAnswers, key) || "尚未補充"}</dd></div>)}
                  </dl>
                </article>
                {attachments.length > 0 && <article className="result-card result-attachments"><div className="result-card-title"><span>成果附件分析</span><small>{attachments.length} 份已納入</small></div>{attachments.map((item) => <div key={item.id}><span>{item.type.includes("獎") ? "◇" : item.type.includes("簡報") ? "▤" : "≡"}</span><div><strong>{item.name}</strong><small>{item.type} · 提供成果與技能證據</small></div><b>✓</b></div>)}</article>}
              </div>

              <aside className="result-side">
                <article className="result-card skill-card">
                  <div className="result-card-title"><span>提取技能</span><button className="add-skill-button" onClick={openSkillModal}>＋ 新增技能</button></div>
                  <div className="skill-chips">
                    <div className="result-skill-table">{Object.entries(resultSkillGroups).map(([group, skills]) => {
                      const customSkills = addedSkills.filter((skill) => skill.group === group);
                      return <div className="result-skill-row" key={group}><strong>{group}</strong><div>{skills.map((skill) => <span key={skill}>{skill}<b className="certified" aria-label="已認證" title="已認證">✓</b></span>)}{customSkills.map((skill) => <span className="newly-added" key={skill.name}>{skill.name}<b className={skill.status} aria-label={skill.status === "certified" ? "已認證" : "有疑慮"} title={skill.status === "certified" ? "已認證" : "有疑慮"}>{skill.status === "certified" ? "✓" : "?"}</b></span>)}</div></div>;
                    })}</div>
                  </div>
                </article>
                <article className="result-card source-card"><div><strong>事實來源完整</strong><p>{attachments.length ? `角色與成果由原始描述及 ${attachments.length} 份附件共同支持。` : "角色、方法與成果都有原始描述支持。團隊協作仍需要更多細節。"}</p></div></article>
              </aside>
            </div>

            <div className="flow-actions flow-actions-end result-actions"><button className="text-button" onClick={() => setStep(missingSchemaFields.length ? 2 : 1)}>← 上一步</button><button className="primary-flow-button" onClick={saveExperience}>儲存至我的經驗 <span>✓</span></button></div>
          </section>
        )}

        {analysisTarget === null && step === 5 && (
          <section className="flow-content schema-edit-step">
            <div className="flow-intro">
              <span className="flow-kicker">EDIT EXPERIENCE STRUCTURE</span>
              <h2>修改或補充經驗內容</h2>
              <p>調整固定欄位後，GoodJob 會依最新內容重新產生履歷與面試敘述。</p>
            </div>
            <div className="schema-edit-layout">
              <div className="schema-edit-fields">{schemaAnalysis.map((field) => <label key={field.key}><span>{field.label}<small>{field.question}</small></span><textarea rows={3} placeholder={field.placeholder} value={schemaValue(schemaAnalysis, schemaAnswers, field.key)} onChange={(event) => setSchemaAnswers((current) => ({ ...current, [field.key]: event.target.value }))} /></label>)}</div>
              <aside><div className="schema-completeness-preview"><span>修改後完整度</span><strong>{schemaCompleteness}%</strong><i><b style={{ width: String(schemaCompleteness) + "%" }} /></i><small>{unresolvedSchemaFields.length ? unresolvedSchemaFields.length + " 個欄位仍可稍後補充" : "必要資訊已完整"}</small></div></aside>
            </div>
            <div className="flow-actions"><button className="text-button" onClick={() => setStep(4)}>取消修改</button><button className="primary-flow-button" onClick={reorganizeFromSchema}>重新摘要統整 <span>✦</span></button></div>
          </section>
        )}
      </div>
      {skillModalStep !== "closed" && <div className="add-skill-modal-backdrop">
        <button className="modal-backdrop-dismiss" aria-label="關閉新增技能視窗" onClick={() => setSkillModalStep("closed")} />
        <section className="add-skill-modal" role="dialog" aria-modal="true" aria-labelledby="add-skill-title">
          <header><div><span className="flow-kicker">ADD A SKILL</span><h2 id="add-skill-title">新增技能</h2></div><button aria-label="關閉新增技能視窗" onClick={() => setSkillModalStep("closed")}>×</button></header>
          {skillModalStep === "category" && <main><p>先選擇技能類型</p><div className="add-skill-category-grid">{(Object.keys(resultSkillGroups) as SkillGroup[]).map((group) => <button key={group} onClick={() => { setNewSkillGroup(group); setSkillModalStep("input"); }}><span>{group === "核心能力" ? "◇" : group === "工具技能" ? "⌘" : "◎"}</span><div><strong>{group}</strong><small>{group === "核心能力" ? "工作方法、溝通與執行能力" : group === "工具技能" ? "軟體、平台或實作工具" : "產業、情境與專業知識"}</small></div><b>→</b></button>)}</div></main>}
          {skillModalStep === "input" && <main><button className="add-skill-back" onClick={() => { setSkillNotice(""); setSkillModalStep("category"); }}>← 重新選擇類型</button><div className="selected-skill-category"><span>技能類型</span><strong>{newSkillGroup}</strong></div><label><span>技能名稱</span><input value={newSkillName} placeholder="輸入一項技能" onChange={(event) => { setNewSkillName(event.target.value); setSkillNotice(""); }} onKeyDown={(event) => { if (event.key === "Enter") analyzeAndAddSkill(); }} /></label>{skillNotice && <p className="add-skill-warning">{skillNotice}</p>}</main>}
          {skillModalStep === "analyzing" && <main className="add-skill-analyzing"><span className="analysis-loader" aria-hidden="true" /><h3>AI 正在判斷技能證據</h3><p>比對經驗描述、整理結果與成果附件</p></main>}
          {skillModalStep !== "analyzing" && <footer><button onClick={() => setSkillModalStep("closed")}>取消</button>{skillModalStep === "input" && <button className="primary-flow-button" disabled={!newSkillName.trim()} onClick={analyzeAndAddSkill}>交給 AI 判斷 ✦</button>}</footer>}
        </section>
      </div>}
      {skillNotice && skillModalStep === "closed" && <div className="skill-analysis-notice" role="status">{skillNotice}</div>}
    </div>
  );
}
