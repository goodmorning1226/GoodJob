"use client";

import { useMemo, useState } from "react";
import type { NewExperience } from "./ExperienceFlow";
import ExperienceEvidence, { readEvidence, type EvidenceItem } from "./ExperienceEvidence";

type Props = { experiences: NewExperience[]; onAdd: () => void };

const completeness = [92, 88, 83, 76, 81, 68, 74, 65];

export default function ExperienceLibrary({ experiences, onAdd }: Props) {
  const [view, setView] = useState<"cards" | "timeline">("cards");
  const [type, setType] = useState("全部");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NewExperience | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);

  function openExperience(item: NewExperience) {
    setSelected(item);
    setEvidenceItems(readEvidence()[item.title] || []);
  }

  const filtered = useMemo(() => experiences.filter((item) => {
    const matchesType = type === "全部" || item.type === type;
    const text = `${item.title} ${item.org} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    return matchesType && text.includes(query.toLowerCase());
  }), [experiences, query, type]);

  const types = ["全部", "工作", "實習", "修課", "專案", "競賽", "社團", "研究"];

  return (
    <section className="library-page page-enter">
      <header className="page-title-row">
        <div><span className="page-kicker">EXPERIENCE LIBRARY</span><h1>我的經驗</h1><p>每一段做過的事，都能成為下一個機會的證據。</p></div>
        <button className="add-button" onClick={onAdd}>＋ 新增經驗</button>
      </header>

      <section className="library-summary">
        <div><strong>{experiences.length}</strong><span>累積經驗</span><small>橫跨 {new Set(experiences.map((item) => item.type)).size} 種情境</small></div>
        <div><strong>18</strong><span>已確認技能</span><small>6 項證據充分</small></div>
        <div><strong>6</strong><span>量化成果</span><small>2 項仍可補強</small></div>
        <div className="coverage-box"><span>資料覆蓋度</span><strong>72%</strong><i><b /></i></div>
      </section>

      <div className="library-toolbar">
        <label className="library-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋經驗、技能或成果" /></label>
        <div className="type-filters">{types.map((item) => <button className={type === item ? "active" : ""} key={item} onClick={() => setType(item)}>{item}</button>)}</div>
        <div className="view-toggle"><button className={view === "cards" ? "active" : ""} onClick={() => setView("cards")} aria-label="卡片檢視">▦</button><button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")} aria-label="時間軸檢視">≡</button></div>
      </div>

      {filtered.length === 0 ? <div className="empty-library"><span>⌕</span><h3>沒有符合的經驗</h3><p>試試其他關鍵字或分類。</p></div> : view === "cards" ? (
        <div className="experience-card-grid">
          {filtered.map((item, index) => <button className="library-card" key={`${item.title}-${index}`} onClick={() => openExperience(item)}>
            <div className="library-card-top"><span className="type-badge" style={{ color: item.color, background: `${item.color}16` }}>{item.type}</span><span className="card-date">{item.date}</span></div>
            <span className="card-org">{item.org}</span><h3>{item.title}</h3><p>{item.description}</p>
            <div className="library-tags">{item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="card-completeness"><span>資料完整度</span><strong>{item.completeness ?? completeness[index % completeness.length]}%</strong><i><b style={{ width: `${item.completeness ?? completeness[index % completeness.length]}%` }} /></i></div>
            <div className="library-card-footer"><span><b>✓</b> 已確認</span><span>{(readEvidence()[item.title] || []).length ? `${(readEvidence()[item.title] || []).length} 項成果證據` : "查看內容　→"}</span></div>
          </button>)}
          <button className="add-experience-card" onClick={onAdd}><span>＋</span><strong>記下一段新經驗</strong><small>不用整理好，先寫下來就可以</small></button>
        </div>
      ) : (
        <div className="library-timeline">
          {["2026", "2025", "2024", "2023"].map((year) => {
            const items = filtered.filter((item) => item.date.includes(year));
            if (!items.length) return null;
            return <div className="timeline-year" key={year}><strong>{year}</strong><div>{items.map((item, index) => <button key={`${item.title}-${index}`} onClick={() => openExperience(item)}><i style={{ background: item.color }} /><span><small>{item.type} · {item.org}</small><b>{item.title}</b><em>{item.description}</em><span className="library-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</span></span><span className="timeline-arrow">→</span></button>)}</div></div>;
          })}
        </div>
      )}

      <footer className="results-footer">顯示 {filtered.length} 段經驗 · 所有內容皆為 Prototype 展示資料</footer>

      {selected && <div className="detail-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
        <aside className="experience-detail" role="dialog" aria-modal="true" aria-label={`${selected.title} 詳情`}>
          <header><div><span className="type-badge" style={{ color: selected.color, background: `${selected.color}16` }}>{selected.type}</span><small>{selected.date}</small></div><button onClick={() => setSelected(null)} aria-label="關閉詳情">×</button></header>
          <div className="detail-body"><span className="card-org">{selected.org}</span><h2>{selected.title}</h2><p className="detail-summary">{selected.description}</p>{selected.completeness !== undefined && <div className="detail-completeness-note"><span>內容完整度</span><strong>{selected.completeness}%</strong><small>{selected.missingSchemaFields?.length ? selected.missingSchemaFields.length + " 個欄位仍可補充" : "必要資訊已完整"}</small></div>}
            <section><h3>經驗結構</h3><dl><div><dt>背景</dt><dd>團隊需要在有限時間內理解使用者需求，並提出可落地的改善方案。</dd></div><div><dt>我的角色</dt><dd>負責研究規劃、洞察整理與提案溝通。</dd></div><div><dt>主要行動</dt><dd>規劃訪談、整理問題模式，並將發現轉化為具體設計方向。</dd></div><div><dt>成果</dt><dd>{selected.description}</dd></div></dl></section>
            <section><h3>技能與證據</h3><div className="detail-skills">{selected.tags.map((tag) => <span key={tag}><b>✓</b>{tag}<small>有經驗支持</small></span>)}</div></section>
            <section className="detail-evidence-section"><div><h3>成果與附件</h3><button onClick={() => setShowEvidence(true)}>＋ 加入成果</button></div>{evidenceItems.length ? <div className="detail-evidence-list">{evidenceItems.slice(0,3).map((item) => <button key={item.id} onClick={() => setShowEvidence(true)}><span>{item.type.includes("獎") ? "◇" : item.type.includes("簡報") ? "▤" : "≡"}</span><div><strong>{item.name}</strong><small>{item.type} · 已納入技能分析</small></div><b>✓</b></button>)}</div> : <button className="detail-evidence-empty" onClick={() => setShowEvidence(true)}><span>▤</span><div><strong>加入簡報、獎狀或專案報告</strong><small>讓成果與技能分析有更多可追溯證據</small></div><b>→</b></button>}</section>
            <section className="detail-output"><h3>履歷敘述</h3><p>• {selected.description}</p><small>這段文字只根據已確認內容整理</small></section>
          </div>
          <footer><button>編輯經驗</button><button className="primary-flow-button">加入履歷</button></footer>
        </aside>
      </div>}
      {selected && showEvidence && <ExperienceEvidence experience={selected} onClose={() => setShowEvidence(false)} onSaved={setEvidenceItems} />}
    </section>
  );
}
