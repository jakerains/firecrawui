import { create } from 'zustand';
import { FirecrawlApi } from '@/lib/services/api';
import { StorageService } from '@/lib/services/storage';
import { CrawlFormValues } from '@/lib/validations/crawl';

interface CrawlState {
  isLoading: boolean;
  progress: number;
  pagesCrawled: number;
  status: 'idle' | 'crawling' | 'processing' | 'complete' | 'error';
  error: string | null;
  results: Record<string, any> | null;
  startCrawl: (values: CrawlFormValues) => Promise<void>;
  stopCrawl: () => void;
  reset: () => void;
  saveResults: (format: string) => Promise<void>;
}

export const useCrawlStore = create<CrawlState>((set, get) => {
  const api = new FirecrawlApi('fc-bcd104e9c38444f5b25cb19922a46ff9');
  const storage = new StorageService();

  return {
    isLoading: false,
    progress: 0,
    pagesCrawled: 0,
    status: 'idle',
    error: null,
    results: null,

    startCrawl: async (values: CrawlFormValues) => {
      set({ isLoading: true, status: 'crawling', error: null });
      
      try {
        const response = await api.crawl(values.startUrl, {
          maxDepth: values.maxDepth,
          followExternal: values.followExternal,
          respectRobots: values.respectRobots,
          formats: values.formats,
          docOptions: values.docOptions,
          outputFormat: values.outputFormat,
          outputOptions: values.outputOptions
        });

        if (!response.success) {
          throw new Error(response.error);
        }

        set({
          results: response.data,
          status: 'complete',
          isLoading: false,
          progress: 100,
          pagesCrawled: Object.keys(response.data).length,
        });
      } catch (error) {
        set({
          isLoading: false,
          status: 'error',
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    },

    saveResults: async (format: string) => {
      const { results } = get();
      if (!results) return;

      await storage.saveFile(results, {
        filename: 'firecrawl-results',
        format: format as any,
        timestamp: true,
      });
    },

    stopCrawl: () => {
      set({ 
        isLoading: false, 
        status: 'idle', 
        progress: 0, 
        pagesCrawled: 0,
        results: null 
      });
    },

    reset: () => {
      set({
        isLoading: false,
        progress: 0,
        pagesCrawled: 0,
        status: 'idle',
        error: null,
        results: null,
      });
    },
  };
});