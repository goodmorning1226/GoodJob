"use client";

import { useEffect, useRef, useState } from "react";

export type TalentProfile = {
  name: string;
  bio: string;
  avatar: string;
};

type Props = {
  profile: TalentProfile;
  onClose: () => void;
  onSave: (profile: TalentProfile) => void;
  variant?: "talent" | "company";
};

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 16-.8 3.8L8 19l10.1-10.1-3-3L5 16Z" />
      <path d="m13.8 7.2 3 3" />
    </svg>
  );
}

export default function ProfileEditModal({ profile, onClose, onSave, variant = "talent" }: Props) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const isCompany = variant === "company";

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

  function selectAvatar(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="profile-edit-backdrop">
      <section className="profile-edit-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
        <header>
          <div><span className="page-kicker">{isCompany ? "COMPANY PROFILE" : "PERSONAL PROFILE"}</span><h2 id="profile-edit-title">{isCompany ? "編輯企業資料" : "編輯個人資料"}</h2></div>
          <button onClick={onClose} aria-label={isCompany ? "關閉編輯企業資料" : "關閉編輯個人資料"}>×</button>
        </header>

        <main>
          <div className="profile-identity-editor">
            <span className="profile-avatar-control">
              <span className={avatar ? "profile-avatar-preview has-image" : "profile-avatar-preview"} style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}>
                {!avatar && (name.trim().slice(-1) || "人")}
              </span>
              <label className="profile-edit-icon" htmlFor="profile-avatar-input" aria-label="選擇照片" data-tooltip="選擇照片"><PencilIcon /></label>
            </span>
            <span className="profile-name-editor">
              <input ref={nameInputRef} value={name} maxLength={30} onChange={(event) => setName(event.target.value)} aria-label={isCompany ? "企業名稱" : "名稱"} />
              <button className="profile-edit-icon" type="button" onClick={() => nameInputRef.current?.focus()} aria-label={isCompany ? "編輯企業名稱" : "編輯名稱"} data-tooltip={isCompany ? "編輯企業名稱" : "編輯名稱"}><PencilIcon /></button>
            </span>
            <input id="profile-avatar-input" type="file" accept="image/*" onChange={(event) => selectAvatar(event.target.files?.[0])} />
          </div>

          <label className="profile-edit-field">
            <span>{isCompany ? "企業介紹" : "自我介紹"}</span>
            <textarea value={bio} maxLength={150} rows={5} onChange={(event) => setBio(event.target.value)} placeholder={isCompany ? "簡單介紹公司、團隊或招募方向" : "簡單介紹你的經驗、專長或職涯方向"} />
            <small>{bio.length} / 150</small>
          </label>
        </main>

        <footer>
          <button onClick={onClose}>取消</button>
          <button className="primary-flow-button" disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), bio: bio.trim(), avatar })}>儲存變更</button>
        </footer>
      </section>
    </div>
  );
}
