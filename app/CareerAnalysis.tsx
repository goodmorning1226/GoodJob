"use client";

import { useEffect, useState } from "react";
import type { NewExperience } from "./ExperienceFlow";
import { readEvidence } from "./ExperienceEvidence";

type Props = { experiences: NewExperience[]; onAdd: () => void };

const skillGroups = {
  "核心能力": [
    ["使用者研究", 92, "4 段經驗", "證據充分"], ["產品企劃", 84, "3 段經驗", "證據充分"], ["資料分析", 72, "3 段經驗", "持續成長"], ["簡報溝通", 68, "4 段經驗", "證據充分"], ["跨部門協作", 55, "2 段經驗", "待補充"],
  ],
  "工具技能": [["Figma", 88, "3 段經驗", "證據充分"], ["Excel", 70, "2 段經驗", "有部分證據"], ["GA4", 46, "1 段經驗", "待補充"]],
  "領域知識": [["數位產品", 86, "4 段經驗", "證據充分"], ["教育科技", 61, "2 段經驗", "有部分證據"], ["校園服務", 78, "3 段經驗", "證據充分"]],
};

export default function CareerAnalysis({ experiences, onAdd }: Props) {
  const [skillGroup, setSkillGroup] = useState<keyof typeof skillGroups>("核心能力");
  const [insight, setInsight] = useState(0);
  const [copied, setCopied] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [evidenceSkills, setEvidenceSkills] = useState<string[]>([]);

  useEffect(() => {
    const items = Object.values(readEvidence()).flat();
    setEvidenceCount(items.length);
    setEvidenceSkills([...new Set(items.flatMap((item) => item.skills))]);
  }, []);

  function copySummary() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const insights = [
    { label: "主要優勢", icon: "↗", title: "把研究洞察轉成產品方向", text: "你在 4 段不同經驗中都完成了從問題探索、洞察整理到方案提出的流程，這是目前證據最完整的能力組合。", source: "來自產品實習、商業競賽與 2 個課程專案" },
    { label: "可轉移能力", icon: "⌁", title: "從簡報溝通延伸到跨部門協作", text: "你多次負責提案與成果呈現。若補充如何協調不同意見，這些經驗可進一步支持跨部門協作能力。", source: "來自競賽提案、社團活動與實習成果發表" },
    { label: "建議補強", icon: "＋", title: "為資料分析補上決策影響", text: "目前記錄了分析方法，但較少描述分析結果如何影響產品或團隊決策。補充一項前後差異會更有說服力。", source: "檢視 3 段含資料分析的經驗" },
  ];

  return (
    <section className="analysis-page page-enter">
      <header className="page-title-row">
        <div><span className="page-kicker">CAREER OVERVIEW</span><h1>職涯分析</h1><p>從所有經驗中，看見你的能力如何累積與改變。</p></div>
        <div className="analysis-updated"><span>✓</span><div><small>分析已更新</small><strong>{experiences.length} 段經驗 · {evidenceCount} 項附件證據</strong></div></div>
      </header>

      <article className="analysis-hero">
        <div className="analysis-hero-copy"><span className="soft-label">你的職涯摘要</span><h2>以使用者洞察為起點，<br />逐步走向產品決策與影響力。</h2><p>具備使用者研究、產品企劃與資料分析經驗，能從模糊問題中整理需求，透過訪談與原型驗證提出具體方向。近兩年的經驗顯示，你正從單點任務執行逐漸走向完整流程的規劃與負責。</p><div><button onClick={copySummary}>{copied ? "✓ 已複製" : "複製職涯摘要"}</button><button onClick={onAdd}>補充新經驗　＋</button></div></div>
        <div className="career-compass" aria-label="職涯能力組合"><div className="compass-ring ring-a" /><div className="compass-ring ring-b" /><div className="compass-core"><strong>18</strong><span>項能力</span></div><span className="axis axis-one">洞察</span><span className="axis axis-two">溝通</span><span className="axis axis-three">執行</span></div>
      </article>

      <section className="analysis-stats"><div><small>累積經驗</small><strong>{experiences.length}<span>段</span></strong><p>涵蓋專案、實習與競賽</p></div><div><small>發展時間</small><strong>4<span>年</span></strong><p>從探索到專業深化</p></div><div><small>證據充分技能</small><strong>{6 + Math.min(evidenceSkills.length,3)}<span>項</span></strong><p>{evidenceCount ? `附件再支持 ${evidenceSkills.length} 項技能` : "出現在多個不同情境"}</p></div><div><small>代表性成果</small><strong>{5 + evidenceCount}<span>項</span></strong><p>{evidenceCount ? `${evidenceCount} 項來自附件解析` : "具備數據或作品證明"}</p></div></section>
      {evidenceCount > 0 && <article className="attachment-analysis-banner"><span>▤</span><div><small>ATTACHMENT EVIDENCE</small><h3>成果附件已加入這次分析</h3><p>新辨識的技能包含 {evidenceSkills.slice(0,4).join("、")}；所有判斷都能回到原經歷與附件名稱。</p></div><b>{evidenceCount} 項證據　✓</b></article>}

      <section className="analysis-grid">
        <article className="analysis-panel skill-evidence-panel">
          <div className="analysis-panel-header"><div><span className="page-kicker">SKILL EVIDENCE</span><h3>技能與證據</h3></div><button>查看全部技能　→</button></div>
          <div className="analysis-tabs">{Object.keys(skillGroups).map((group) => <button className={skillGroup === group ? "active" : ""} key={group} onClick={() => setSkillGroup(group as keyof typeof skillGroups)}>{group}</button>)}</div>
          <div className="evidence-skill-list">{skillGroups[skillGroup].map(([name, score, sources, status], index) => <button key={String(name)}>
            <span className="skill-number">{String(index + 1).padStart(2, "0")}</span><span className="skill-name"><strong>{name}</strong><small>{sources}</small></span><span className="analysis-skill-bar"><i style={{ width: `${score}%` }} /></span><span className={`evidence-status status-${index > 3 ? "weak" : index > 1 ? "growing" : "strong"}`}>{status}</span><span>›</span>
          </button>)}</div>
        </article>

        <article className="analysis-panel distribution-panel">
          <div className="analysis-panel-header"><div><span className="page-kicker">EXPERIENCE MIX</span><h3>經驗分布</h3></div></div>
          <div className="distribution-chart"><div className="donut"><span><strong>{experiences.length}</strong>段經驗</span></div><ul><li><i className="c-one" /><span>專案</span><b>38%</b></li><li><i className="c-two" /><span>實習／工作</span><b>25%</b></li><li><i className="c-three" /><span>競賽</span><b>13%</b></li><li><i className="c-four" /><span>社團／其他</span><b>24%</b></li></ul></div>
          <p className="distribution-note"><span>✦</span>你的經驗以實作專案為主，已具備明確方向；下一步可增加真實商業情境中的成果證據。</p>
        </article>
      </section>

      <article className="analysis-panel growth-panel">
        <div className="analysis-panel-header"><div><span className="page-kicker">GROWTH TIMELINE</span><h3>能力發展軌跡</h3></div><span className="growth-legend"><i />責任與影響範圍</span></div>
        <div className="growth-track"><div className="growth-line"><span style={{ height: "28%" }} /><span style={{ height: "43%" }} /><span style={{ height: "66%" }} /><span style={{ height: "88%" }} /></div>{[
          ["2023", "開始探索", "課程中首次進行訪談與資料整理", "參與者"], ["2024", "方法建立", "獨立規劃研究並完成互動原型", "執行者"], ["2025", "跨域整合", "將研究洞察轉為產品與提案方向", "規劃者"], ["2026", "擴大影響", "主導完整流程並協調團隊推進", "負責人"],
        ].map(([year, stage, text, role], index) => <div className={`growth-node node-${index + 1}`} key={year}><span>{year}</span><i /><div><small>{role}</small><strong>{stage}</strong><p>{text}</p></div></div>)}</div>
      </article>

      <section className="insight-section">
        <div className="insight-title"><div><span className="page-kicker">GOODJOB OBSERVATIONS</span><h2>從你的經驗中，我們看見了這些</h2></div><span>所有觀察都能查看來源，不使用人格推測</span></div>
        <div className="insight-layout"><div className="insight-list">{insights.map((item, index) => <button className={insight === index ? "active" : ""} key={item.label} onClick={() => setInsight(index)}><span>{item.icon}</span><div><small>{item.label}</small><strong>{item.title}</strong></div><b>›</b></button>)}</div><article className="insight-detail"><span className="insight-detail-icon">{insights[insight].icon}</span><small>{insights[insight].label}</small><h3>{insights[insight].title}</h3><p>{insights[insight].text}</p><div><span>⌁</span><small>判斷依據</small><strong>{insights[insight].source}</strong></div><button>查看相關經驗　→</button></article></div>
      </section>
    </section>
  );
}
