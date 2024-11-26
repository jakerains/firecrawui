import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { format } from 'date-fns';

export interface StorageOptions {
  filename?: string;
  timestamp?: boolean;
  format?: 'json' | 'markdown' | 'csv' | 'html' | 'zip';
}

export class StorageService {
  private getFilename(baseName: string, format: string, timestamp: boolean): string {
    const date = timestamp ? `-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}` : '';
    return `${baseName}${date}.${format}`;
  }

  private formatData(data: any, format: string): string {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(data);
      case 'markdown':
        return this.convertToMarkdown(data);
      default:
        return String(data);
    }
  }

  private convertToCSV(data: any): string {
    if (Array.isArray(data)) {
      const headers = Object.keys(data[0] || {});
      const rows = data.map(item => 
        headers.map(header => JSON.stringify(item[header] || '')).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    }
    return Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
  }

  private convertToMarkdown(data: any): string {
    if (typeof data === 'string') return data;
    return `# Extracted Data\n\n${JSON.stringify(data, null, 2)}`;
  }

  async saveFile(data: any, options: StorageOptions = {}): Promise<void> {
    const {
      filename = 'firecrawl-data',
      timestamp = true,
      format = 'json'
    } = options;

    if (format === 'zip') {
      await this.saveZip(data, filename, timestamp);
      return;
    }

    const content = this.formatData(data, format);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, this.getFilename(filename, format, timestamp));
  }

  async saveZip(data: Record<string, any>, filename: string, timestamp: boolean): Promise<void> {
    const zip = new JSZip();

    // Add each format to the zip
    Object.entries(data).forEach(([key, value]) => {
      const format = key.split('.').pop() || 'txt';
      const content = this.formatData(value, format);
      zip.file(`${key}`, content);
    });

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, this.getFilename(filename, 'zip', timestamp));
  }

  async saveMultiFormat(data: any, formats: string[], options: StorageOptions = {}): Promise<void> {
    const zipData: Record<string, any> = {};
    
    formats.forEach(format => {
      const filename = `data.${format}`;
      zipData[filename] = data;
    });

    await this.saveZip(zipData, options.filename || 'firecrawl-data', true);
  }
}