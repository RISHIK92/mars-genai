import api from './api';

interface FileUploadResponse {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
}

interface FileProcessResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

interface CSVAnalysisOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  analysisType?: 'summary' | 'insights' | 'trends';
  question?: string;
}

interface CSVParseResponse {
  success: boolean;
  data: any[];
  columns?: string[];
}

interface CSVAnalysisResponse {
  success: boolean;
  data: {
    summary: string;
    insights?: string[];
    statistics?: Record<string, any>;
    sampleData?: any[];
  };
}

export const fileService = {
  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<FileUploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async parseCSV(file: File): Promise<CSVParseResponse> {
    const text = await file.text();
    const response = await api.post<CSVParseResponse>('/csv/parse', { csvData: text });
    return response.data;
  },

  async generateCSV(data: any[]): Promise<Blob> {
    const response = await api.post<Blob>('/csv/generate', { data }, {
      responseType: 'blob',
    });
    return response.data;
  },

  async analyzeCSV(file: File, options: CSVAnalysisOptions = {}): Promise<CSVAnalysisResponse> {
    const text = await file.text();
    const response = await api.post<CSVAnalysisResponse>('/csv/analyze', { 
      csvData: text,
      options 
    });
    return response.data;
  },

  async processFile(fileId: string, options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}): Promise<FileProcessResponse> {
    const response = await api.post<FileProcessResponse>(`/files/${fileId}/process`, options);
    return response.data;
  },

  async getFileStatus(fileId: string): Promise<FileProcessResponse> {
    const response = await api.get<FileProcessResponse>(`/files/${fileId}/status`);
    return response.data;
  },

  async downloadResult(fileId: string): Promise<Blob> {
    const response = await api.get<Blob>(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async uploadAndAnalyzeFile(
    file: File, 
    options: CSVAnalysisOptions, 
    onProgress?: (progress: number) => void
  ): Promise<CSVAnalysisResponse> {
    try {
      // First upload the file
      const uploadResponse = await this.uploadFile(file);
      
      // Then process it with analysis options
      const processResponse = await this.processFile(uploadResponse.id, {
        model: options.model,
        temperature: options.temperature,
        max_tokens: options.max_tokens
      });

      // Poll for status (simplified version)
      let statusResponse: FileProcessResponse;
      do {
        statusResponse = await this.getFileStatus(uploadResponse.id);
        if (onProgress) {
          onProgress(statusResponse.status === 'completed' ? 100 : 
                    statusResponse.status === 'processing' ? 50 : 25);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } while (statusResponse.status !== 'completed' && statusResponse.status !== 'failed');

      if (statusResponse.status === 'failed') {
        throw new Error(statusResponse.error || 'File processing failed');
      }

      // Download and return the result
      const result = await this.downloadResult(uploadResponse.id);
      return JSON.parse(await result.text()) as CSVAnalysisResponse;
    } catch (error) {
      console.error('Error in uploadAndAnalyzeFile:', error);
      throw error;
    }
  }
};