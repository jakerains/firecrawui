import { useState } from 'react';
import { FirecrawlApi, ApiResponse } from '@/lib/services/api';
import { StorageService, StorageOptions } from '@/lib/services/storage';

interface ProcessOptions {
  url: string;
  formats: string[];
  apiOptions?: any;
  storageOptions?: StorageOptions;
}

export function useDataProcessor(apiKey: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const api = new FirecrawlApi(apiKey);
  const storage = new StorageService();

  const processData = async ({ url, formats, apiOptions = {}, storageOptions = {} }: ProcessOptions) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Process data based on formats
      const results: Record<string, any> = {};
      
      for (const format of formats) {
        setProgress((prev) => prev + (100 / formats.length) * 0.5);
        
        const response = await api.scrape(url, { ...apiOptions, format });
        
        if (!response.success) {
          throw new Error(`Failed to process ${format}: ${response.error}`);
        }

        results[format] = response.data;
        setProgress((prev) => prev + (100 / formats.length) * 0.5);
      }

      // Save the processed data
      await storage.saveMultiFormat(results, formats, storageOptions);

      setProgress(100);
      return { success: true, data: results };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsProcessing(false);
    }
  };

  const saveResults = async (data: any, options: StorageOptions = {}) => {
    try {
      await storage.saveFile(data, options);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save results';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    processData,
    saveResults,
    isProcessing,
    progress,
    error,
  };
}