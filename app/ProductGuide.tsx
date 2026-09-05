"use client";

import { useEffect, useState } from "react";

type Props = { onClose: () => void; onNavigate: (view: string) => void };

const steps = [
  { number:"01", kicker:"CAPTURE", title:"先記錄，不必先會寫履歷。", text:"把實習、專案、競賽或社團經驗用自己的話記下來，GoodJob 會整理摘要、技能與可使用的證據。", view:"我的經驗", action:"看看經驗資料庫" },
  { number:"02", kicker:"UNDERSTAND", title:"看見能力如何隨時間累積。", text:"從所有經驗整理技能證據、經歷分布與成長時間軸，幫助你理解自己適合往哪裡走。", view:"首頁分析", action:"看看首頁分析" },
  { number:"03", kicker:"CONNECT", title:"用證據對照職缺，而不是只看關鍵字。", text:"職缺探索會區分直接符合、可轉移能力與待補缺口，再把結果帶進履歷調整。", view:"職缺探索", action:"看看職缺探索" },
  { number:"04", kicker:"CREATE", title:"把經驗轉成針對職缺的履歷。", text:"選定目標後，挑選最相關的經驗、調整內容與模板，完成可直接修改的履歷。整套 Prototype 都不會呼叫付費 API。", view:"我的履歷", action:"開始製作履歷" },
];

export default function ProductGuide({ onClose, onNavigate }: Props) {
  const [step,setStep] = useState(0);
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
    <section className="product-guide"><header><div className="brand"><span className="brand-mark">G</span><span>GoodJob</span></div><button aria-label="關閉產品導覽" onClick={onClose}>×</button></header><main><div className="guide-copy"><span className="page-kicker">{current.kicker} · {current.number} / 04</span><h2 id="guide-title">{current.title}</h2><p>{current.text}</p><div className="guide-actions"><button onClick={() => { onNavigate(current.view); onClose(); }}>{current.action} →</button>{step < steps.length - 1 && <button onClick={() => setStep(step + 1)}>下一步</button>}</div></div><div className={`guide-visual guide-${step}`} aria-hidden="true"><div className="guide-orbit" /><div className="guide-card card-a"><i /><b /><span /><span /><span /></div><div className="guide-card card-b"><i /><b /><span /><span /></div><em>{current.number}</em></div></main><footer><button disabled={step === 0} onClick={() => setStep(step - 1)}>←</button><div>{steps.map((_,index) => <button aria-label={`前往第 ${index + 1} 步`} className={index === step ? "active" : ""} key={index} onClick={() => setStep(index)} />)}</div><button disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>→</button></footer></section>
  </div>;
}
