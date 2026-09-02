"use client";

import { useEffect, useRef, useState } from "react";
import type { EvidenceItem } from "./ExperienceEvidence";
import {
  analyzeExperienceStory,
  buildStructuredSummary,
  completeStoryExample,
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

export default function ExperienceFlow({ onClose, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("自由描述");
  const [type, setType] = useState("專案");
  const [story, setStory] = useState(incompleteStoryExample);
  const [role, setRole] = useState("負責使用者訪談、問題整理與互動原型設計");
  const [tools, setTools] = useState("半結構式訪談、Figma、可用性測試");
  const [impact, setImpact] = useState("測試 8 位使用者，將交換流程由 7 步縮短至 4 步");
  const [summary, setSummary] = useState("主導校園二手書交換流程的使用者研究與原型設計，透過 8 位使用者測試，將核心交換流程由 7 步精簡至 4 步。");
  const [outputTab, setOutputTab] = useState("標準版");
  const [resumeOutputs, setResumeOutputs] = useState<Record<string, string>>({
    "精簡版": "重新設計校園二手書交換流程，透過使用者測試將完成步驟由 7 步縮短至 4 步。",
    "標準版": "主導校園二手書交換流程的使用者研究與互動原型設計，訪談並測試 8 位使用者，將核心交換流程由 7 步精簡至 4 步。",
    "STAR 面試版": "背景：學生反映校內二手書交換流程繁複。\n行動：我規劃訪談、整理痛點並以 Figma 製作原型，邀請 8 位使用者測試。\n成果：團隊將主要流程從 7 步精簡至 4 步，降低完成交換的操作負擔。",
  });
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [courseName, setCourseName] = useState("服務設計");
  const [courseOrg, setCourseOrg] = useState("國立大學");
  const [courseTerm, setCourseTerm] = useState("2026 春季");
  const [courseProject, setCourseProject] = useState("校園二手書交換服務設計");
  const [schemaAnalysis, setSchemaAnalysis] = useState<ExperienceSchemaResult[]>([]);
  const [schemaAnswers, setSchemaAnswers] = useState<Partial<Record<ExperienceSchemaKey, string>>>({});
  const attachmentInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 3) return;
    const timer = window.setTimeout(() => setStep(4), 1150);
    return () => window.clearTimeout(timer);
  }, [step]);

  function saveExperience() {
    const savedSchema = Object.fromEntries(schemaAnalysis.map((field) => [field.key, schemaValue(schemaAnalysis, schemaAnswers, field.key)])) as Partial<Record<ExperienceSchemaKey, string>>;
    onComplete({
      type,
      date: "2026.02 — 2026.06",
      title: type === "修課" ? courseName : "校園二手書交換服務設計",
      org: type === "修課" ? courseOrg + " · " + courseTerm + (courseProject.trim() ? " · 課堂專案：" + courseProject : "") : "服務設計課程專案",
      description: resumeOutputs["標準版"] || summary,
      tags: ["使用者研究", "Figma", "流程優化"],
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
    if (nextRole) setRole(nextRole);
    if (nextTools) setTools(nextTools);
    if (nextImpact) setImpact(nextImpact);
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
    if (analysis.every((item) => item.detected)) {
      applyStructuredDetails(analysis, {});
      setStep(3);
      return;
    }
    setStep(2);
  }

  function finishClarification() {
    applyStructuredDetails(schemaAnalysis, schemaAnswers);
    setStep(3);
  }

  function reorganizeFromSchema() {
    applyStructuredDetails(schemaAnalysis, schemaAnswers);
    setStep(3);
  }

  const missingSchemaFields = schemaAnalysis.filter((item) => !item.detected);
  const unresolvedSchemaFields = schemaAnalysis.filter((field) => !schemaValue(schemaAnalysis, schemaAnswers, field.key).trim());
  const answeredMissingCount = missingSchemaFields.filter((field) => schemaValue(schemaAnalysis, schemaAnswers, field.key).trim()).length;
  const schemaCompleteness = schemaAnalysis.length
    ? Math.round(((schemaAnalysis.length - unresolvedSchemaFields.length) / schemaAnalysis.length) * 100)
    : 0;

  return (
    <div className="flow-overlay" role="dialog" aria-modal="true" aria-label="新增經驗">
      <div className="flow-shell">
        <header className="flow-header">
          <div className="flow-brand"><span className="brand-mark">G</span><span>新增一段經驗</span></div>
          <div className="stepper" aria-label={`步驟 ${Math.min(step, 4)}，共 4 步`}>
            {["描述", "補充", "整理", "確認"].map((label, index) => (
              <div className={step >= index + 1 ? "is-active" : ""} key={label}>
                <span>{step > index + 1 ? "✓" : index + 1}</span><small>{label}</small>
              </div>
            ))}
          </div>
          <button className="flow-close" onClick={onClose} aria-label="關閉新增經驗">×</button>
        </header>

        {step === 1 && (
          <section className="flow-content entry-step">
            <div className="flow-intro">
              <span className="flow-kicker">STEP 01 · CAPTURE</span>
              <h2>先說說發生了什麼</h2>
              <p>不用想著怎麼寫履歷，像跟朋友分享一樣描述就好。</p>
            </div>

            <div className="method-grid">
              {[{ name: "自由描述", icon: "✎", note: "直接寫下你記得的事" }, { name: "引導問答", icon: "?", note: "一步一步回想細節" }, { name: "貼上內容", icon: "↥", note: "從舊履歷或文件開始" }].map((item) => (
                <button className={method === item.name ? "selected" : ""} key={item.name} onClick={() => setMethod(item.name)}>
                  <span>{item.icon}</span><strong>{item.name}</strong><small>{item.note}</small>
                </button>
              ))}
            </div>

            <div className="capture-card">
              <div className="field-row">
                <label>這是什麼類型的經驗？</label>
                <select value={type} onChange={(event) => setType(event.target.value)}>
                  <option>專案</option><option>修課</option><option>實習</option><option value="工作">正職</option><option>競賽</option><option>社團</option><option>研究</option>
                </select>
              </div>
              {type === "修課" && <div className="course-capture-fields">
                <label><span>課程名稱</span><input value={courseName} onChange={(event) => setCourseName(event.target.value)} placeholder="例如：服務設計" /></label>
                <label><span>開課單位／學校</span><input value={courseOrg} onChange={(event) => setCourseOrg(event.target.value)} placeholder="例如：國立大學" /></label>
                <label><span>修課學期</span><input value={courseTerm} onChange={(event) => setCourseTerm(event.target.value)} placeholder="例如：2026 春季" /></label>
                <label><span>課堂專案 <i>選填</i></span><input value={courseProject} onChange={(event) => setCourseProject(event.target.value)} placeholder="例如：校園二手書交換服務設計" /></label>
              </div>}
              {method === "貼上內容" ? (
                <div className="paste-zone"><span>↥</span><strong>把舊履歷內容貼在這裡</strong><small>Prototype 會使用同一組示範資料，不會上傳檔案</small><button onClick={() => setMethod("自由描述")}>改用文字輸入</button></div>
              ) : (
                <div className="story-field">
                  <span>{type === "修課" ? "記下這堂課學到什麼，以及你做了哪些課堂專案" : method === "引導問答" ? "先從這段經驗的目標開始" : "描述這段經驗"}</span>
                  <textarea aria-label="描述這段經驗" value={story} onChange={(event) => setStory(event.target.value)} rows={8} />
                  <small><b>小提示</b>　可以包含你的角色、做了什麼，以及最後發生什麼改變。</small>
                  <div className="schema-example-buttons"><span>測試分流範例</span><button type="button" onClick={() => setStory(incompleteStoryExample)}>需補充細節</button><button type="button" onClick={() => setStory(completeStoryExample)}>敘述已完整</button></div>
                </div>
              )}
            </div>

            <section className="capture-attachments">
              <header><div><span>成果附件 <i>選填</i></span><p>簡報、獎狀與報告會和你的描述一起整理。</p></div><b>{attachments.length}/5</b></header>
              <input ref={attachmentInput} type="file" multiple accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png" onChange={(event) => addFiles(event.target.files)} />
              {attachments.length === 0 ? <button className="capture-attachment-empty" onClick={() => attachmentInput.current?.click()}><span>＋</span><div><strong>加入成果簡報、獎狀或專案報告</strong><small>Prototype 只取得檔名，不會上傳或讀取檔案內容</small></div><b>選擇檔案</b></button> : <div className="capture-attachment-list">{attachments.map((item) => <article key={item.id}><span>{item.type.includes("獎") ? "◇" : item.type.includes("簡報") ? "▤" : "≡"}</span><div><input aria-label="成果名稱" value={item.name} onChange={(event) => setAttachments((current) => current.map((file) => file.id === item.id ? {...file,name:event.target.value} : file))} /><small>{item.fileName}</small></div><select aria-label="成果類型" value={item.type} onChange={(event) => setAttachments((current) => current.map((file) => file.id === item.id ? {...file,type:event.target.value} : file))}><option>成果簡報</option><option>獎狀／證書</option><option>專案報告</option><option>其他成果</option></select><button aria-label="移除成果附件" onClick={() => setAttachments((current) => current.filter((file) => file.id !== item.id))}>×</button></article>)}{attachments.length < 5 && <button className="add-another-attachment" onClick={() => attachmentInput.current?.click()}>＋ 再加入一份成果</button>}</div>}
            </section>

            <div className="flow-actions"><button className="text-button" onClick={onClose}>稍後再說</button><button className="primary-flow-button" disabled={!story.trim() || (type === "修課" && !courseName.trim())} onClick={reviewStory}>分析完整度並整理 <span>→</span></button></div>
          </section>
        )}

        {step === 2 && (
          <section className="flow-content questions-step">
            <div className="flow-intro">
              <span className="flow-kicker">STEP 02 · CLARIFY</span>
              <h2>還有 {unresolvedSchemaFields.length} 個欄位可以補充</h2>
              <p>不需要全部填完；未填內容會保留為待補充，並計入完整度。</p>
            </div>

            <div className="question-layout">
              <aside className="story-preview"><span>敘述拆解結果</span><p>{story}</p><div className="schema-review-list">{schemaAnalysis.map((field) => <div className={field.detected ? "detected" : "missing"} key={field.key}><b>{field.detected ? "✓" : "＋"}</b><span><strong>{field.label}</strong><small>{field.detected ? field.value : "尚未提到"}</small></span></div>)}</div><button onClick={() => setStep(1)}>返回修改原始敘述</button></aside>
              <div className="question-list">
                {missingSchemaFields.map((field, index) => <label key={field.key}><span><b>{index + 1}</b> {field.question}</span><textarea rows={3} placeholder={field.placeholder} value={schemaAnswers[field.key] || ""} onChange={(event) => setSchemaAnswers((current) => ({ ...current, [field.key]: event.target.value }))} /></label>)}
              </div>
            </div>

            <div className="flow-actions"><button className="text-button" onClick={() => setStep(1)}>← 上一步</button><button className="primary-flow-button" onClick={finishClarification}>{unresolvedSchemaFields.length ? "依目前內容繼續" : "補充完成，開始整理"} <span>✦</span></button></div>
          </section>
        )}

        {step === 3 && (
          <section className="processing-step">
            <div className="processing-mark"><span>✦</span><i /><i /><i /></div>
            <span className="flow-kicker">GOODJOB IS ORGANIZING</span>
            <h2>正在把零散細節整理成職涯資產</h2>
            <div className="processing-list"><span className="done">✓　將原始敘述拆入 8 個固定欄位</span><span className="done">✓　{missingSchemaFields.length ? "已補充 " + answeredMissingCount + " 項，保留 " + unresolvedSchemaFields.length + " 項待補" : "原始敘述完整，已略過補充"}</span>{attachments.length > 0 && <span className="done">✓　比對 {attachments.length} 份成果附件</span>}<span>○　提取可驗證的技能</span></div>
            <small>這是 Prototype 模擬，不會呼叫任何外部 API</small>
          </section>
        )}

        {step === 4 && (
          <section className="flow-content result-step">
            <div className="result-heading">
              <div><span className="flow-kicker">STEP 04 · REVIEW</span><h2>這段經驗已經整理好了</h2><p>若內容需要調整，可從經驗結構補充後重新摘要統整。</p></div>
              <span className="confidence-pill">內容完整度 {schemaCompleteness}%</span>
            </div>

            <div className="result-layout">
              <div className="result-main">
                <div className="schema-completeness-preview result-completeness"><span>目前內容完整度</span><strong>{schemaCompleteness}%</strong><i><b style={{ width: String(schemaCompleteness) + "%" }} /></i><small>{unresolvedSchemaFields.length ? unresolvedSchemaFields.length + " 個欄位仍可透過「編輯或補充」完成" : "必要資訊已完整"}</small></div>
                <article className="result-card output-card">
                  <div className="output-tabs">{["精簡版", "標準版", "STAR 面試版"].map((tab) => <button className={outputTab === tab ? "active" : ""} key={tab} onClick={() => setOutputTab(tab)}>{tab}</button>)}</div>
                  <p>{resumeOutputs[outputTab]}</p>
                </article>
                <article className="result-card evidence-card">
                  <div className="result-card-title"><span>經驗結構</span><button onClick={() => setStep(5)}>✎ 編輯或補充</button></div>
                  <dl>{schemaAnalysis.map((field) => <div key={field.key}><dt>{field.label}</dt><dd className={schemaValue(schemaAnalysis, schemaAnswers, field.key) ? "" : "schema-value-missing"}>{schemaValue(schemaAnalysis, schemaAnswers, field.key) || "尚未補充"}</dd></div>)}</dl>
                </article>
                {attachments.length > 0 && <article className="result-card result-attachments"><div className="result-card-title"><span>成果附件分析</span><small>{attachments.length} 份已納入</small></div>{attachments.map((item) => <div key={item.id}><span>{item.type.includes("獎") ? "◇" : item.type.includes("簡報") ? "▤" : "≡"}</span><div><strong>{item.name}</strong><small>{item.type} · 提供成果與技能證據</small></div><b>✓</b></div>)}</article>}
              </div>

              <aside className="result-side">
                <article className="result-card"><div className="result-card-title"><span>提取技能</span><small>5 項</small></div><div className="skill-chips"><span>使用者研究 <b>✓</b></span><span>Figma <b>✓</b></span><span>流程優化 <b>✓</b></span><span>原型測試 <b>✓</b></span><span>團隊協作 <b>?</b></span></div><button className="add-skill-button">＋ 新增技能</button></article>
                <article className="result-card source-card"><span className="source-icon">⌁</span><div><strong>事實來源完整</strong><p>{attachments.length ? `角色與成果由原始描述及 ${attachments.length} 份附件共同支持。` : "角色、方法與成果都有原始描述支持。團隊協作仍需要更多細節。"}</p></div></article>
              </aside>
            </div>

            <div className="flow-actions"><button className="text-button" onClick={() => setStep(missingSchemaFields.length ? 2 : 1)}>← 回去修改</button><button className="primary-flow-button" onClick={saveExperience}>儲存至我的經驗 <span>✓</span></button></div>
          </section>
        )}

        {step === 5 && (
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
    </div>
  );
}
