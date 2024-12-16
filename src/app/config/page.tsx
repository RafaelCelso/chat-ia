'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InstructionsModal from '@/components/InstructionsModal';

export default function Config() {
  const router = useRouter();
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Configurações</h1>
          </div>

          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Instruções para a IA</h2>
              <p className="text-gray-600 mb-4">
                Configure as instruções que a IA seguirá ao responder as perguntas.
              </p>
              <button
                onClick={() => setIsInstructionsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Configurar Instruções
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Documentação</h2>
              <p className="text-gray-600 mb-4">
                Gerencie os documentos que serão usados como base de conhecimento para a IA.
              </p>
              <button
                onClick={() => router.push('/config/documentation')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Gerenciar Documentação
              </button>
            </div>
          </div>
        </div>
      </div>

      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        onConfirm={() => {}}
        title="Instruções para a IA"
        message="Configure as instruções que a IA seguirá ao responder as perguntas."
      />
    </div>
  );
} 