Get Started
Welcome to V1
Firecrawl allows you to turn entire websites into LLM-ready markdown

Firecrawl V1 is here! With that we introduce a more reliable and developer friendly API.

Here is what’s new:

Output Formats for /scrape. Choose what formats you want your output in.
New /map endpoint for getting most of the URLs of a webpage.
Developer friendly API for /crawl/{id} status.
2x Rate Limits for all plans.
Go SDK and Rust SDK
Teams support
API Key Management in the dashboard.
onlyMainContent is now default to true.
/crawl webhooks and websocket support.
​
Scrape Formats
You can now choose what formats you want your output in. You can specify multiple output formats. Supported formats are:

Markdown (markdown)
HTML (html)
Raw HTML (rawHtml) (with no modifications)
Screenshot (screenshot or screenshot@fullPage)
Links (links)
Output keys will match the format you choose.

Python

Node

Go

Rust

cURL

import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

// Scrape a website:
const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] }) as ScrapeResponse;

if (!scrapeResult.success) {
throw new Error(`Failed to scrape: ${scrapeResult.error}`)
}

console.log(scrapeResult)
​
Response
SDKs will return the data object directly. cURL will return the payload exactly as shown below.

{
"success": true,
"data" : {
"markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",
"html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;\"><body class=\"**variable_36bd41 **variable_d7dc5d font-inter ...",
"metadata": {
"title": "Home - Firecrawl",
"description": "Firecrawl crawls and converts any website into clean markdown.",
"language": "en",
"keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
"robots": "follow, index",
"ogTitle": "Firecrawl",
"ogDescription": "Turn any website into LLM-ready data.",
"ogUrl": "https://www.firecrawl.dev/",
"ogImage": "https://www.firecrawl.dev/og.png?123",
"ogLocaleAlternate": [],
"ogSiteName": "Firecrawl",
"sourceURL": "https://firecrawl.dev",
"statusCode": 200
}
}
}
​
Introducing /map (Alpha)
The easiest way to go from a single url to a map of the entire website.

​
Usage

Python

Node

Go

Rust

cURL

import FirecrawlApp, { MapResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

const mapResult = await app.mapUrl('https://firecrawl.dev') as MapResponse;

if (!mapResult.success) {
throw new Error(`Failed to map: ${mapResult.error}`)
}

console.log(mapResult)
​
Response
SDKs will return the data object directly. cURL will return the payload exactly as shown below.

{
"status": "success",
"links": [
"https://firecrawl.dev",
"https://www.firecrawl.dev/pricing",
"https://www.firecrawl.dev/blog",
"https://www.firecrawl.dev/playground",
"https://www.firecrawl.dev/smart-crawl",
...
]
}
​
WebSockets
To crawl a website with WebSockets, use the Crawl URL and Watch method.

Python

Node

const watch = await app.crawlUrlAndWatch('mendable.ai', { excludePaths: ['blog/*'], limit: 5});

watch.addEventListener("document", doc => {
console.log("DOC", doc.detail);
});

watch.addEventListener("error", err => {
console.error("ERR", err.detail.error);
});

watch.addEventListener("done", state => {
console.log("DONE", state.detail.status);
});
​
Extract format
LLM extraction is now available in v1 under the extract format. To extract structured from a page, you can pass a schema to the endpoint or just provide a prompt.

Python

Node

cURL

import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const app = new FirecrawlApp({
apiKey: "fc-YOUR_API_KEY"
});

// Define schema to extract contents into
const schema = z.object({
company_mission: z.string(),
supports_sso: z.boolean(),
is_open_source: z.boolean(),
is_in_yc: z.boolean()
});

const scrapeResult = await app.scrapeUrl("https://docs.firecrawl.dev/", {
formats: ["extract"],
extract: { schema: schema }
});

if (!scrapeResult.success) {
throw new Error(`Failed to scrape: ${scrapeResult.error}`)
}

console.log(scrapeResult.data["extract"]);
Output:

JSON

{
"success": true,
"data": {
"extract": {
"company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
"supports_sso": true,
"is_open_source": false,
"is_in_yc": true
},
"metadata": {
"title": "Mendable",
"description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"robots": "follow, index",
"ogTitle": "Mendable",
"ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"ogUrl": "https://docs.firecrawl.dev/",
"ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
"ogLocaleAlternate": [],
"ogSiteName": "Mendable",
"sourceURL": "https://docs.firecrawl.dev/"
},
}
}
​
Extracting without schema (New)
You can now extract without a schema by just passing a prompt to the endpoint. The llm chooses the structure of the data.

cURL

curl -X POST https://api.firecrawl.dev/v1/scrape \
 -H 'Content-Type: application/json' \
 -H 'Authorization: Bearer YOUR_API_KEY' \
 -d '{
"url": "https://docs.firecrawl.dev/",
"formats": ["extract"],
"extract": {
"prompt": "Extract the company mission from the page."
}
}'
Output:

