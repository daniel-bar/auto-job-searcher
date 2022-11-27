import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

const linkedInUser = {email: 'email', password: "password"}

await Actor.init();

// Create an instance of the PuppeteerCrawler class - a crawler
// that automatically loads the URLs in headless Chrome / Puppeteer.
const crawler = new PuppeteerCrawler({
  // Here you can set options that are passed to the launchPuppeteer() function.
  launchContext: {
    launchOptions: {
      headless: false,
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
    
    await page.goto('https://www.linkedin.com/login', { waitUntil: "networkidle0" });
    
    await page.type('#username', linkedInUser.email)
    
    await page.type('#password', linkedInUser.password)
    
    await page.click('.btn__primary--large.from__button--floating')
    
    await page.waitForNavigation()
    
    await page.goto(request.url, { waitUntil: "networkidle0" });

    await page.type('#msg-overlay-list-bubble-search__search-typeahead-input', 'asd')
    
    await page.click('jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view')

    await page.waitForNavigation()
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
