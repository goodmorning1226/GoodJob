"use client";

import { useState } from "react";

const resources = [
  { type: "指南", icon: "◎", title: "第一次產品面試：從自我介紹到案例題", description: "用 30 分鐘掌握 APM 常見流程、回答結構與面試前檢查表。", meta: "約 8 分鐘", tag: "為你推薦", tone: "green" },
  { type: "練習", icon: "◇", title: "把經驗改寫成 STAR 故事", description: "從你的競賽與實習經驗，練習組織具體、有證據的面試回答。", meta: "3 個練習", tag: "符合目前階段", tone: "purple" },
  { type: "工具包", icon: "▤", title: "產品職缺研究筆記模板", description: "整理公司、產品、使用者與商業模式，準備有品質的反問問題。", meta: "可複製模板", tag: "面試準備", tone: "orange" },
  { type: "指南", icon: "↗", title: "從研究經驗轉譯產品能力", description: "把訪談、分析與提案成果連接到產品經理重視的能力語言。", meta: "約 6 分鐘", tag: "能力轉譯", tone: "blue" },
  { type: "清單", icon: "✓", title: "面試前 24 小時檢查表", description: "確認作品、履歷版本、面試連結與三個最想傳達的重點。", meta: "10 個步驟", tag: "快速完成", tone: "green" },
  { type: "案例", icon: "⌁", title: "如何回答：你如何定義問題？", description: "拆解優秀回答的推理順序，並辨識容易流於空泛的說法。", meta: "含回答示例", tag: "案例題", tone: "purple" },
];

const questions = [
  "請用 90 秒介紹你自己，以及為什麼想往產品經理發展？",
  "分享一次你從模糊需求中找出真正問題的經驗。",
  "當團隊對優先順序意見不同時，你會如何推進決策？",
];