JSON

{
"success": true,
"data": {
"extract": {
"company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
},
"metadata": {
"title": "Mendable",
"description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"robots": "follow, index",
"ogTitle": "Mendable",
"ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"ogUrl": "https://docs.firecrawl.dev/",
"ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
"ogLocaleAlternate": [],
"ogSiteName": "Mendable",
"sourceURL": "https://docs.firecrawl.dev/"
},
}
}
​
New Crawl Webhook
You can now pass a webhook parameter to the /crawl endpoint. This will send a POST request to the URL you specify when the crawl is started, updated and completed.

The webhook will now trigger for every page crawled and not just the whole result at the end.

cURL

curl -X POST https://api.firecrawl.dev/v1/crawl \
 -H 'Content-Type: application/json' \
 -H 'Authorization: Bearer YOUR_API_KEY' \
 -d '{
"url": "https://docs.firecrawl.dev",
"limit": 100,
"webhook": "https://example.com/webhook"
}'
​
Webhook Events
There are now 4 types of events:

crawl.started - Triggered when the crawl is started.
crawl.page - Triggered for every page crawled.
crawl.completed - Triggered when the crawl is completed to let you know it’s done.
crawl.failed - Triggered when the crawl fails.
​
Webhook Response
success - If the webhook was successful in crawling the page correctly.
type - The type of event that occurred.
id - The ID of the crawl.
data - The data that was scraped (Array). This will only be non empty on crawl.page and will contain 1 item if the page was scraped successfully. The response is the same as the /scrape endpoint.
error - If the webhook failed, this will contain the error message.
​
Migrating from V0
​
/scrape endpoint
The updated /scrape endpoint has been redesigned for enhanced reliability and ease of use. The structure of the new /scrape request body is as follows:

{
"url": "<string>",
"formats": ["markdown", "html", "rawHtml", "links", "screenshot"],
"includeTags": ["<string>"],
"excludeTags": ["<string>"],
"headers": { "<key>": "<value>" },
"waitFor": 123,
"timeout": 123
}
​
Formats
You can now choose what formats you want your output in. You can specify multiple output formats. Supported formats are:

Markdown (markdown)
HTML (html)
Raw HTML (rawHtml) (with no modifications)
Screenshot (screenshot or screenshot@fullPage)
Links (links)
By default, the output will be include only the markdown format.

​
Details on the new request body
The table below outlines the changes to the request body parameters for the /scrape endpoint in V1.

Parameter Change Description
onlyIncludeTags Moved and Renamed Moved to root level. And renamed to includeTags.
removeTags Moved and Renamed Moved to root level. And renamed to excludeTags.
onlyMainContent Moved Moved to root level. true by default.
waitFor Moved Moved to root level.
headers Moved Moved to root level.
parsePDF Moved Moved to root level.
extractorOptions No Change
timeout No Change
pageOptions Removed No need for pageOptions parameter. The scrape options were moved to root level.
replaceAllPathsWithAbsolutePaths Removed replaceAllPathsWithAbsolutePaths is not needed anymore. Every path is now default to absolute path.
includeHtml Removed add "html" to formats instead.
includeRawHtml Removed add "rawHtml" to formats instead.
screenshot Removed add "screenshot" to formats instead.
fullPageScreenshot Removed add "screenshot@fullPage" to formats instead.
extractorOptions Removed Use "extract" format instead with extract object.
The new extract format is described in the llm-extract section.

​
/crawl endpoint
We’ve also updated the /crawl endpoint on v1. Check out the improved body request below:

