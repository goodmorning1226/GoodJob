"use client";

import { useState } from "react";
import type { NewExperience } from "./ExperienceFlow";

type Props = { experiences: NewExperience[] };

const profileResumes = [
  {
    title: "Associate Product Manager",
    company: "Orbit 數位產品",
    template: "ATS 專業版",
    updated: "今天 14:32",
    color: "green",
  },
  {
    title: "UX Research Assistant",
    company: "日日生活科技",
    template: "專案導向版",
    updated: "昨天",
    color: "purple",
  },
  {
    title: "通用求職履歷",
    company: "未指定職缺",
    template: "ATS 專業版",
    updated: "8 月 22 日",
    color: "orange",
  },
];

export default function PublicProfile({ experiences }: Props) {
  const [nickname, setNickname] = useState("Yulun");
  const [headline, setHeadline] =
    useState("從使用者洞察走向產品決策的產品探索者");
  const [bio, setBio] = useState(
    "喜歡把模糊問題拆成可以研究與驗證的方向，具備使用者研究、產品企劃與資料分析經驗。目前正在尋找產品管理與使用者研究相關機會。",
  );
  const [selected, setSelected] = useState([0, 1, 2, 5]);
  const [selectedResumes, setSelectedResumes] = useState([0, 1]);
  const [saved, setSaved] = useState(false);

  function toggle(index: number) {
    setSelected((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
    setSaved(false);
  }

  function toggleResume(index: number) {
    setSelectedResumes((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
    setSaved(false);
  }

  return (
    <section className="public-profile-page page-enter">
      <header className="page-title-row">
        <div>
          <span className="page-kicker">PUBLIC PROFILE</span>
          <h1>公開 Profile</h1>
          <p>
            決定企業能看到哪些資訊；真實姓名、聯絡方式與未公開經驗不會顯示。
          </p>
        </div>
        <button
          className="add-button"
          onClick={() => {
            setSaved(true);
            window.setTimeout(() => setSaved(false), 1800);
          }}
        >
          {saved ? "✓ 已儲存" : "儲存公開設定"}
        </button>
      </header>
      <div className="public-profile-layout">
        <main className="profile-settings-panel">
          <section>
            <div className="profile-section-title">
              <span>01</span>
              <div>
                <h2>公開身份</h2>
                <p>企業只會看到暱稱，不會看到你的真實姓名。</p>
              </div>
            </div>
            <div className="profile-form-grid">
              <label>
                <span>公開暱稱</span>
                <input
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setSaved(false);
                  }}
                />
              </label>
              <label>
                <span>職涯標題</span>
                <input
                  value={headline}
                  onChange={(event) => {
                    setHeadline(event.target.value);
                    setSaved(false);
                  }}
                />
              </label>
              <label className="wide">
                <span>自我介紹</span>
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(event) => {
                    setBio(event.target.value);
                    setSaved(false);
                  }}
                />
                <small>{bio.length} / 240</small>
              </label>
            </div>
          </section>
          <section>
            <div className="profile-section-title">
              <span>02</span>
              <div>
                <h2>公開經歷</h2>
                <p>自行選擇企業可以看到的經驗；成果附件不會自動公開。</p>
              </div>
            </div>
            <div className="profile-experience-picker">
              {experiences.map((item, index) => (
                <button
                  className={selected.includes(index) ? "selected" : ""}
                  key={item.title}
                  onClick={() => toggle(index)}
                >
                  <span>{selected.includes(index) ? "✓" : "+"}</span>
                  <div>
                    <small>
                      {item.type} · {item.date}
                    </small>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <section>
            <div className="profile-section-title">
              <span>03</span>
              <div>
                <h2>公開履歷</h2>
                <p>企業可在人才頁查看你的公開履歷，但聯絡方式會保持隱藏。</p>
              </div>
            </div>
            <div className="profile-resume-picker">
              {profileResumes.map((resume, index) => {
                const isSelected = selectedResumes.includes(index);
                return (
                  <button
                    className={isSelected ? "selected" : ""}
                    key={resume.title}
                    onClick={() => toggleResume(index)}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={`profile-resume-thumbnail ${resume.color}`}
                    >
                      <i>
                        <strong>宋宇倫</strong>
                        <b />
                        <b />
                        <em />
                        <em />
                        <em />
                      </i>
                    </span>
                    <span className="profile-resume-info">
                      <small>{resume.company}</small>
                      <strong>{resume.title}</strong>
                      <em>
                        {resume.template} · 更新於 {resume.updated}
                      </em>
                    </span>
                    <span className="profile-resume-check">
                      {isSelected ? "✓ 公開" : "＋ 選擇"}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="profile-resume-note">
              已選擇 {selectedResumes.length}{" "}
              份履歷。企業只會看到你選中的版本，姓名與聯絡方式仍保持隱藏。
            </p>
          </section>
        </main>
        <aside className="public-profile-preview">
          <div className="company-preview-heading">
            <div>
              <span className="page-kicker">COMPANY PREVIEW</span>
              <h2>企業實際看到的公開 Profile</h2>
            </div>
            <span>即時預覽</span>
          </div>
          <article className="company-profile-preview">
            <header className="company-profile-header">
              <span className="profile-preview-avatar">Y</span>
              <div>
                <small>公開人才 Profile</small>
                <h3>{nickname || "未設定暱稱"}</h3>
                <p>{headline}</p>
              </div>
              <span>公開中</span>
            </header>
            <section className="company-preview-section">
              <strong>自我介紹</strong>
              <p>{bio || "尚未填寫自我介紹"}</p>
            </section>
            <section className="company-preview-section">
              <strong>公開技能</strong>
              <div className="profile-preview-skills">
                {["使用者研究", "產品企劃", "資料分析", "Figma"].map(
                  (skill) => (
                    <span key={skill}>{skill}</span>
                  ),
                )}
              </div>
            </section>
            <section className="company-preview-section company-preview-experiences">
              <header>
                <strong>公開經歷 · {selected.length}</strong>
                <small>點擊後可查看完整內容</small>
              </header>
              {selected.map(
                (index) =>
                  experiences[index] && (
                    <div
                      className="company-preview-experience-row"
                      key={experiences[index].title}
                    >
                      <span>◇</span>
                      <div>
                        <small>
                          {experiences[index].type} · {experiences[index].date}
                        </small>
                        <strong>{experiences[index].title}</strong>
                        <p>{experiences[index].description}</p>
                      </div>
                      <em>→</em>
                    </div>
                  ),
              )}
              {selected.length === 0 && (
                <p className="company-preview-empty">尚未公開任何經歷</p>
              )}
            </section>
            <section className="company-preview-section company-preview-resumes">
              <header>
                <strong>公開履歷 · {selectedResumes.length}</strong>
                <small>企業可開啟 PDF 預覽</small>
              </header>
              <div className="company-preview-resume-grid">
                {selectedResumes.map((index) => (
                  <div
                    className="company-preview-resume-card"
                    key={profileResumes[index].title}
                  >
                    <span
                      className={`company-preview-resume-cover ${profileResumes[index].color}`}
                    >
                      <strong>{nickname || "Yulun"}</strong>
                      <i />
                      <i />
                      <b />
                      <b />
                      <b />
                    </span>
                    <span>
                      <strong>{profileResumes[index].title}</strong>
                      <small>{profileResumes[index].template} · PDF</small>
                      <em>開啟履歷　→</em>
                    </span>
                  </div>
                ))}
              </div>
              {selectedResumes.length === 0 && (
                <p className="company-preview-empty">尚未公開任何履歷</p>
              )}
            </section>
            <footer className="company-preview-privacy">
              <span>▣</span>
              <p>
                <strong>隱私保護中</strong>
                <small>
                  真實姓名、Email 與電話不會顯示；接受企業邀約後才交換聯絡方式。
                </small>
              </p>
            </footer>
          </article>
        </aside>
      </div>
    </section>
  );
}
