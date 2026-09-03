export type ExperienceSchemaKey =
  | "context"
  | "goal"
  | "role"
  | "action"
  | "method"
  | "result"
  | "evidence"
  | "learning";

export type ExperienceSchemaResult = {
  key: ExperienceSchemaKey;
  label: string;
  question: string;
  placeholder: string;
  detected: boolean;
  value: string;
};

type SchemaDefinition = Omit<ExperienceSchemaResult, "detected" | "value"> & {
  pattern: RegExp;
};

const schemaDefinitions: SchemaDefinition[] = [
  { key: "context", label: "背景", question: "這段經驗是在什麼背景下發生的？", placeholder: "例如：課程團隊需要在一學期內完成一個服務設計專案。", pattern: /學期|課程|公司|團隊|專案|競賽|社團|研究|實習|工作/ },
  { key: "goal", label: "目標／問題", question: "你們當時想解決什麼問題或達成什麼目標？", placeholder: "例如：希望降低學生交換二手書時的操作阻力。", pattern: /目標|希望|為了|改善|解決|重新設計|提升|降低/ },
  { key: "role", label: "個人角色", question: "你在這段經驗中主要負責什麼？", placeholder: "例如：我負責訪談規劃、洞察整理與原型設計。", pattern: /我負責|我的角色|擔任|主導|帶領|協助/ },
  { key: "action", label: "行動", question: "你實際採取了哪些行動？", placeholder: "例如：訪談學生、整理痛點，並進行兩輪原型測試。", pattern: /訪談|整理|分析|規劃|設計|製作|執行|測試|協調|迭代/ },
  { key: "method", label: "工具／方法", question: "你使用了哪些工具、方法或知識？", placeholder: "例如：半結構式訪談、服務藍圖與 Figma。", pattern: /Figma|Excel|GA4|問卷|訪談|測試|服務藍圖|原型|分析法|研究法/i },
  { key: "result", label: "成果／影響", question: "最後產生了什麼具體成果或影響？", placeholder: "例如：團隊採用新版流程，降低完成任務所需步驟。", pattern: /最後|成果|結果|提升|降低|縮短|增加|完成|獲得|採用|減少/ },
  { key: "evidence", label: "可驗證證據", question: "有什麼數據、作品或附件可以支持這項成果？", placeholder: "例如：測試 8 位使用者，流程由 7 步縮短為 4 步。", pattern: /\d|％|%|獎|證書|簡報|報告|作品|附件/ },
  { key: "learning", label: "學習／反思", question: "這段經驗讓你學到了什麼？", placeholder: "例如：我學會把研究洞察轉成可測試的設計決策。", pattern: /學到|學會|理解|反思|體會|後來發現/ },
];

export const incompleteStoryExample = "這學期我和三位同學做了一個校園二手書交換專案。我負責訪談學生，並用 Figma 做出原型。";

export const completeStoryExample = "這學期我和三位同學重新設計校內二手書交換流程，希望降低學生完成交換時的操作阻力。我負責訪談規劃、問題整理與互動原型設計，使用半結構式訪談與 Figma，並進行可用性測試。測試 8 位使用者後，團隊將完成交換的流程從 7 步縮短為 4 步。我也學會把研究洞察轉成可測試的設計決策。";

function storySentences(story: string) {
  return story.split(/[。！？\n]/).map((sentence) => sentence.trim()).filter(Boolean);
}

export function analyzeExperienceStory(story: string): ExperienceSchemaResult[] {
  const sentences = storySentences(story);
  return schemaDefinitions.map(({ pattern, ...field }) => {
    const matched = sentences.find((sentence) => pattern.test(sentence));
    return { ...field, detected: Boolean(matched), value: matched || "" };
  });
}

export function buildStructuredSummary(
  analysis: ExperienceSchemaResult[],
  answers: Partial<Record<ExperienceSchemaKey, string>>,
) {
  const value = (key: ExperienceSchemaKey) => Object.prototype.hasOwnProperty.call(answers, key)
    ? answers[key] || ""
    : analysis.find((item) => item.key === key)?.value || "";
  return [value("context"), value("goal"), value("role"), value("action"), value("result"), value("evidence")]
    .filter((item, index, items) => item && items.indexOf(item) === index)
    .join("；");
}
