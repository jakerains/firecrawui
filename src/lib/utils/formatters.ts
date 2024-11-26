import { parse as parseCSV } from 'papaparse';
import showdown from 'showdown';
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml';

export type FormatType = 
  | 'json' 
  | 'yaml' 
  | 'csv' 
  | 'markdown' 
  | 'html' 
  | 'txt' 
  | 'xml';

const mdConverter = new showdown.Converter({
  tables: true,
  tasklists: true,
  strikethrough: true,
  emoji: true,
});

export const formatters = {
  json: {
    format: (data: any) => JSON.stringify(data, null, 2),
    parse: (text: string) => JSON.parse(text),
    extension: 'json',
    contentType: 'application/json',
  },
  yaml: {
    format: (data: any) => stringifyYAML(data),
    parse: (text: string) => parseYAML(text),
    extension: 'yaml',
    contentType: 'text/yaml',
  },
  csv: {
    format: (data: any) => {
      if (Array.isArray(data)) {
        return parseCSV.unparse(data);
      }
      // Convert object to array of key-value pairs
      return parseCSV.unparse([data]);
    },
    parse: (text: string) => parseCSV.parse(text).data,
    extension: 'csv',
    contentType: 'text/csv',
  },
  markdown: {
    format: (data: any) => {
      if (typeof data === 'string') return data;
      return `# Extracted Data\n\n${JSON.stringify(data, null, 2)}`;
    },
    parse: (text: string) => mdConverter.makeHtml(text),
    extension: 'md',
    contentType: 'text/markdown',
  },
  html: {
    format: (data: any) => {
      if (typeof data === 'string') {
        if (data.trim().startsWith('<')) return data;
        return mdConverter.makeHtml(data);
      }
      return mdConverter.makeHtml(JSON.stringify(data, null, 2));
    },
    parse: (text: string) => text,
    extension: 'html',
    contentType: 'text/html',
  },
  txt: {
    format: (data: any) => {
      if (typeof data === 'string') return data;
      return JSON.stringify(data, null, 2);
    },
    parse: (text: string) => text,
    extension: 'txt',
    contentType: 'text/plain',
  },
  xml: {
    format: (data: any) => {
      const toXML = (obj: any): string => {
        if (typeof obj !== 'object') return String(obj);
        return Object.entries(obj).map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map(item => `<${key}>${toXML(item)}</${key}>`).join('');
          }
          return `<${key}>${toXML(value)}</${key}>`;
        }).join('');
      };
      return `<?xml version="1.0" encoding="UTF-8"?>\n<root>${toXML(data)}</root>`;
    },
    parse: (text: string) => text,
    extension: 'xml',
    contentType: 'application/xml',
  },
};

export const convertFormat = (
  data: any,
  fromFormat: FormatType,
  toFormat: FormatType
): string => {
  // Parse the input if it's a string
  const parsed = typeof data === 'string' 
    ? formatters[fromFormat].parse(data)
    : data;
  
  // Format to the target format
  return formatters[toFormat].format(parsed);
};