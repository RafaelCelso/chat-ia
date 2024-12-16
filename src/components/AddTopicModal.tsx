'use client';

import React, { useState, useEffect } from 'react';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
  initialValue?: string;
  mode?: 'add' | 'edit';
}

export default function AddTopicModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialValue = '', 
  mode = 'add' 
}: AddTopicModalProps) {
  const [title, setTitle] = useState(initialValue);

  useEffect(() => {
    setTitle(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim()) {
      onConfirm(title);
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {mode === 'add' ? 'Novo Tópico' : 'Editar Tópico'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Tópico
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o título do tópico..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && title.trim()) {
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!title.trim()}
            >
              {mode === 'add' ? 'Criar Tópico' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 