{
"url": "<string>",
"excludePaths": ["<string>"],
"includePaths": ["<string>"],
"maxDepth": 2,
"ignoreSitemap": true,
"limit": 10,
"allowBackwardLinks": true,
"allowExternalLinks": true,
"scrapeOptions": {
// same options as in /scrape
"formats": ["markdown", "html", "rawHtml", "screenshot", "links"],
"headers": { "<key>": "<value>" },
"includeTags": ["<string>"],
"excludeTags": ["<string>"],
"onlyMainContent": true,
"waitFor": 123
}
}
​
Details on the new request body
The table below outlines the changes to the request body parameters for the /crawl endpoint in V1.

Parameter Change Description
pageOptions Renamed Renamed to scrapeOptions.
includes Moved and Renamed Moved to root level. Renamed to includePaths.
excludes Moved and Renamed Moved to root level. Renamed to excludePaths.
allowBackwardCrawling Moved and Renamed Moved to root level. Renamed to allowBackwardLinks.
allowExternalLinks Moved Moved to root level.
maxDepth Moved Moved to root level.
ignoreSitemap Moved Moved to root level.
limit Moved Moved to root level.
crawlerOptions Removed No need for crawlerOptions parameter. The crawl options were moved to root level.
timeout Removed Use timeout in scrapeOptions instead.

SDKs

# Node

Firecrawl Node SDK is a wrapper around the Firecrawl API to help you easily turn websites into markdown.

