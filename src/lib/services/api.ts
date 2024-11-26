import FirecrawlApp from '@mendable/firecrawl-js';

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class FirecrawlApi {
  private client: FirecrawlApp;

  constructor(apiKey: string) {
    this.client = new FirecrawlApp({ apiKey });
  }

  async scrape(url: string, options: any = {}): Promise<ApiResponse> {
    try {
      const response = await this.client.scrapeUrl(url, {
        formats: options.formats || ['markdown'],
        ...options
      });

      if (!response.success) {
        throw new Error(response.error || 'Scraping failed');
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async crawl(url: string, options: any = {}): Promise<ApiResponse> {
    try {
      const response = await this.client.crawlUrl(url, {
        limit: options.limit || 100,
        scrapeOptions: {
          formats: options.formats || ['markdown'],
          ...options.scrapeOptions
        },
        ...options
      });

      if (!response.success) {
        throw new Error(response.error || 'Crawling failed');
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async map(url: string, options: any = {}): Promise<ApiResponse> {
    try {
      const response = await this.client.mapUrl(url, options);

      if (!response.success) {
        throw new Error(response.error || 'Mapping failed');
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async extract(url: string, options: any = {}): Promise<ApiResponse> {
    try {
      const response = await this.client.scrapeUrl(url, {
        formats: ['extract'],
        extract: options.extract || {},
        ...options
      });

      if (!response.success) {
        throw new Error(response.error || 'Extraction failed');
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async watchCrawl(url: string, options: any = {}, callbacks: {
    onDocument?: (doc: any) => void;
    onError?: (err: any) => void;
    onDone?: (state: any) => void;
  } = {}): Promise<void> {
    try {
      const watch = await this.client.crawlUrlAndWatch(url, options);

      if (callbacks.onDocument) {
        watch.addEventListener("document", (doc) => callbacks.onDocument!(doc.detail));
      }

      if (callbacks.onError) {
        watch.addEventListener("error", (err) => callbacks.onError!(err.detail));
      }

      if (callbacks.onDone) {
        watch.addEventListener("done", (state) => callbacks.onDone!(state.detail));
      }
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(error);
      }
    }
  }
}