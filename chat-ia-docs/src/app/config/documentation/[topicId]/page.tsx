'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTopic } from '@/contexts/TopicContext';
import FeedbackModal from '@/components/FeedbackModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function TopicPage({ params }: { params: { topicId: string } }) {
  const router = useRouter();
  const { topics, addDocument, deleteDocument } = useTopic();
  const topic = topics.find(t => t.id === params.topicId);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
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
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    documentId: string;
    documentName: string;
  }>({
    isOpen: false,
    documentId: '',
    documentName: ''
  });
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  if (!topic) {
    return null;
  }

  useEffect(() => {
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('topicId', topic.id);
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:8000/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newUrls: string[] = [];
        
        files.forEach(file => {
          const objectUrl = URL.createObjectURL(file);
          newUrls.push(objectUrl);
          
          addDocument(topic.id, {
            id: generateUniqueId(),
            name: file.name,
            size: file.size,
            uploadDate: new Date(),
            url: objectUrl
          });
        });

        setObjectUrls(prev => [...prev, ...newUrls]);
        setFiles([]);
        setFeedbackModal({
          isOpen: true,
          title: 'Sucesso!',
          message: 'Documentos enviados com sucesso!',
          type: 'success'
        });
      } else {
        throw new Error('Erro ao enviar documentos');
      }
    } catch (error) {
      setFeedbackModal({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao enviar documentos. Tente novamente.',
        type: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = (e: React.MouseEvent, documentId: string, documentName: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteModal({
      isOpen: true,
      documentId,
      documentName
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const documentToDelete = topic.documents.find(doc => doc.id === deleteModal.documentId);
      
      if (documentToDelete) {
        URL.revokeObjectURL(documentToDelete.url);
        setObjectUrls(prev => prev.filter(url => url !== documentToDelete.url));
      }

      deleteDocument(topic.id, deleteModal.documentId);
      
      setFeedbackModal({
        isOpen: true,
        title: 'Sucesso!',
        message: 'Documento excluído com sucesso!',
        type: 'success'
      });
    } catch (error) {
      setFeedbackModal({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao excluir documento. Tente novamente.',
        type: 'error'
      });
    }
  };

  const handleDocumentClick = (url: string, name: string) => {
    if (name.toLowerCase().endsWith('.pdf')) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-800">{topic.title}</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Upload de Documentos</h2>
            <p className="text-gray-600 mb-4">
              Faça upload dos documentos que serão usados como base de conhecimento para a IA.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.md"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                Clique para selecionar arquivos
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Suporta PDF, DOC, DOCX, TXT e MD
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Arquivos selecionados:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Enviando...' : 'Enviar Documentos'}
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Documentos no Tópico</h2>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {topic.documents.length > 0 ? (
                <div className="space-y-3">
                  {topic.documents.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => handleDocumentClick(doc.url, doc.name)}
                      className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer relative"
                    >
                      <div className="flex items-start gap-3 w-full min-w-0">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
                          />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-800 break-words">{doc.name}</h3>
                          <p className="text-sm text-gray-500">
                            {(doc.size / 1024).toFixed(2)} KB • {doc.uploadDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteDocument(e, doc.id, doc.name)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        title="Excluir documento"
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
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhum documento anexado neste tópico ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.documentName}
      />
    </div>
  );
} 