// Documents API services

import apiClient from './client';

export const documentsApi = {
  /**
   * Upload a document
   * POST /documents/upload
   */
  uploadDocument: async (formData: FormData, projectId?: number): Promise<any> => {
    const url = projectId ? `/documents/upload?projectId=${projectId}` : '/documents/upload';
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get user's documents
   * GET /documents
   */
  getUserDocuments: async (): Promise<any[]> => {
    const response = await apiClient.get('/documents');
    return response.data;
  },

  /**
   * Get documents for a specific project
   * GET /documents/project/{projectId}
   */
  getProjectDocuments: async (projectId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/documents/project/${projectId}`);
      return response.data;
    } catch (error: any) {
      // If error is 404 or no documents found, return empty array instead of throwing
      if (error?.response?.status === 404 || error?.response?.status === 204) {
        return [];
      }
      throw error;
    }
  },

  /**
   * Get document by ID
   * GET /documents/{documentId}
   */
  getDocumentById: async (documentId: number): Promise<any> => {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data;
  },

  /**
   * Delete document
   * DELETE /documents/{documentId}
   */
  deleteDocument: async (documentId: number): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },

  /**
   * Chat with document (normal or AI mode)
   * POST /documents/{documentId}/chat
   */
  chatWithDocument: async (documentId: number, message: string, aiMode: boolean = false): Promise<any> => {
    const response = await apiClient.post(`/documents/${documentId}/chat`, {
      message,
      aiMode,
    });
    return response.data;
  },

  /**
   * Get chat history for a document
   * GET /documents/{documentId}/chat/history
   */
  getChatHistory: async (documentId: number): Promise<any[]> => {
    const response = await apiClient.get(`/documents/${documentId}/chat/history`);
    return response.data;
  },

  /**
   * Download document
   * GET /documents/{documentId}/download
   */
  downloadDocument: async (documentId: number): Promise<Blob> => {
    const response = await apiClient.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
