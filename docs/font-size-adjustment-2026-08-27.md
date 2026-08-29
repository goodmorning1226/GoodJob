# 非標題字級調整紀錄（2026-08-27）

## 目前生效的設定

先前的「所有非標題字級增加 4px」已完整撤回。目前只調整非標題中原本為 12px 與 14px 的文字：

- 12px → 14px
- 14px → 16px
- `h1`～`h6` 標題維持原尺寸。
- 其他字級全部回到調整前的值。
- 修改檔案：`app/globals.css`
- 共調整 15 個字級宣告，涉及 15 個 CSS 規則。
- 保留 56 個含標題元素的字級規則。

## 判定方式

「標題」指 CSS 選擇器直接包含 `h1`～`h6` 的規則。只調整以 `px` 表示的 `font-size` 或 `font` 簡寫；其他尺寸、間距與版面設定均未更動。

## 回復方式

若要回到本次調整前的原始字級，只需要依下方清單將 14px 改回 12px、16px 改回 14px。不要對其他字級做減法。

## 完整變更明細

- `.nav-item`: font-size 14px → 16px
- `.welcome-row p:last-child`: font-size 14px → 16px
- `.welcome-row select`: font-size 12px → 14px
- `.career-card button, .panel-header button`: font-size 12px → 14px
- `.subtle-button`: font-size 12px → 14px
- `.experience-content > strong`: font-size 14px → 16px
- `.toast`: font-size 12px → 14px
- `.flow-brand`: font-size 14px → 16px
- `.flow-brand .brand-mark`: font-size 14px → 16px
- `.method-grid button strong`: font-size 12px → 14px
- `.summary-editor textarea`: font-size 12px → 14px
- `.onboarding-finish > p`: font-size 12px → 14px
- `.view-toggle button`: font-size 14px → 16px
- `.timeline-year b`: font-size 12px → 14px
- `.application-detail > header .application-company`: font-size 12px → 14px

## 版本歷史

- 第一版：所有非標題的 px 字級增加 4px。
- 目前版本：第一版已撤回，僅保留原始 12px 與 14px 各增加 2px。
