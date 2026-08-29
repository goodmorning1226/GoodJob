"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { NewExperience } from "./ExperienceFlow";

export type EvidenceItem = {
  id: number; type: string; name: string; fileName: string; note: string;
  outcome: string; skills: string[]; resumeLine: string; createdAt: string;
};

export const evidenceStorageKey = "goodjob-evidence-v1";
const legacyEvidenceStorageKey = ["path", "ly-evidence-v1"].join("");

export function readEvidence(): Record<string, EvidenceItem[]> {
  if (typeof window === "undefined") return {};
  try {
    const current = window.localStorage.getItem(evidenceStorageKey);
    const stored = current || window.localStorage.getItem(legacyEvidenceStorageKey) || "{}";
    if (!current && stored !== "{}") window.localStorage.setItem(evidenceStorageKey, stored);
    return JSON.parse(stored);
  } catch { return {}; }
}

export function writeEvidence(experienceTitle: string, items: EvidenceItem[]) {
  const all = readEvidence();
  all[experienceTitle] = items;
  window.localStorage.setItem(evidenceStorageKey, JSON.stringify(all));
}

type Props = { experience: NewExperience; onClose: () => void; onSaved: (items: EvidenceItem[]) => void };
const typeOptions = ["成果簡報", "獎狀／證書", "專案報告", "作品連結", "其他成果"];