export default function CareerResources() {
  const [tab, setTab] = useState<"resources" | "practice">("resources");
  const [filter, setFilter] = useState("全部");
  const [saved, setSaved] = useState([1, 4]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [detail, setDetail] = useState<number | null>(null);

  const visible = filter === "全部" ? resources : resources.filter((item) => item.type === filter);

  return <section className="resource-page page-enter">
    <header className="page-title-row"><div><span className="page-kicker">CAREER GROWTH</span><h1>職涯資源</h1><p>不是更多文章，而是配合你目前求職階段的下一個練習。</p></div><div className="resource-tabs"><button className={tab === "resources" ? "active" : ""} onClick={() => setTab("resources")}>學習資源</button><button className={tab === "practice" ? "active" : ""} onClick={() => setTab("practice")}>面試練習</button></div></header>

    {tab === "resources" ? <>
      <article className="learning-hero"><div><span className="soft-label">本週學習路徑</span><h2>準備好把你的產品潛力<br />說得更具體。</h2><p>根據你的目標職缺與現有經驗，建議先完成一段自我介紹，再練習把使用者研究連結到產品決策。</p><div><button onClick={() => setTab("practice")}>開始 10 分鐘練習　→</button><span><b>2 / 5</b>　本週進度</span></div></div><div className="learning-path"><span className="done">✓<i>盤點核心經驗</i></span><b /><span className="current">02<i>練習自我介紹</i></span><b /><span>03<i>準備案例故事</i></span><b /><span>04<i>研究目標公司</i></span></div></article>
      <div className="resource-summary"><div><span>今日建議</span><strong>10<small>分鐘</small></strong><p>完成一題面試練習</p></div><div><span>已完成</span><strong>7<small>項</small></strong><p>本月新增 3 項</p></div><div><span>已收藏</span><strong>{saved.length}<small>份</small></strong><p>稍後繼續閱讀</p></div><div className="focus-skill"><span>目前強化重點</span><strong>產品思維與表達</strong><div><i style={{width:"68%"}} /></div></div></div>
      <div className="resource-toolbar"><div>{["全部","指南","練習","工具包","案例","清單"].map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><button>☆ 僅看收藏</button></div>
      <div className="resource-grid">{visible.map((item) => { const index = resources.indexOf(item); return <article className="resource-card" key={item.title}><div className={`resource-icon ${item.tone}`}>{item.icon}</div><button className={saved.includes(index) ? "saved" : ""} aria-label="收藏資源" onClick={() => setSaved((current) => current.includes(index) ? current.filter((value) => value !== index) : [...current,index])}>{saved.includes(index) ? "★" : "☆"}</button><small>{item.type}　·　{item.meta}</small><h3>{item.title}</h3><p>{item.description}</p><footer><span>{item.tag}</span><button onClick={() => setDetail(index)}>開始閱讀　→</button></footer></article>})}</div>
    </> : <div className="practice-layout">
      <main className="practice-stage"><header><div><span className="flow-kicker">MOCK INTERVIEW</span><h2>產品經理基礎面試</h2></div><span>題目 {questionIndex + 1} / {questions.length}</span></header><div className="interviewer"><span>路</span><div><small>GOODJOB 面試教練</small><p>{questions[questionIndex]}</p></div></div><label><span>你的回答</span><textarea value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(false); }} placeholder="先寫下你會怎麼回答。這只是本機練習，不會上傳或送出。" /><small>{answer.length} 字　·　建議 150–300 字</small></label>{feedback && <section className="practice-feedback"><header><span>✦</span><div><small>即時回饋</small><strong>方向清楚，再補一個具體影響會更有說服力</strong></div></header><div><article><b>做得好的地方</b><p>你有連接研究經驗與產品動機，脈絡自然，也沒有加入無法證實的成果。</p></article><article><b>可以再加強</b><p>補上「洞察如何改變決策」及一個量化結果，結尾再明確連回目標職位。</p></article></div></section>}<footer><button onClick={() => { setAnswer(""); setFeedback(false); setQuestionIndex((questionIndex + 1) % questions.length); }}>換一題</button><button className="primary-flow-button" disabled={answer.trim().length < 20} onClick={() => setFeedback(true)}>取得回饋</button></footer></main>
      <aside className="practice-sidebar"><section><span className="soft-label">回答架構</span><h3>動機 → 證據 → 連結</h3><ol><li><b>01</b><span><strong>現在的你</strong>一句話定位與目標</span></li><li><b>02</b><span><strong>關鍵證據</strong>選 1–2 段相關經驗</span></li><li><b>03</b><span><strong>為何適合</strong>連回職缺與下一步</span></li></ol></section><section><span className="soft-label">可使用的經驗</span><button><i>實習</i><span><strong>產品實習生</strong><small>使用者研究 · 需求分析</small></span><b>＋</b></button><button><i>競賽</i><span><strong>創新商業競賽</strong><small>市場研究 · 提案溝通</small></span><b>＋</b></button></section><div className="local-note"><span>⌁</span><p><b>純 Prototype 練習</b>回饋由預設規則模擬，不會呼叫 AI 或儲存回答。</p></div></aside>
    </div>}

    {detail !== null && <div className="resource-detail-backdrop" onMouseDown={() => setDetail(null)}><article className="resource-detail" onMouseDown={(event) => event.stopPropagation()}><header><div><small>{resources[detail].type}　·　{resources[detail].meta}</small><h2>{resources[detail].title}</h2></div><button onClick={() => setDetail(null)}>×</button></header><div><p className="lead">真正有說服力的面試回答，不是背出標準答案，而是讓對方看見你如何思考、採取行動，以及從結果中學到了什麼。</p><h3>開始前，先選一段最有關聯的經驗</h3><p>對 APM 職缺而言，你的產品實習與校園 App 專案最適合作為主要案例。每個回答只需要一個清楚的重點，避免一次塞進所有經歷。</p><div className="article-example"><span>回答提示</span><b>「當時團隊面對＿＿問題，我負責＿＿；透過＿＿，最後讓＿＿產生改變。」</b></div><h3>完成後自我檢查</h3><ul><li>是否說清楚你個人的角色，而不是只描述團隊？</li><li>是否包含決策依據、具體行動或可以驗證的成果？</li><li>是否能連回目標職位真正需要的能力？</li></ul></div><footer><button onClick={() => setDetail(null)}>完成閱讀</button><button onClick={() => { setDetail(null); setTab("practice"); }}>用面試題練習　→</button></footer></article></div>}
  </section>;
}
