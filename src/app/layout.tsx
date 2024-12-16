import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { TopicProvider } from '@/contexts/TopicContext';
import { ConversationProvider } from '@/contexts/ConversationContext';

export const metadata: Metadata = {
  title: "SIN IA",
  description: "Chat com IA baseado em documentação",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <TopicProvider>
          <ConversationProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ConversationProvider>
        </TopicProvider>
      </body>
    </html>
  );
} 