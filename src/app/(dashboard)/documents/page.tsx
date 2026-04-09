'use client';

import { useState, useEffect } from 'react';
import { FileText, Upload, Search, Loader2, Trash2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { documentsApi } from '@/lib/api/documents.api';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentsApi.getUserDocuments();
      console.log('✅ Loaded', data.length, 'documents');
      setDocuments(data);
    } catch (error: any) {
      console.error('❌ Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await documentsApi.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Documents</h1>
          <p className="text-gray-500 mt-1">Upload PDFs and chat with AI about their content</p>
        </div>
        <button
          onClick={() => setIsUploadDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#131316] border border-[#1f1f23] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#131316] border border-[#1f1f23] rounded-xl p-6 hover:border-[#2a2a2e] transition-colors"
            >
              {/* Document Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-400" />
                </div>
                <div className="flex gap-2">
                  {/* <button
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                    className="p-2 hover:bg-[#1a1a1d] rounded-lg transition-colors"
                    title="Download"
                  > */}
                    {/* <Download className="h-4 w-4 text-gray-400" />
                  </button> */}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Document Info */}
              <h3 className="font-semibold text-white mb-2 truncate" title={doc.fileName}>
                {doc.fileName}
              </h3>
              
              {/* AI Summary */}
              {doc.summary && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {doc.summary}
                </p>
              )}

              {/* Metadata */}
              <div className="text-xs text-gray-500 mb-4">
                <p>Size: {(doc.fileSize / 1024).toFixed(2)} KB</p>
                <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                <p>Pages: {doc.pageCount || 'N/A'}</p>
              </div>

              {/* Chat Button */}
              <Link
                href={`/documents/${doc.id}/chat`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Chat with AI
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-12 text-center">
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
          <p className="text-gray-500 mb-4">Upload your first PDF to get started</p>
          <button
            onClick={() => setIsUploadDialogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-5 w-5" />
            Upload Document
          </button>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadDocumentDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onSuccess={fetchDocuments}
      />
    </div>
  );
}
