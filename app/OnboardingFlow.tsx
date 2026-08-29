"use client";

import { useState } from "react";

type Props = { onClose: () => void; onComplete: () => void };

export default function OnboardingFlow({ onClose, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState("大學生／應屆畢業生");
  const [goals, setGoals] = useState(["整理過往經驗", "準備求職履歷"]);
  const [role, setRole] = useState("產品經理");
  const [location, setLocation] = useState("台北市");
  const [workMode, setWorkMode] = useState("混合辦公");

  function toggleGoal(goal: string) {
    setGoals((current) => current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]);
  }

  return (
    <div className="flow-overlay onboarding-overlay" role="dialog" aria-modal="true" aria-label="初始設定">
      <div className="onboarding-shell">
        <header className="onboarding-header"><div className="brand"><span className="brand-mark">G</span><span>GoodJob</span></div><button className="flow-close" onClick={onClose} aria-label="關閉初始設定">×</button></header>
        <div className="onboarding-progress"><span style={{ width: `${step * 25}%` }} /></div>

        <section className="onboarding-content">
          {step === 1 && <>
            <span className="flow-kicker">01 · 關於你</span><h2>你現在正處於哪個階段？</h2><p>這會影響 GoodJob 建議你優先整理的經驗類型。</p>
            <div className="identity-grid">{[
              ["大學生／應屆畢業生", "課程、競賽、社團與實習"], ["職場工作者", "工作成果、專案與職責變化"], ["準備轉職", "可轉移能力與目標職缺"], ["仍在探索", "從生活經驗發現方向"],
            ].map(([name, note]) => <button className={identity === name ? "selected" : ""} key={name} onClick={() => setIdentity(name)}><span>{identity === name ? "✓" : "○"}</span><strong>{name}</strong><small>{note}</small></button>)}</div>
          </>}

          {step === 2 && <>
            <span className="flow-kicker">02 · 你的目標</span><h2>你最想先完成什麼？</h2><p>可以複選；之後也能隨時調整。</p>
            <div className="goal-grid">{["整理過往經驗", "準備求職履歷", "探索職涯方向", "分析目標職缺", "準備面試", "建立作品集"].map((goal) => <button className={goals.includes(goal) ? "selected" : ""} key={goal} onClick={() => toggleGoal(goal)}><span>{goals.includes(goal) ? "✓" : "+"}</span>{goal}</button>)}</div>
          </>}

          {step === 3 && <>
            <span className="flow-kicker">03 · 發展方向</span><h2>下一步，你想往哪裡走？</h2><p>先有一個暫時方向就好，不需要現在決定整段職涯。</p>
            <label className="large-field"><span>希望發展的職位</span><input value={role} onChange={(event) => setRole(event.target.value)} /></label>
            <div className="suggestion-row"><span>熱門選擇</span>{["產品經理", "UX 研究員", "資料分析師", "行銷企劃"].map((item) => <button key={item} onClick={() => setRole(item)}>{item}</button>)}</div>
            <div className="preference-row"><label><span>希望工作地點</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option>台北市</option><option>新北市</option><option>新竹市</option><option>不限地點</option></select></label><label><span>工作型態</span><select value={workMode} onChange={(event) => setWorkMode(event.target.value)}><option>混合辦公</option><option>公司辦公</option><option>遠端工作</option><option>皆可</option></select></label></div>
          </>}

          {step === 4 && <div className="onboarding-finish">
            <span className="finish-mark">✓</span><span className="flow-kicker">設定完成</span><h2>你的職涯工作台準備好了</h2><p>GoodJob 會先協助你整理經驗，再逐步建立專屬於你的職涯全貌。</p>
            <div className="setup-summary"><div><small>目前階段</small><strong>{identity}</strong></div><div><small>優先目標</small><strong>{goals.slice(0, 2).join("、")}</strong></div><div><small>目標方向</small><strong>{role} · {location} · {workMode}</strong></div></div>
          </div>}
        </section>

        <footer className="onboarding-footer"><button className="text-button" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>{step === 1 ? "稍後設定" : "← 上一步"}</button>{step < 4 ? <button className="primary-flow-button" onClick={() => setStep(step + 1)}>繼續 <span>→</span></button> : <button className="primary-flow-button" onClick={onComplete}>開始使用 GoodJob <span>→</span></button>}</footer>
      </div>
    </div>
  );
}
