import type { Metadata } from "next";
import { Noto_Sans_TC, Manrope } from "next/font/google";
import "./globals.css";
import "./enterprise-profile.css";
import "./public-profile.css";

const notoSans = Noto_Sans_TC({ variable: "--font-noto-sans", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoodJob｜你的職涯工作台",
  description: "串連人才經驗證據與企業職缺需求的雙邊職涯媒合工作台。",
  openGraph: {
    title: "GoodJob｜讓每段經驗，成為下一步的證據",
    description: "使用者建立職涯資產與公開 Profile，企業發布職缺並依證據尋找合適人才。",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body className={`${notoSans.variable} ${manrope.variable}`}>{children}</body></html>;
}