[​](http://docs.firecrawl.dev/sdks/node#installation)

## Installation

To install the Firecrawl Node SDK, you can use npm:

Node

```bash
npm install @mendable/firecrawl-js
```

[​](http://docs.firecrawl.dev/sdks/node#usage)

## Usage

1.  Get an API key from [firecrawl.dev](https://firecrawl.dev/)
2.  Set the API key as an environment variable named `FIRECRAWL_API_KEY` or pass it as a parameter to the `FirecrawlApp` class.

Here’s an example of how to use the SDK with error handling:

Node

```js
import FirecrawlApp, { CrawlParams, CrawlStatusResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

// Scrape a website
const scrapeResponse = await app.scrapeUrl('https://firecrawl.dev', {
  formats: ['markdown', 'html'],
});

if (!scrapeResponse.success) {
  throw new Error(`Failed to scrape: ${scrapeResponse.error}`)
}

console.log(scrapeResponse)

// Crawl a website
const crawlResponse = await app.crawlUrl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
});

if (!crawlResponse.success) {
  throw new Error(`Failed to crawl: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

###

[​](http://docs.firecrawl.dev/sdks/node#scraping-a-url)

Scraping a URL

To scrape a single URL with error handling, use the `scrapeUrl` method. It takes the URL as a parameter and returns the scraped data as a dictionary.

Node

```js
// Scrape a website:
const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] });

if (!scrapeResult.success) {
  throw new Error(`Failed to scrape: ${scrapeResult.error}`)
}

console.log(scrapeResult)
```

###

[​](http://docs.firecrawl.dev/sdks/node#crawling-a-website)

Crawling a Website

To crawl a website with error handling, use the `crawlUrl` method. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

Node

```js
const crawlResponse = await app.crawlUrl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
})

if (!crawlResponse.success) {
  throw new Error(`Failed to crawl: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

###

[​](http://docs.firecrawl.dev/sdks/node#asynchronous-crawling)

Asynchronous Crawling

To crawl a website asynchronously, use the `crawlUrlAsync` method. It returns the crawl `ID` which you can use to check the status of the crawl job. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

Node

```js
const crawlResponse = await app.asyncCrawlUrl('https://firecrawl.dev', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
});

if (!crawlResponse.success) {
  throw new Error(`Failed to crawl: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

###

[​](http://docs.firecrawl.dev/sdks/node#checking-crawl-status)

Checking Crawl Status

To check the status of a crawl job with error handling, use the `checkCrawlStatus` method. It takes the `ID` as a parameter and returns the current status of the crawl job.

Node

```js
const crawlResponse = await app.checkCrawlStatus("<crawl_id>");

if (!crawlResponse.success) {
  throw new Error(`Failed to check crawl status: ${crawlResponse.error}`)
}

console.log(crawlResponse)
```

###

[​](http://docs.firecrawl.dev/sdks/node#cancelling-a-crawl)

Cancelling a Crawl

To cancel an asynchronous crawl job, use the `cancelCrawl` method. It takes the job ID of the asynchronous crawl as a parameter and returns the cancellation status.

Node

```js
const cancelCrawl = await app.cancelCrawl(id);
console.log(cancelCrawl)
```

###

[​](http://docs.firecrawl.dev/sdks/node#mapping-a-website)

Mapping a Website

To map a website with error handling, use the `mapUrl` method. It takes the starting URL as a parameter and returns the mapped data as a dictionary.

Node

```js
const mapResult = await app.mapUrl('https://firecrawl.dev');

if (!mapResult.success) {
  throw new Error(`Failed to map: ${mapResult.error}`)
}

console.log(mapResult)
```

###

[​](http://docs.firecrawl.dev/sdks/node#crawling-a-website-with-websockets)

Crawling a Website with WebSockets

To crawl a website with WebSockets, use the `crawlUrlAndWatch` method. It takes the starting URL and optional parameters as arguments. The `params` argument allows you to specify additional options for the crawl job, such as the maximum number of pages to crawl, allowed domains, and the output format.

Node

```js
const watch = await app.crawlUrlAndWatch('mendable.ai', { excludePaths: ['blog/*'], limit: 5});

watch.addEventListener("document", doc => {
  console.log("DOC", doc.detail);
});

watch.addEventListener("error", err => {
  console.error("ERR", err.detail.error);
});

watch.addEventListener("done", state => {
  console.log("DONE", state.detail.status);
});
```

[​](http://docs.firecrawl.dev/sdks/node#error-handling)

## Error Handling

The SDK handles errors returned by the Firecrawl API and raises appropriate exceptions. If an error occurs during a request, an exception will be raised with a descriptive error message. The examples above demonstrate how to handle these errors using `try/catch` blocks.

[Python](http://docs.firecrawl.dev/sdks/python)[Go](http://docs.firecrawl.dev/sdks/go)

[x](https://x.com/mendableai)[github](https://github.com/mendableai/firecrawl)[linkedin](https://www.linkedin.com/company/sideguide-dev/)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=docs&utm_source=docs.firecrawl.dev)

On this page

- [Installation](http://docs.firecrawl.dev/sdks/node#installation)
- [Usage](http://docs.firecrawl.dev/sdks/node#usage)
- [Scraping a URL](http://docs.firecrawl.dev/sdks/node#scraping-a-url)
- [Crawling a Website](http://docs.firecrawl.dev/sdks/node#crawling-a-website)
- [Asynchronous Crawling](http://docs.firecrawl.dev/sdks/node#asynchronous-crawling)
- [Checking Crawl Status](http://docs.firecrawl.dev/sdks/node#checking-crawl-status)
- [Cancelling a Crawl](http://docs.firecrawl.dev/sdks/node#cancelling-a-crawl)
- [Mapping a Website](http://docs.firecrawl.dev/sdks/node#mapping-a-website)
- [Crawling a Website with WebSockets](http://docs.firecrawl.dev/sdks/node#crawling-a-website-with-websockets)
- [Error Handling](http://docs.firecrawl.dev/sdks/node#error-handling)

Title: Advanced Scraping Guide | Firecrawl

URL Source: http://docs.firecrawl.dev/advanced-scraping-guide

Markdown Content:
This guide will walk you through the different endpoints of Firecrawl and how to use them fully with all its parameters.

## Basic scraping with Firecrawl (/scrape)

To scrape a single page and get clean markdown content, you can use the `/scrape` endpoint.

## Scraping PDFs

**Firecrawl supports scraping PDFs by default.** You can use the `/scrape` endpoint to scrape a PDF link and get the text content of the PDF. You can disable this by setting `parsePDF` to `false`.

## Scrape Options

When using the `/scrape` endpoint, you can customize the scraping behavior with many parameters. Here are the available options:

### Setting the content formats on response with `formats`

- **Type**: `array`
- **Enum**: `["markdown", "links", "html", "rawHtml", "screenshot"]`
- **Description**: Specify the formats to include in the response. Options include:
  - `markdown`: Returns the scraped content in Markdown format.
  - `links`: Includes all hyperlinks found on the page.
  - `html`: Provides the content in HTML format.
  - `rawHtml`: Delivers the raw HTML content, without any processing.
  - `screenshot`: Includes a screenshot of the page as it appears in the browser.
  - `extract`: Extracts structured information from the page using the LLM.
- **Default**: `["markdown"]`

### Getting the full page content as markdown with `onlyMainContent`

- **Type**: `boolean`
- **Description**: By default, the scraper will only return the main content of the page, excluding headers, navigation bars, footers, etc. Set this to `false` to return the full page content.
- **Default**: `true`

### Setting the tags to include with `includeTags`

- **Type**: `array`
- **Description**: Specify the HTML tags, classes and ids to include in the response.
- **Default**: undefined

### Setting the tags to exclude with `excludeTags`

- **Type**: `array`
- **Description**: Specify the HTML tags, classes and ids to exclude from the response.
- **Default**: undefined

### Waiting for the page to load with `waitFor`

- **Type**: `integer`
- **Description**: To be used only as a last resort. Wait for a specified amount of milliseconds for the page to load before fetching content.
- **Default**: `0`

### Setting the maximum `timeout`

- **Type**: `integer`
- **Description**: Set the maximum duration in milliseconds that the scraper will wait for the page to respond before aborting the operation.
- **Default**: `30000` (30 seconds)

### Example Usage

In this example, the scraper will:

- Return the full page content as markdown.
- Include the markdown, raw HTML, HTML, links and screenshot in the response.
- The response will include only the HTML tags `<h1>`, `<p>`, `<a>`, and elements with the class `.main-content`, while excluding any elements with the IDs `#ad` and `#footer`.
- Wait for 1000 milliseconds (1 second) for the page to load before fetching the content.
- Set the maximum duration of the scrape request to 15000 milliseconds (15 seconds).

Here is the API Reference for it: [Scrape Endpoint Documentation](https://docs.firecrawl.dev/api-reference/endpoint/scrape)

When using the `/scrape` endpoint, you can specify options for **extracting structured information** from the page content using the `extract` parameter. Here are the available options:

### schema

- **Type**: `object`
- **Required**: False if prompt is provided
- **Description**: The schema for the data to be extracted. This defines the structure of the extracted data.

### system prompt

- **Type**: `string`
- **Required**: False
- **Description**: System prompt for the LLM.

### prompt

- **Type**: `string`
- **Required**: False if schema is provided
- **Description**: A prompt for the LLM to extract the data in the correct structure.
- **Example**: `"Extract the features of the product"`

### Example Usage

## Actions

When using the `/scrape` endpoint, Firecrawl allows you to perform various actions on a web page before scraping its content. This is particularly useful for interacting with dynamic content, navigating through pages, or accessing content that requires user interaction.

### Available Actions

#### wait

- **Type**: `object`
- **Description**: Wait for a specified amount of milliseconds.
- **Properties**:
  - `type`: `"wait"`
  - `milliseconds`: Number of milliseconds to wait.
- **Example**:

#### screenshot

- **Type**: `object`
- **Description**: Take a screenshot.
- **Properties**:
  - `type`: `"screenshot"`
  - `fullPage`: Should the screenshot be full-page or viewport sized? (default: `false`)
- **Example**:

#### click

- **Type**: `object`
- **Description**: Click on an element.
- **Properties**:
  - `type`: `"click"`
  - `selector`: Query selector to find the element by.
- **Example**:

#### write

- **Type**: `object`
- **Description**: Write text into an input field.
- **Properties**:
  - `type`: `"write"`
  - `text`: Text to type.
  - `selector`: Query selector for the input field.
- **Example**:

#### press

- **Type**: `object`
- **Description**: Press a key on the page.
- **Properties**:
  - `type`: `"press"`
  - `key`: Key to press.
- **Example**:

#### scroll

- **Type**: `object`
- **Description**: Scroll the page.
- **Properties**:
  - `type`: `"scroll"`
  - `direction`: Direction to scroll (`"up"` or `"down"`).
  - `amount`: Amount to scroll in pixels.
- **Example**:

For more details about the actions parameters, refer to the [API Reference](https://docs.firecrawl.dev/api-reference/endpoint/scrape).

## Crawling Multiple Pages

To crawl multiple pages, you can use the `/crawl` endpoint. This endpoint allows you to specify a base URL you want to crawl and all accessible subpages will be crawled.

Returns a id

### Check Crawl Job

Used to check the status of a crawl job and get its result.

If the content is larger than 10MB or if the crawl job is still running, the response will include a `next` parameter. This parameter is a URL to the next page of results. You can use this parameter to get the next page of results.

### Crawler Options

When using the `/crawl` endpoint, you can customize the crawling behavior with request body parameters. Here are the available options:

#### `includePaths`

- **Type**: `array`
- **Description**: URL patterns to include in the crawl. Only URLs matching these patterns will be crawled.
- **Example**: `["/blog/*", "/products/*"]`

#### `excludePaths`

- **Type**: `array`
- **Description**: URL patterns to exclude from the crawl. URLs matching these patterns will be skipped.
- **Example**: `["/admin/*", "/login/*"]`

#### `maxDepth`

- **Type**: `integer`
- **Description**: Maximum depth to crawl relative to the entered URL. A maxDepth of 0 scrapes only the entered URL. A maxDepth of 1 scrapes the entered URL and all pages one level deep. A maxDepth of 2 scrapes the entered URL and all pages up to two levels deep. Higher values follow the same pattern.
- **Example**: `2`

#### `limit`

- **Type**: `integer`
- **Description**: Maximum number of pages to crawl.
- **Default**: `10000`

#### `allowBackwardLinks`

- **Type**: `boolean`
- **Description**: This option permits the crawler to navigate to URLs that are higher in the directory structure than the base URL. For instance, if the base URL is `example.com/blog/topic`, enabling this option allows crawling to pages like `example.com/blog` or `example.com`, which are backward in the path hierarchy relative to the base URL.
- **Default**: `false`

### `allowExternalLinks`

- **Type**: `boolean`
- **Description**: This option allows the crawler to follow links that point to external domains. Be careful with this option, as it can cause the crawl to stop only based only on the`limit` and `maxDepth` values.
- **Default**: `false`

#### scrapeOptions

As part of the crawler options, you can also specify the `scrapeOptions` parameter. This parameter allows you to customize the scraping behavior for each page.

- **Type**: `object`
- **Description**: Options for the scraper.
- **Example**: `{"formats": ["markdown", "links", "html", "rawHtml", "screenshot"], "includeTags": ["h1", "p", "a", ".main-content"], "excludeTags": ["#ad", "#footer"], "onlyMainContent": false, "waitFor": 1000, "timeout": 15000}`
- **Default**: `{ "formats": ["markdown"] }`
- **See**: [Scrape Options](https://docs.firecrawl.dev/advanced-scraping-guide#setting-the-content-formats-on-response-with-formats)

### Example Usage

In this example, the crawler will:

- Only crawl URLs that match the patterns `/blog/*` and `/products/*`.
- Skip URLs that match the patterns `/admin/*` and `/login/*`.
- Return the full document data for each page.
- Crawl up to a maximum depth of 2.
- Crawl a maximum of 1000 pages.

## Mapping Website Links with `/map`

The `/map` endpoint is adept at identifying URLs that are contextually related to a given website. This feature is crucial for understanding a site’s contextual link environment, which can greatly aid in strategic site analysis and navigation planning.

### Usage

To use the `/map` endpoint, you need to send a GET request with the URL of the page you want to map. Here is an example using `curl`:

This will return a JSON object containing links contextually related to the url.

### Example Response

### Map Options

#### `search`

- **Type**: `string`
- **Description**: Search for links containing specific text.
- **Example**: `"blog"`

#### `limit`

- **Type**: `integer`
- **Description**: Maximum number of links to return.
- **Default**: `100`

#### `ignoreSitemap`

- **Type**: `boolean`
- **Description**: Ignore the website sitemap when crawling
- **Default**: `true`

#### `includeSubdomains`

- **Type**: `boolean`
- **Description**: Include subdomains of the website
- **Default**: `false`

Here is the API Reference for it: [Map Endpoint Documentation](https://docs.firecrawl.dev/api-reference/endpoint/map)
