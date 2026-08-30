import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the GoodJob role selection", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /<title>GoodJob｜你的職涯工作台<\/title>/);
  assert.match(html, /選擇你在 GoodJob 中的角色：/);
  assert.match(html, /我是人才/);
  assert.match(html, /我是企業/);
  assert.doesNotMatch(html, /雙邊職涯媒合 Prototype|Prototype 使用本機展示資料|進入使用者工作台|進入企業方工作台/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the published prototype free of paid API integration", async () => {
  const files = await Promise.all([
    "page.tsx", "ExperienceFlow.tsx", "CareerAnalysis.tsx", "JobAnalysis.tsx",
    "ResumeBuilder.tsx", "CareerResources.tsx", "ApplicationTracker.tsx", "ProductGuide.tsx", "ExperienceEvidence.tsx",
    "AudienceGate.tsx", "EnterprisePortal.tsx",
    "ProfileEditModal.tsx",
  ].map((name) => readFile(new URL(`../app/${name}`, import.meta.url), "utf8")));
  const source = files.join("\n");
  assert.doesNotMatch(source, /fetch\(|axios|OPENAI_API_KEY|apiKey/i);
  assert.match(source, /localStorage/);
  assert.match(source, /mobile-bottom-nav/);
});
