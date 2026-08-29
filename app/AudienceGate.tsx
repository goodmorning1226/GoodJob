"use client";

type Props = { onSelect: (audience: "user" | "business") => void };

export default function AudienceGate({ onSelect }: Props) {
  return <main className="audience-gate">
    <div className="audience-gate-orbit orbit-a" /><div className="audience-gate-orbit orbit-b" />
    <section className="audience-gate-card">
      <header><span className="brand-mark">G</span><strong>GoodJob</strong><small>雙邊職涯媒合 Prototype</small></header>
      <div className="audience-gate-copy"><span className="page-kicker">CHOOSE YOUR VIEW</span><h1>今天想從哪一個角度<br />探索 GoodJob？</h1><p>兩種角色共用以經驗證據為核心的媒合邏輯，但看到的工具與流程不同。</p></div>
      <div className="audience-choice-grid">
        <button onClick={() => onSelect("user")}><span className="audience-choice-icon">◇</span><small>FOR TALENT</small><h2>我是使用者</h2><p>整理經驗、建立公開 Profile、探索職缺並製作履歷。</p><strong>進入使用者工作台　→</strong><i>9 段經驗 · 18 項技能證據</i></button>
        <button onClick={() => onSelect("business")}><span className="audience-choice-icon business">▦</span><small>FOR COMPANY</small><h2>我是企業方</h2><p>發布職缺、用條件或 AI 尋找人才，查看公開資料並發出邀約。</p><strong>進入企業人才台　→</strong><i>12 位公開人才 · 2 個職缺</i></button>
      </div>
      <footer><span>✦</span>Prototype 使用本機展示資料，不會呼叫付費 API</footer>
    </section>
  </main>;
}
