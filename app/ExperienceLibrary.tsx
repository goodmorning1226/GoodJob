"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewExperience } from "./ExperienceFlow";
import ExperienceEvidence, { readEvidence, type EvidenceItem } from "./ExperienceEvidence";

type Props = { experiences: NewExperience[]; onAdd: () => void };

const typeFilterTone: Record<string, string> = {
  "全部": "all",
  "正職": "work",
  "工作": "work",
  "實習": "internship",
  "修課": "course",
  "專案": "project",
  "競賽": "competition",
  "社團": "club",
  "研究": "research",
  "其他": "other",
};

export default function ExperienceLibrary({ experiences, onAdd }: Props) {
  const [view, setView] = useState<"cards" | "timeline">("cards");
  const [type, setType] = useState("全部");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NewExperience | null>(null);
  const [isClosingDetail, setIsClosingDetail] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);

  function openExperience(item: NewExperience) {
    setIsClosingDetail(false);
    setSelected(item);
    setEvidenceItems(readEvidence()[item.title] || []);
  }

  function closeExperience() {
    if (!selected || isClosingDetail) return;
    setIsClosingDetail(true);
    setShowEvidence(false);
    window.setTimeout(() => {
      setSelected(null);
      setIsClosingDetail(false);
    }, 250);
  }

  useEffect(() => {
    if (!selected) return;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [selected]);

  const filtered = useMemo(() => experiences.filter((item) => {
    const knownTypes = ["正職", "工作", "實習", "修課", "專案", "競賽", "社團", "研究"];
    const matchesType = type === "全部"
      || (type === "正職" && ["正職", "工作"].includes(item.type))
      || (type === "其他" && !knownTypes.includes(item.type))
      || item.type === type;
    const text = `${item.title} ${item.org} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    return matchesType && text.includes(query.toLowerCase());
  }), [experiences, query, type]);

  const types = ["全部", "正職", "實習", "修課", "專案", "競賽", "社團", "研究", "其他"];
  const knownTypes = ["正職", "工作", "實習", "修課", "專案", "競賽", "社團", "研究"];

  function getTypeCount(filterType: string) {
    if (filterType === "全部") return experiences.length;
    if (filterType === "正職") return experiences.filter((item) => ["正職", "工作"].includes(item.type)).length;
    if (filterType === "其他") return experiences.filter((item) => !knownTypes.includes(item.type)).length;
    return experiences.filter((item) => item.type === filterType).length;
  }

  return (
    <section className="library-page page-enter">
      <header className="page-title-row">
        <div><span className="page-kicker">EXPERIENCE LIBRARY</span><h1>我的經驗</h1><p>從經驗中整理能力，為下一個機會做好準備。</p></div>
        <div className="library-header-actions">
          <label className="library-search library-header-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋經驗、技能或成果" /></label>
          <button className="add-button" onClick={onAdd}>＋ 新增經驗</button>
        </div>
      </header>

      <div className="library-toolbar">
        <div className="type-filters">{types.map((item) => <button className={`${type === item ? "active " : ""}type-filter-${typeFilterTone[item]}`} key={item} onClick={() => setType(item)}>{item}（{getTypeCount(item)}）</button>)}</div>
        <div className="view-toggle"><button className={view === "cards" ? "active" : ""} onClick={() => setView("cards")} aria-label="卡片檢視"><svg className="nine-grid-icon" viewBox="0 0 17 17" aria-hidden="true"><rect x="1" y="1" width="4" height="4" rx=".6" /><rect x="6.5" y="1" width="4" height="4" rx=".6" /><rect x="12" y="1" width="4" height="4" rx=".6" /><rect x="1" y="6.5" width="4" height="4" rx=".6" /><rect x="6.5" y="6.5" width="4" height="4" rx=".6" /><rect x="12" y="6.5" width="4" height="4" rx=".6" /><rect x="1" y="12" width="4" height="4" rx=".6" /><rect x="6.5" y="12" width="4" height="4" rx=".6" /><rect x="12" y="12" width="4" height="4" rx=".6" /></svg></button><button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")} aria-label="時間軸檢視">≡</button></div>
      </div>

      {view === "cards" ? (
        <div className="experience-card-grid">
          {filtered.map((item, index) => <button className="library-card" key={`${item.title}-${index}`} onClick={() => openExperience(item)}>
            <div className="library-card-top"><span className={`type-badge experience-type-${typeFilterTone[item.type] ?? "other"}`}>{item.type === "工作" ? "正職" : item.type}</span><span className="card-date">{item.date}</span></div>
            <span className="card-org">{item.org}</span><h3>{item.title}</h3><p>{item.description}</p>
            <div className="library-tags">{item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
          </button>)}
          <button className="add-experience-card" onClick={onAdd}><span>＋</span><strong>記下一段新經驗</strong><small>不用整理好，先寫下來就可以</small></button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-library"><span>⌕</span><h3>沒有符合的經驗</h3><p>試試其他關鍵字或分類。</p></div>
      ) : (
        <div className="library-timeline">
          {["2026", "2025", "2024", "2023"].map((year) => {
            const items = filtered.filter((item) => item.date.includes(year));
            if (!items.length) return null;
            return <div className="timeline-year" key={year}><strong>{year}</strong><div>{items.map((item, index) => <button key={`${item.title}-${index}`} onClick={() => openExperience(item)}><i style={{ background: `var(--type-${typeFilterTone[item.type] ?? "other"})` }} /><span><small><span className={`timeline-type-badge experience-type-${typeFilterTone[item.type] ?? "other"}`}>{item.type === "工作" ? "正職" : item.type}</span><span className="timeline-org">{item.org}</span></small><b>{item.title}</b><em>{item.description}</em><span className="library-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</span></span><span className="timeline-arrow">→</span></button>)}</div></div>;
          })}
        </div>
      )}

      {selected && <div className={`detail-backdrop${isClosingDetail ? " closing" : ""}`} onMouseDown={(event) => event.target === event.currentTarget && closeExperience()}>
        <aside className="experience-detail" role="dialog" aria-modal="true" aria-label={`${selected.title} 詳情`}>
          <header><div className="detail-header-copy"><div className="detail-header-meta"><span className={`type-badge experience-type-${typeFilterTone[selected.type] ?? "other"}`}>{selected.type === "工作" ? "正職" : selected.type}</span><small>{selected.date}</small></div><div className="detail-header-title"><span>{selected.org}</span><strong>{selected.title}</strong></div></div><button onClick={closeExperience} aria-label="關閉詳情">×</button></header>
          <div className="detail-body">
            <section><h3>經驗結構</h3><dl><div><dt>項目背景</dt><dd>團隊需要在有限時間內理解使用者需求，並提出可落地的改善方案。</dd></div><div><dt>我的角色</dt><dd>負責研究規劃、洞察整理與提案溝通。</dd></div><div><dt>主要行動</dt><dd>規劃訪談、整理問題模式，並將發現轉化為具體設計方向。</dd></div><div><dt>具體成果</dt><dd>{selected.description}</dd></div></dl></section>
            <section><h3>技能與證據</h3><div className="detail-skills">{selected.tags.map((tag) => <span key={tag}><b>✓</b>{tag}<small>有經驗支持</small></span>)}</div></section>
            <section className="detail-evidence-section"><div><h3>成果與附件</h3><button onClick={() => setShowEvidence(true)}>＋ 加入成果</button></div>{evidenceItems.length ? <div className="detail-evidence-list">{evidenceItems.slice(0,3).map((item) => <button key={item.id} onClick={() => setShowEvidence(true)}><span>{item.type.includes("獎") ? "◇" : item.type.includes("簡報") ? "▤" : "≡"}</span><div><strong>{item.name}</strong><small>{item.type} · 已納入技能分析</small></div><b>✓</b></button>)}</div> : <div className="detail-evidence-empty"><span>▤</span><div><strong>尚無成果附件</strong><small>加入成果，讓能力與成果有更多可追溯證據</small></div></div>}</section>
            <section className="detail-output"><div className="detail-output-heading"><h3>履歷敘述</h3><small>這段文字只根據已確認內容整理</small></div><p>• {selected.description}</p></section>
          </div>
          <footer><button>編輯經驗</button><button className="primary-flow-button">加入履歷</button></footer>
        </aside>
      </div>}
      {selected && showEvidence && <ExperienceEvidence experience={selected} onClose={() => setShowEvidence(false)} onSaved={setEvidenceItems} />}
    </section>
  );
}
