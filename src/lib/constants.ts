export const DEFAULT_SETTINGS = {
  apiKey: '',
  outputPreferences: {
    format: 'markdown',
    includeMetadata: true,
    prettify: true,
  },
  crawlDefaults: {
    maxDepth: 3,
    respectRobots: true,
    followExternal: false,
    mainContentOnly: true,
  },
  rateLimit: {
    enabled: true,
    requestsPerMinute: 60,
  },
  retryOptions: {
    maxRetries: 3,
    retryDelay: 1000,
  },
} as const;

export type Settings = typeof DEFAULT_SETTINGS;