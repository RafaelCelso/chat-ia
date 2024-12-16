'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useConversation } from '../contexts/ConversationContext';
import ConfirmationModal from './ConfirmationModal';

interface Conversation {
  id: string;
  title: string;
  date: Date;
}

export default function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    conversationId: string | null;
  }>({
    isOpen: false,
    conversationId: null
  });
  
  const { 
    conversations, 
    addConversation, 
    selectConversation,
    deleteConversation,
    currentConversation 
  } = useConversation();

  const handleNewConversation = () => {
    addConversation();
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleDeleteConversation = (
    e: React.MouseEvent,
    conversationId: string
  ) => {
    e.stopPropagation();
    setDeleteModalState({
      isOpen: true,
      conversationId
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.conversationId) {
      deleteConversation(deleteModalState.conversationId);
    }
  };

  const groupConversationsByDate = (conversations: Conversation[]) => {
    return conversations.reduce((groups, conversation) => {
      const date = conversation.date;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let group = 'Mais de 7 dias';

      if (date.toDateString() === today.toDateString()) {
        group = 'Hoje';
      } else if (date.toDateString() === yesterday.toDateString()) {
        group = 'Ontem';
      } else if (date > new Date(today.setDate(today.getDate() - 7))) {
        group = '7 dias anteriores';
      }

      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(conversation);
      return groups;
    }, {} as Record<string, Conversation[]>);
  };

  const groupedConversations = groupConversationsByDate(conversations);

  return (
    <>
      <div className={`${isCollapsed ? 'w-16' : 'w-80'} h-screen flex flex-col bg-gray-900 text-gray-100 transition-all duration-300 relative flex-shrink-0`}>
        {/* Botão de Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-5 bg-gray-900 rounded-full p-1 hover:bg-gray-700 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Botão Nova Conversa */}
        <div className="flex-shrink-0 p-3">
          <button
            onClick={handleNewConversation}
            className="w-full p-3 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {!isCollapsed && "Nova conversa"}
          </button>
        </div>

        {/* Barra de Pesquisa */}
        {!isCollapsed && (
          <div className="flex-shrink-0 px-3 mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar conversas..."
                className={`w-full p-2 bg-gray-800 rounded-md pl-8 focus:outline-none focus:ring-1 focus:ring-gray-700 ${
                  isSearchOpen ? 'opacity-100' : 'opacity-0'
                } transition-opacity`}
              />
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute left-2 top-2.5 text-gray-400 hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto">
          {!isCollapsed && Object.entries(groupedConversations).map(([group, convos]) => (
            <div key={group} className="mb-4">
              <h3 className="px-3 py-2 text-sm text-gray-500">{group}</h3>
              {convos.map((conversation) => (
                <div
                  key={conversation.id}
                  className="group relative"
                >
                  <button
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full px-3 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-3
                      ${currentConversation?.id === conversation.id ? 'bg-gray-800' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                    <span className="truncate flex-1">{conversation.title}</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Excluir conversa"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-5 h-5"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Botões de Configuração */}
        <div className="flex-shrink-0 border-t border-gray-700 p-3">
          <Link
            href="/config"
            className="flex items-center gap-3 px-3 py-3 hover:bg-gray-800 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!isCollapsed && "Configurações"}
          </Link>
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, conversationId: null })}
        onConfirm={handleConfirmDelete}
        title="Excluir conversa"
        message="Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita."
      />
    </>
  );
} 