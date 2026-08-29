"use client";

import { useState } from "react";

type Stage = "收藏" | "準備中" | "已投遞" | "面試中" | "結果";
type Application = { id:number; company:string; role:string; stage:Stage; fit:number; date:string; next:string; tone:string };

const seed: Application[] = [
  { id:1, company:"Orbit 數位產品", role:"Associate Product Manager", stage:"面試中", fit:82, date:"8/20 投遞", next:"8/29 一面", tone:"green" },
  { id:2, company:"Mori Lab", role:"UX Research Assistant", stage:"已投遞", fit:76, date:"8/24 投遞", next:"等待回覆", tone:"purple" },
  { id:3, company:"島嶼科技", role:"產品營運實習生", stage:"準備中", fit:71, date:"8/31 截止", next:"調整履歷", tone:"orange" },
  { id:4, company:"Flowday", role:"Junior Product Specialist", stage:"收藏", fit:68, date:"9/05 截止", next:"分析職缺", tone:"blue" },
  { id:5, company:"木星數位", role:"Product Intern", stage:"結果", fit:79, date:"7/18 面試", next:"已完成", tone:"gray" },
];
const stages: Stage[] = ["收藏","準備中","已投遞","面試中","結果"];

export default function ApplicationTracker() {
  const [applications,setApplications] = useState(seed);
  const [selected,setSelected] = useState<Application | null>(null);
  const [adding,setAdding] = useState(false);
  const [view,setView] = useState<"board"|"list">("board");
  const [query,setQuery] = useState("");
  const [newCompany,setNewCompany] = useState("");
  const [newRole,setNewRole] = useState("");

  const filtered = applications.filter((item) => `${item.company}${item.role}`.toLowerCase().includes(query.toLowerCase()));
  function advance(item: Application) { const index = stages.indexOf(item.stage); if(index >= stages.length - 1) return; const changed = {...item,stage:stages[index+1]}; setApplications((current) => current.map((app) => app.id === item.id ? changed : app)); setSelected(changed); }
  function create() { if(!newCompany.trim() || !newRole.trim()) return; setApplications((current) => [...current,{id:Date.now(),company:newCompany,role:newRole,stage:"收藏",fit:0,date:"剛剛新增",next:"分析職缺",tone:"green"}]); setNewCompany(""); setNewRole(""); setAdding(false); }

  return <section className="tracker-page page-enter"><header className="page-title-row"><div><span className="page-kicker">APPLICATION TRACKER</span><h1>求職追蹤</h1><p>把每個機會、準備事項與下一步放在同一個地方。</p></div><button className="add-button" onClick={() => setAdding(true)}>＋ 新增職缺</button></header>
    <div className="tracker-stats"><article><span>進行中的機會</span><strong>4</strong><small>比上週增加 1 個</small></article><article><span>本週待辦</span><strong>3</strong><small>最近：8/29 Orbit 一面</small></article><article><span>已投遞</span><strong>2</strong><small>回覆率 50%</small></article><article className="tracker-focus"><div><span>下一個重要行動</span><strong>準備 Orbit 產品面試</strong><small>還有 2 天 · 建議完成 3 題模擬練習</small></div><button>開始準備　→</button></article></div>
    <div className="tracker-toolbar"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋公司或職位" /></label><div><button className={view === "board" ? "active" : ""} onClick={() => setView("board")}>▦ 看板</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>☷ 清單</button></div></div>
    {view === "board" ? <div className="application-board">{stages.map((stage,index) => <section className={`application-column column-${index}`} key={stage}><header><div><i />{stage}<small>{filtered.filter((item) => item.stage === stage).length}</small></div><button>＋</button></header><div>{filtered.filter((item) => item.stage === stage).map((item) => <button className="application-card" key={item.id} onClick={() => setSelected(item)}><div><span className={`application-company ${item.tone}`}>{item.company.slice(0,1)}</span><b>{item.fit ? `${item.fit}%` : "NEW"}</b></div><small>{item.company}</small><strong>{item.role}</strong><p>{item.date}</p><footer><span>{item.next}</span><i>›</i></footer></button>)}{stage === "收藏" && <button className="column-add" onClick={() => setAdding(true)}>＋ 新增機會</button>}</div></section>)}</div> : <div className="application-table"><header><span>公司與職位</span><span>階段</span><span>符合度</span><span>下一步</span><span>更新</span></header>{filtered.map((item) => <button key={item.id} onClick={() => setSelected(item)}><span><i className={item.tone}>{item.company.slice(0,1)}</i><b>{item.role}<small>{item.company}</small></b></span><span>{item.stage}</span><span><b>{item.fit || "—"}{item.fit ? "%" : ""}</b></span><span>{item.next}</span><span>{item.date}</span></button>)}</div>}
    <div className="tracker-demo-note"><span>⌁</span><p><b>Prototype 資料</b>所有變更只存在這次瀏覽畫面，重新整理後會回到範例狀態。</p></div>

    {selected && <div className="application-detail-backdrop" onMouseDown={() => setSelected(null)}><aside className="application-detail" onMouseDown={(event) => event.stopPropagation()}><header><button onClick={() => setSelected(null)}>×</button><span className={`application-company ${selected.tone}`}>{selected.company.slice(0,1)}</span><small>{selected.company}</small><h2>{selected.role}</h2><div><span>{selected.stage}</span>{selected.fit > 0 && <b>{selected.fit}% 符合</b>}</div></header><main><section><h3>下一步</h3><div className="next-action-detail"><span>✓</span><div><strong>{selected.next}</strong><small>{selected.stage === "面試中" ? "2026/08/29　10:30 · 線上面試" : "建議在 2 天內完成"}</small></div></div></section><section><h3>申請進度</h3><div className="stage-progress">{stages.map((stage) => <span className={stages.indexOf(stage) <= stages.indexOf(selected.stage) ? "active" : ""} key={stage}><i>{stages.indexOf(stage) < stages.indexOf(selected.stage) ? "✓" : stages.indexOf(stage)+1}</i><small>{stage}</small></span>)}</div></section><section><h3>使用的履歷</h3><button className="attached-resume"><span>▤</span><div><strong>Associate Product Manager — Orbit</strong><small>ATS 經典版 · 今天 14:32 更新</small></div><b>查看</b></button></section><section><h3>準備筆記</h3><textarea defaultValue={selected.stage === "面試中" ? "研究 Orbit 的核心產品與近期更新\n準備使用者研究如何影響產品決策的案例\n反問：團隊目前如何衡量新功能成效？" : "記下公司研究、聯絡紀錄與面試重點…"} /></section></main><footer><button>封存</button>{stages.indexOf(selected.stage) < stages.length-1 && <button onClick={() => advance(selected)}>移到「{stages[stages.indexOf(selected.stage)+1]}」　→</button>}</footer></aside></div>}
    {adding && <div className="tracker-modal-backdrop" onMouseDown={() => setAdding(false)}><section className="tracker-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span className="page-kicker">NEW OPPORTUNITY</span><h2>新增求職機會</h2></div><button onClick={() => setAdding(false)}>×</button></header><label><span>公司名稱</span><input autoFocus value={newCompany} onChange={(event) => setNewCompany(event.target.value)} placeholder="例如：島嶼科技" /></label><label><span>職位名稱</span><input value={newRole} onChange={(event) => setNewRole(event.target.value)} placeholder="例如：Associate Product Manager" /></label><div className="tracker-modal-tip"><span>✦</span><p><b>之後可以補上職缺內容</b>Prototype 會使用範例規則產生符合度與準備建議，不會連接外部網站。</p></div><footer><button onClick={() => setAdding(false)}>取消</button><button className="primary-flow-button" disabled={!newCompany.trim() || !newRole.trim()} onClick={create}>加入追蹤</button></footer></section></div>}
  </section>;
}
