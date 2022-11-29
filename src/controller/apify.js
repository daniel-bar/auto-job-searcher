import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

await Actor.init();

// Create an instance of the PuppeteerCrawler class - a crawler
// that automatically loads the URLs in headless Chrome / Puppeteer.
const crawler = new PuppeteerCrawler({
  // Here you can set options that are passed to the launchPuppeteer() function.
  launchContext: {
    launchOptions: {
      headless: false
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

    const selector =
      "div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(2) > div > div.hirer-card__container > div.hirer-card__hirer-information.pt3.pb3.t-12.t-black--light > a";

    const links = await page.$eval(selector, (el) => el.href);

    console.log(links);
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
