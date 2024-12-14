'use client';

import React, { createContext, useContext, useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

interface Conversation {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

interface ConversationContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  addConversation: () => void;
  updateCurrentConversation: (messages: Message[]) => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const addConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      date: new Date(),
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const updateCurrentConversation = (messages: Message[]) => {
    if (currentConversation) {
      const updatedConversation = { ...currentConversation, messages };
      // Atualiza o título com base na primeira mensagem do usuário
      if (messages.length > 0 && messages[0].isUser) {
        updatedConversation.title = messages[0].text.slice(0, 30) + (messages[0].text.length > 30 ? '...' : '');
      }
      setCurrentConversation(updatedConversation);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? updatedConversation : conv
        )
      );
    }
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  return (
    <ConversationContext.Provider 
      value={{ 
        conversations, 
        currentConversation, 
        addConversation, 
        updateCurrentConversation,
        selectConversation,
        deleteConversation 
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
} 