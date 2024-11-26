import * as z from 'zod';

export const crawlFormSchema = z.object({
  startUrl: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Start URL is required'),
  maxDepth: z
    .number()
    .min(1, 'Depth must be at least 1')
    .max(10, 'Maximum depth is 10'),
  followExternal: z.boolean().default(false),
  respectRobots: z.boolean().default(true),
  // New documentation-specific options
  mode: z.enum(['standard', 'docs']).default('standard'),
  docOptions: z.object({
    // Common documentation selectors
    contentSelector: z.string().optional(),
    excludeSelectors: z.array(z.string()).default([]),
    // Documentation-specific features
    preserveHeaders: z.boolean().default(true),
    generateTableOfContents: z.boolean().default(true),
    combineIntoSingleFile: z.boolean().default(true),
    includeMetadata: z.boolean().default(true),
    // Path filtering
    includePaths: z.array(z.string()).default([]),
    excludePaths: z.array(z.string()).default([]),
    // Content organization
    groupBySection: z.boolean().default(true),
    sectionSelector: z.string().optional(),
  }).optional(),
  outputFormat: z.enum(['markdown', 'json', 'html', 'pdf']).default('markdown'),
  outputOptions: z.object({
    filename: z.string().optional(),
    addFrontmatter: z.boolean().default(true),
    includeSourceUrls: z.boolean().default(true),
    prettify: z.boolean().default(true),
  }).optional(),
});

export type CrawlFormValues = z.infer<typeof crawlFormSchema>;