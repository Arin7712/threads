
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";
import { Suspense, useEffect, useState } from "react";
import Loading from "./Loading";
import { useRouter } from "next/router";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/toaster"



const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Threads',
  description: 'A next.js 14 Meta Threads'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Topbar/>
        <main className="flex flex-row">
          <LeftSidebar/>
          <section className="main-container">
            <div className="w-full max-w-4xl">
            <Suspense fallback={<Loading/>}>
            <NextTopLoader color="#b905fa"/>
              {children}
              <Toaster />
    
        </Suspense>
            </div>
          </section>

          <RightSidebar/>
        </main>
        <Bottombar/>
      </body>
    </html>
    </ClerkProvider>
  );
}
