import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

await Actor.init();

// Create an instance of the PuppeteerCrawler class - a crawler
// that automatically loads the URLs in headless Chrome / Puppeteer.
const crawler = new PuppeteerCrawler({
  // Here you can set options that are passed to the launchPuppeteer() function.
  launchContext: {
    launchOptions: {
      headless: true
      // Other Puppeteer options
    }
  },

  // Stop crawling after several pages
  maxRequestsPerCrawl: 50,

  // This function will be called for each URL to crawl.
  // Here you can write the Puppeteer scripts you are familiar with,
  // with the exception that browsers and pages are automatically managed by the Apify SDK.
  // The function accepts a single parameter, which is an object with the following fields:
  // - request: an instance of the Request class with information such as URL and HTTP method
  // - page: Puppeteer's Page object (see https://pptr.dev/#show=api-class-page)
  async requestHandler({ request, page, enqueueLinks }) {
    console.log(`Processing ${request.url}...`);

    const t = await page.goto(request.url, { waitUntil: "networkidle0" });

    console.log(t);

    const getPTag = await page.$selector("p");

    console.log(getPTag);
  },

  // This function is called if the page processing failed more than maxRequestRetries+1 times.
  failedRequestHandler({ request }) {
    console.log(`Request ${request.url} failed too many times.`);
  }
});

// Run the crawler and wait for it to finish.
await crawler.run([
  "https://www.linkedin.com/jobs/view/3377757004/?originalSubdomain=il"
]);

console.log("Crawler finished.");

await Actor.exit();