export default function ExperienceEvidence({ experience, onClose, onSaved }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const key = experience.title;
  const [items,setItems] = useState<EvidenceItem[]>([]);
  const [mode,setMode] = useState<"list"|"add"|"analysis">("list");
  const [type,setType] = useState(typeOptions[0]);
  const [name,setName] = useState("");
  const [fileName,setFileName] = useState("");
  const [note,setNote] = useState("");
  const [analyzing,setAnalyzing] = useState(false);
  const [draft,setDraft] = useState<EvidenceItem | null>(null);

  useEffect(() => { setItems(readEvidence()[key] || []); }, [key]);
  const canAnalyze = name.trim().length > 1 && (fileName || type === "作品連結");
  const derived = useMemo(() => {
    if (type === "獎狀／證書") return { outcome:`${name || "此成果"}證明經驗成果獲得外部評選與肯定。`, skills:["提案溝通","成果交付","競爭分析"], line:`以具體提案與成果完成 ${name || "專業評選"}，獲得外部評審肯定。` };
    if (type === "成果簡報") return { outcome:`簡報呈現了問題洞察、執行方法與成果，補強這段經驗的決策影響。`, skills:["簡報溝通","洞察整理","利害關係人溝通"], line:`整合研究洞察與成果製作決策簡報，向團隊提出具體改善方向。` };
    if (type === "專案報告") return { outcome:`報告補充了研究方法、分析過程與可驗證成果，讓經驗脈絡更完整。`, skills:["資料分析","文件撰寫","問題定義"], line:`完成專案研究與成果報告，將分析結果轉化為可執行建議。` };
    return { outcome:`這項作品提供可追溯的成果證據，可和原有經驗描述一起使用。`, skills:["成果呈現","執行力","專案管理"], line:`完成 ${name || "專案成果"} 並整理為可供檢視的作品證據。` };
  },[name,type]);

  function analyze() {
    setAnalyzing(true);
    window.setTimeout(() => {
      setDraft({ id:Date.now(),type,name,fileName: fileName || "外部作品連結",note,outcome:derived.outcome,skills:derived.skills,resumeLine:derived.line,createdAt:"剛剛" });
      setAnalyzing(false); setMode("analysis");
    },1100);
  }
  function save() {
    if (!draft) return;
    const next = [draft,...items];
    writeEvidence(key,next);
    setItems(next); onSaved(next); setDraft(null); setName(""); setFileName(""); setNote(""); setMode("list");
  }
  function remove(id:number) {
    const next = items.filter((item) => item.id !== id); writeEvidence(key,next); setItems(next); onSaved(next);
  }

  return <div className="evidence-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="evidence-workspace" role="dialog" aria-modal="true" aria-label="成果與附件">
    <header><button onClick={mode === "list" ? onClose : () => setMode("list")}>{mode === "list" ? "×" : "←"}</button><div><span className="page-kicker">EXPERIENCE EVIDENCE</span><h2>{mode === "list" ? "成果與附件" : mode === "add" ? "加入成果證據" : "解析結果"}</h2><p>{experience.title} · {experience.org}</p></div><span>{items.length} 項證據</span></header>
    {mode === "list" && <main className="evidence-home"><article className="evidence-intro"><div><span>✦</span><div><small>讓經驗更可信</small><h3>把做過的成果，變成可引用的證據。</h3><p>加入簡報、獎狀或報告後，GoodJob 會整理成果、技能與履歷敘述，並標示資訊來源。</p></div></div><button onClick={() => setMode("add")}>＋ 加入成果或附件</button></article>
      {items.length ? <div className="evidence-list"><div className="evidence-list-title"><h3>已整理的成果</h3><span>會納入經歷與技能分析</span></div>{items.map((item) => <article key={item.id}><div className={`evidence-file-icon ${item.type.includes("獎") ? "award" : item.type.includes("簡報") ? "slides" : "report"}`}>{item.type.includes("獎") ? "◇" : item.type.includes("簡報") ? "▤" : "≡"}</div><div><small>{item.type} · {item.fileName}</small><h3>{item.name}</h3><p>{item.outcome}</p><div>{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><aside><span>✓ 已解析</span><button aria-label="刪除附件分析" onClick={() => remove(item.id)}>···</button></aside></article>)}</div> : <div className="evidence-empty"><span>▤</span><h3>還沒有成果證據</h3><p>你可以先加入一份成果簡報或獎狀，看看它如何補強這段經歷。</p></div>}
      <div className="evidence-privacy"><span>⌁</span><p><b>Prototype 的檔案處理方式</b>不會上傳或讀取檔案內容；只使用你輸入的名稱、說明與檔名，模擬 AI 整理結果。</p></div>
    </main>}
    {mode === "add" && <main className="evidence-add"><div className="evidence-step"><span>01</span><div><h3>這是什麼成果？</h3><p>選擇類型能讓後續分析更貼近內容。</p></div></div><div className="evidence-type-grid">{typeOptions.map((item) => <button className={type === item ? "active" : ""} key={item} onClick={() => setType(item)}><span>{item.includes("獎") ? "◇" : item.includes("簡報") ? "▤" : item.includes("連結") ? "↗" : "≡"}</span>{item}<b>{type === item ? "✓" : ""}</b></button>)}</div>
      <div className="evidence-step"><span>02</span><div><h3>加入檔案與說明</h3><p>Prototype 不會傳送檔案，僅保留檔名做展示。</p></div></div><input ref={inputRef} className="hidden-evidence-input" type="file" accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} /><button className="evidence-dropzone" onClick={() => inputRef.current?.click()}><span>{fileName ? "✓" : "＋"}</span><strong>{fileName || "選擇簡報、PDF 或圖片"}</strong><small>{fileName ? "已取得檔名，檔案本身不會上傳" : "支援 PDF、PPTX、JPG、PNG · Prototype 模式"}</small></button>
      <label><span>成果名稱</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：校園創新競賽決賽簡報" /></label><label><span>補充說明 <i>選填</i></span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="你希望分析特別注意什麼？例如：這份簡報是我負責市場研究與提案架構。" /></label><footer><button onClick={() => setMode("list")}>取消</button><button className="primary-flow-button" disabled={!canAnalyze || analyzing} onClick={analyze}>{analyzing ? "正在模擬解析…" : "✦ 開始解析"}</button></footer>
    </main>}
    {mode === "analysis" && draft && <main className="evidence-analysis"><div className="evidence-analysis-status"><span>✓</span><div><small>模擬解析完成</small><h3>找到 1 項成果與 {draft.skills.length} 項技能證據</h3><p>請確認內容是否符合實際情況，儲存後才會納入分析。</p></div></div><section><header><span>成果摘要</span><b>來自 {draft.fileName}</b></header><p>{draft.outcome}</p><button>編輯摘要</button></section><section><header><span>辨識到的技能</span><b>可移除不正確項目</b></header><div className="analyzed-skills">{draft.skills.map((skill) => <span key={skill}>✓　{skill}<button>×</button></span>)}</div></section><section className="analyzed-resume-line"><header><span>可用於履歷的敘述</span><b>根據附件與原經歷整理</b></header><p>• {draft.resumeLine}</p></section><div className="analysis-source-chain"><span>原始經歷</span><b>＋</b><span>{draft.type}</span><b>→</b><span>成果與技能證據</span></div><footer><button onClick={() => setMode("add")}>返回修改</button><button className="primary-flow-button" onClick={save}>確認並儲存分析</button></footer></main>}
  </section></div>;
}
