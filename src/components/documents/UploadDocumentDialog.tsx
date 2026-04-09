'use client';

import { useState } from 'react';
import { X, Upload, Loader2, FileText, CheckCircle } from 'lucide-react';
import { documentsApi } from '@/lib/api/documents.api';
import toast from 'react-hot-toast';

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: number;
}

export default function UploadDocumentDialog({ isOpen, onClose, onSuccess, projectId }: UploadDocumentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStage('uploading');
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', selectedFile);

      await documentsApi.uploadDocument(formData, projectId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStage('complete');
      
      toast.success('Document uploaded successfully!');
      
      // Give time for success message to show, then refresh
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);

    } catch (error: any) {
      console.error('Error uploading document:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to upload document';
      toast.error(errorMessage);
      setUploadStage('idle');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStage('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#131316] border border-[#1f1f23] rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Upload Document</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-gray-500 hover:text-gray-300 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          {!selectedFile ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#1f1f23] rounded-lg p-8 cursor-pointer hover:border-blue-500/50 hover:bg-[#1a1a1d] transition-all">
              <Upload className="h-12 w-12 text-gray-500 mb-3" />
              <p className="text-sm font-medium text-white mb-1">Click to upload PDF</p>
              <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          ) : (
            <div className="border-2 border-[#1f1f23] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                {!isUploading && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      {uploadStage === 'uploading' && 'Uploading...'}
                      {uploadStage === 'complete' && 'Complete!'}
                    </span>
                    <span className="text-sm text-gray-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#1a1a1d] rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  
                  {uploadStage === 'complete' && (
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Document uploaded successfully!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 px-4 py-2 border border-[#1f1f23] text-gray-300 rounded-lg hover:bg-[#1a1a1d] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
