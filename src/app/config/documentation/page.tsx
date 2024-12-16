'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTopic } from '@/contexts/TopicContext';
import AddTopicModal from '@/components/AddTopicModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import FeedbackModal from '@/components/FeedbackModal';

export default function Documentation() {
  const router = useRouter();
  const { topics, addTopic, deleteTopic, updateTopic } = useTopic();
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<{ id: string; title: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    topicId: string;
    topicName: string;
  }>({
    isOpen: false,
    topicId: '',
    topicName: ''
  });
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const handleEditTopic = (e: React.MouseEvent, topic: { id: string; title: string }) => {
    e.stopPropagation();
    setEditingTopic(topic);
    setIsAddTopicModalOpen(true);
  };

  const handleDeleteTopic = (e: React.MouseEvent, topicId: string, topicName: string) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      topicId,
      topicName
    });
  };

  const handleConfirmDelete = async () => {
    try {
      deleteTopic(deleteModal.topicId);
      setFeedbackModal({
        isOpen: true,
        title: 'Sucesso!',
        message: 'Tópico excluído com sucesso!',
        type: 'success'
      });
    } catch (error) {
      setFeedbackModal({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao excluir tópico. Tente novamente.',
        type: 'error'
      });
    }
  };

  const handleTopicAction = (title: string) => {
    if (editingTopic) {
      updateTopic(editingTopic.id, title);
      setEditingTopic(null);
    } else {
      addTopic(title);
    }
    
    setFeedbackModal({
      isOpen: true,
      title: 'Sucesso!',
      message: editingTopic 
        ? 'Tópico atualizado com sucesso!'
        : 'Tópico criado com sucesso!',
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Documentação</h1>
            </div>
            <button
              onClick={() => {
                setEditingTopic(null);
                setIsAddTopicModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Novo Tópico
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => router.push(`/config/documentation/${topic.id}`)}
                className="group relative border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800">{topic.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {topic.documents.length} documento(s)
                </p>

                {/* Botões de ação */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEditTopic(e, { id: topic.id, title: topic.title })}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                    title="Editar tópico"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDeleteTopic(e, topic.id, topic.title)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                    title="Excluir tópico"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={() => {
          setIsAddTopicModalOpen(false);
          setEditingTopic(null);
        }}
        onConfirm={handleTopicAction}
        initialValue={editingTopic?.title}
        mode={editingTopic ? 'edit' : 'add'}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.topicName}
      />

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type}
      />
    </div>
  );
} 