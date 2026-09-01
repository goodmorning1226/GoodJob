"use client";

type Props = {
  onSelect: (audience: "user" | "business") => void;
  onShowGuide: () => void;
};

function TalentIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="16" r="8" />
      <path d="M10 40c1.4-8.2 6.1-12.4 14-12.4S36.6 31.8 38 40" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 40V14h20v26M28 22h12v18M5 40h38" />
      <path d="M14 21h3M21 21h3M14 27h3M21 27h3M14 33h3M21 33h3M34 28h2M34 34h2" />
    </svg>
  );
}

export default function AudienceGate({ onSelect, onShowGuide }: Props) {
  return (
    <main className="audience-gate">
      <div className="audience-gate-orbit orbit-a" />
      <div className="audience-gate-orbit orbit-b" />
      <section className="audience-gate-card">
        <header>
          <span className="brand-mark">G</span>
          <strong>GoodJob</strong>
          <button className="brand-guide-button" onClick={onShowGuide} aria-label="產品導覽"><span aria-hidden="true">?</span></button>
        </header>
        <div className="audience-gate-copy">
          <span className="page-kicker">CHOOSE YOUR VIEW</span>
          <h1>選擇你在 GoodJob 中的角色：</h1>
        </div>
        <div className="audience-choice-grid">
          <button onClick={() => onSelect("user")}>
            <span className="audience-choice-heading">
              <span className="audience-choice-icon"><TalentIcon /></span>
              <span><small>FOR TALENT</small><span className="audience-choice-title">我是人才</span></span>
            </span>
            <p>整理經驗、完善履歷，找到最適合自己的職缺</p>
          </button>
          <button onClick={() => onSelect("business")}>
            <span className="audience-choice-heading">
              <span className="audience-choice-icon business"><BusinessIcon /></span>
              <span><small>FOR COMPANY</small><span className="audience-choice-title">我是企業</span></span>
            </span>
            <p>發布職缺、輕鬆篩選履歷，找出適配人才</p>
          </button>
        </div>
      </section>
    </main>
  );
}
