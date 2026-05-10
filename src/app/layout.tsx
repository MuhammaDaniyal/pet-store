import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";
import ClickSpark from "@/components/animations/ClickSpark";
import ChatbotSidebarWrapper from "@/components/chatbot/ChatbotSidebarWrapper";
import { TopBar } from "@/components/TopBar";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetStore",
  description: "PetStore authentication and storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-primary">
        <ThemeProviderWrapper>
          <ClickSpark
            sparkColor="#FF6B35"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <TopBar />
            {children}
            <ChatbotSidebarWrapper />
          </ClickSpark>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}