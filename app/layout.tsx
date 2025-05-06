import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/QueryProvider";
import { Slide, ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X-Clone",
  description: "This is the twitter/X clone developed in react/nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
          >
            {children}
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={true}
              closeOnClick={false}
              pauseOnHover={true}
              draggable={true}
              theme="colored"
              transition={Slide}
            />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
