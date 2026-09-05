"use client";

import { useEffect, useMemo, useState } from "react";

type ChatRole = "talent" | "business";
type ChatMessage = { id: number; sender: ChatRole; body: string; time: string };
type ChatStore = Record<string, ChatMessage[]>;

const CHAT_STORAGE_KEY = "goodjob-chat-messages-v1";
const initialMessages: ChatStore = {
  "orbit-yulun": [
    { id: 1, sender: "business", body: "您好，我們看過您的履歷，想進一步和您聊聊 Associate Product Manager 的機會。", time: "昨天 16:20" },
    { id: 2, sender: "talent", body: "您好，謝謝您的邀請！我對職缺很有興趣，也很樂意進一步了解。", time: "昨天 17:05" },
    { id: 3, sender: "business", body: "太好了，想請問您這週四下午是否方便進行 30 分鐘的線上交流？", time: "今天 09:18" },
  ],
  "orbit-mina": [{ id: 1, sender: "business", body: "您好，我們想邀請您聊聊 UX Researcher 職缺。", time: "今天 08:42" }],
  "orbit-kai": [{ id: 1, sender: "talent", body: "您好，我想進一步了解團隊目前的產品營運方向。", time: "週一" }],
};

const contacts = {
  talent: [{ id: "orbit-yulun", name: "Orbit 數位產品", detail: "Associate Product Manager", avatar: "O" }],
  business: [
    { id: "orbit-yulun", name: "Yulun", detail: "Associate Product Manager", avatar: "Y" },
    { id: "orbit-mina", name: "Mina", detail: "UX Researcher", avatar: "M" },
    { id: "orbit-kai", name: "Kai", detail: "Product Operations Specialist", avatar: "K" },
  ],
};

export default function ChatWorkspace({ audience, initialContact }: { audience: ChatRole; initialContact?: string }) {
  const availableContacts = contacts[audience];
  const initialId = availableContacts.find((contact) => contact.name === initialContact)?.id || availableContacts[0].id;
  const [activeId, setActiveId] = useState(initialId);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatStore>(initialMessages);

  useEffect(() => {
    const loadMessages = (stored: string | null) => {
      if (!stored) return;
      try { setMessages(JSON.parse(stored) as ChatStore); } catch { window.localStorage.removeItem(CHAT_STORAGE_KEY); }
    };
    const timer = window.setTimeout(() => loadMessages(window.localStorage.getItem(CHAT_STORAGE_KEY)), 0);
    const syncMessages = (event: StorageEvent) => { if (event.key === CHAT_STORAGE_KEY) loadMessages(event.newValue); };
    window.addEventListener("storage", syncMessages);
    return () => { window.clearTimeout(timer); window.removeEventListener("storage", syncMessages); };
  }, []);

  const activeContact = availableContacts.find((contact) => contact.id === activeId) || availableContacts[0];
  const activeMessages = useMemo(() => messages[activeId] || [], [activeId, messages]);

  function sendMessage() {
    const body = draft.trim();
    if (!body) return;
    const now = new Date();
    const nextMessage: ChatMessage = { id: Date.now(), sender: audience, body, time: `今天 ${now.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false })}` };
    setMessages((current) => {
      const next = { ...current, [activeId]: [...(current[activeId] || []), nextMessage] };
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setDraft("");
  }

  return <section className={`chat-workspace ${audience}`}>
    <div className="chat-layout">
      <aside className="chat-contact-list"><header><h2>所有對話</h2><span>{availableContacts.length}</span></header>{availableContacts.map((contact) => { const lastMessage = messages[contact.id]?.at(-1); return <button className={activeId === contact.id ? "active" : ""} key={contact.id} onClick={() => setActiveId(contact.id)}><span className="chat-avatar">{contact.avatar}</span><span><strong>{contact.name}</strong><small>{lastMessage?.body || contact.detail}</small></span><time>{lastMessage?.time.split(" ")[0]}</time></button>; })}</aside>
      <section className="chat-thread"><header><span className="chat-avatar">{activeContact.avatar}</span><div><h2>{activeContact.name}</h2><p>{activeContact.detail}</p></div></header><main>{activeMessages.map((message) => <article className={message.sender === audience ? "mine" : "theirs"} key={message.id}><p>{message.body}</p><time>{message.time}</time></article>)}</main><footer><textarea aria-label="輸入訊息" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="輸入訊息⋯" rows={1} /><button type="button" disabled={!draft.trim()} onClick={sendMessage}>傳送</button></footer></section>
    </div>
  </section>;
}
