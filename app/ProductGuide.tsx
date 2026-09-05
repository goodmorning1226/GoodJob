"use client";

import { useEffect, useState } from "react";

type Props = { onClose: () => void; onNavigate: (view: string) => void; audience?: "talent" | "business"; onReset?: () => void };

const talentSteps = [
  { kicker:"CAPTURE", title:"先從一段真實經驗開始。", text:"到「我的經驗」查看產品實習生，或新增一段經驗。輸入自然敘述後，系統會模擬 AI 拆解背景、角色、行動與成果。", hint:"示範資料：木星數位科技｜產品實習生｜12 場使用者訪談", view:"我的經驗", action:"前往我的經驗" },
  { kicker:"VERIFY", title:"補上成果，讓技能有證據。", text:"打開經驗詳情並選擇編輯經驗，可加入簡報、專案報告或獎狀。成果經過模擬解析後會補充技能與履歷敘述。", hint:"建議操作：編輯經驗 → 加入成果 → 確認並儲存分析", view:"我的經驗", action:"編輯一段經驗" },
  { kicker:"PACKAGE", title:"把經驗加入目標履歷。", text:"在經驗詳情按「加入履歷」，選擇既有的 Associate Product Manager 履歷，再到我的履歷確認內容。", hint:"示範履歷：Orbit 數位產品｜Associate Product Manager｜ATS 專業版", view:"我的履歷", action:"查看我的履歷" },
  { kicker:"MATCH", title:"用經驗證據理解職缺適配。", text:"到職缺探索打開 Orbit 的 Associate Product Manager，查看條件分析中的符合項目、可轉移能力與能力缺口。", hint:"示範結果：82% 匹配；使用者研究符合，產品年資仍有缺口", view:"職缺探索", action:"查看職缺探索" },
  { kicker:"APPLY", title:"選擇履歷並完成投遞。", text:"在 Orbit 職缺卡片或詳情按「投遞履歷」，選擇同名目標履歷，確認後即可看到投遞成功狀態。", hint:"建議操作：投遞履歷 → Associate Product Manager → 確認", view:"職缺探索", action:"前往投遞" },
  { kicker:"CONNECT", title:"從媒合自然進入對話。", text:"投遞後可切到聊天室，查看 Orbit 招募方的邀請並直接回覆，完成從經驗整理到招募溝通的閉環。", hint:"示範對話：Orbit 邀請 Yulun 進行 30 分鐘線上交流", view:"聊天室", action:"打開聊天室" },
];

const businessSteps = [
  { kicker:"PUBLISH", title:"從正在招募的職缺開始。", text:"已發布職缺提供招募狀態、人才興趣與瀏覽數。打開 Associate Product Manager 可查看內容、編輯或結束招募。", hint:"示範職缺：Orbit 數位產品｜Associate Product Manager", view:"jobs", action:"查看已發布職缺" },
  { kicker:"REVIEW", title:"依職缺進入履歷列表。", text:"到「檢視履歷」選擇 Associate Product Manager，會看到同一批投遞者、投遞時間、學歷、技能與適配度。", hint:"示範資料：8 份履歷；Yulun 為 93% 高適配候選人", view:"resumes", action:"查看履歷" },
  { kicker:"FILTER", title:"快速縮小候選人範圍。", text:"可用姓名或技能搜尋、依學歷與技能篩選，並切換最新投遞、職缺適配度或有興趣排序。", hint:"建議操作：篩選 → 學歷「大二以上」→ 技能「使用者研究」", view:"resumes", action:"開始篩選" },
  { kicker:"DECIDE", title:"用 AI 摘要輔助判斷。", text:"打開 Yulun 的履歷後按「AI 摘要」，查看適合與不適合此職缺的原因，再標記「有興趣」。", hint:"判斷依據：技能、經驗成果、必備條件與仍缺少的證據", view:"resumes", action:"檢視候選履歷" },
  { kicker:"CONTACT", title:"把招募決策帶進聊天室。", text:"在履歷頁按「聯絡此人才」，或從側邊欄進入聯繫人才，即可接續與 Yulun 的招募對話。", hint:"示範對話與人才端共用，可從任一方繼續輸入訊息", view:"messages", action:"前往聯繫人才" },
];

export default function ProductGuide({ onClose, onNavigate, audience = "talent", onReset }: Props) {
  const [step,setStep] = useState(0);
  const steps = audience === "business" ? businessSteps : talentSteps;
  const current = steps[step];

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

  return <div className="guide-backdrop" role="dialog" aria-modal="true" aria-labelledby="guide-title">
    <section className={`product-guide ${audience}`}><header><div className="brand"><span className="brand-mark">G</span><span>{audience === "business" ? "企業端示範流程" : "人才端示範流程"}</span></div><button aria-label="關閉產品導覽" onClick={onClose}>×</button></header><main><div className="guide-copy"><span className="page-kicker">{current.kicker} · {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span><h2 id="guide-title">{current.title}</h2><p>{current.text}</p><div className="guide-demo-hint"><span>DEMO DATA</span><p>{current.hint}</p></div><div className="guide-actions"><button onClick={() => { onNavigate(current.view); onClose(); }}>{current.action} →</button>{step < steps.length - 1 && <button onClick={() => setStep(step + 1)}>下一步</button>}</div>{onReset && <button className="guide-reset-button" onClick={() => { onReset(); setStep(0); }}>↻ 重設示範資料</button>}</div><div className={`guide-visual guide-${step % 4}`} aria-hidden="true"><div className="guide-orbit" /><div className="guide-card card-a"><i /><b /><span /><span /><span /></div><div className="guide-card card-b"><i /><b /><span /><span /></div><em>{String(step + 1).padStart(2, "0")}</em></div></main><footer><button disabled={step === 0} onClick={() => setStep(step - 1)}>←</button><div>{steps.map((_,index) => <button aria-label={`前往第 ${index + 1} 步`} className={index === step ? "active" : ""} key={index} onClick={() => setStep(index)} />)}</div><button disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>→</button></footer></section>
  </div>;
}
