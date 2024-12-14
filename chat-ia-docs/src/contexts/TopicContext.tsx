'use client';

import React, { createContext, useContext, useState } from 'react';

interface Topic {
  id: string;
  title: string;
  documents: {
    id: string;
    name: string;
    size: number;
    uploadDate: Date;
    url: string;
  }[];
}

interface TopicContextType {
  topics: Topic[];
  addTopic: (title: string) => void;
  updateTopic: (id: string, title: string) => void;
  deleteTopic: (id: string) => void;
  addDocument: (topicId: string, document: Topic['documents'][0]) => void;
  deleteDocument: (topicId: string, documentId: string) => void;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export function TopicProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>([]);

  const addTopic = (title: string) => {
    setTopics(prev => [...prev, {
      id: Date.now().toString(),
      title,
      documents: []
    }]);
  };

  const addDocument = (topicId: string, document: Topic['documents'][0]) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { 
            ...topic, 
            documents: [...topic.documents, document]
          }
        : topic
    ));
  };

  const deleteDocument = (topicId: string, documentId: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { 
            ...topic, 
            documents: topic.documents.filter(doc => doc.id !== documentId)
          }
        : topic
    ));
  };

  const updateTopic = (id: string, title: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === id ? { ...topic, title } : topic
    ));
  };

  const deleteTopic = (id: string) => {
    setTopics(prev => prev.filter(topic => topic.id !== id));
  };

  return (
    <TopicContext.Provider value={{ 
      topics, 
      addTopic, 
      updateTopic,
      deleteTopic,
      addDocument, 
      deleteDocument 
    }}>
      {children}
    </TopicContext.Provider>
  );
}

export function useTopic() {
  const context = useContext(TopicContext);
  if (!context) {
    throw new Error('useTopic must be used within a TopicProvider');
  }
  return context;
} 