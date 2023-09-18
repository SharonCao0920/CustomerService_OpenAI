
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');


const https = require('https');
const http = require('http');
const urlModule = require('url');
const { JSDOM } = require('jsdom');
const { Readable } = require('stream');

// const { TextEncoder } = require('util');
// const { pipeline } = require('stream');
// const { promisify } = require('util');

// const pipelineAsync = promisify(pipeline);

// Regex pattern to match a URL
const HTTP_URL_PATTERN = /^http[s]*:\/\/.+/;

// Define root domain to crawl
const domain = "openai.com";
const full_url = "https://openai.com/";

// Function to get the hyperlinks from a URL
async function getHyperlinks(url) {
    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.startsWith('text/html')) {
            return [];
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const links = [];
        
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                links.push(href);
            }
        });
        
        return links;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to get the hyperlinks from a URL that are within the same domain
function getDomainHyperlinks(localDomain, url) {
    const cleanLinks = [];
    const links = getHyperlinks(url);
    
    links.forEach(link => {
        let cleanLink = null;

        if (HTTP_URL_PATTERN.test(link)) {
            const parsedUrl = urlModule.parse(link);
            if (parsedUrl.hostname === localDomain) {
                cleanLink = link;
            }
        } else {
            if (link.startsWith('/')) {
                link = link.slice(1);
            } else if (link.startsWith('#') || link.startsWith('mailto:')) {
                return;
            }
            cleanLink = `https://${localDomain}/${link}`;
        }

        if (cleanLink) {
            if (cleanLink.endsWith('/')) {
                cleanLink = cleanLink.slice(0, -1);
            }
            cleanLinks.push(cleanLink);
        }
    });

    return Array.from(new Set(cleanLinks));
}

// Step 1: Crawl Web Pages

async function crawl(url) {
    const localDomain = new URL(url).hostname;
    const queue = [url];
    const seen = new Set([url]);
  
    if (!fs.existsSync('text')) {
      await fs.mkdir('text');
    }
  
    if (!fs.existsSync(`text/${localDomain}`)) {
      await fs.mkdir(`text/${localDomain}`);
    }
  
    if (!fs.existsSync('processed')) {
      await fs.mkdir('processed');
    }
  
    while (queue.length > 0) {
      const currentUrl = queue.pop();
      console.log(currentUrl); // for debugging and progress
  
      try {
        const response = await axios.get(currentUrl);
        const text = response.data;
  
        if (text.includes('You need to enable JavaScript to run this app.')) {
          console.log(`Unable to parse page ${currentUrl} due to JavaScript being required`);
        } else {
          const fileName = currentUrl.substring(8).replace(/\//g, '_') + '.txt';
          const filePath = path.join('text', localDomain, fileName);
  
          await fs.writeFile(filePath, text);
        }
  
        const $ = cheerio.load(text);
        const links = $('a');
        links.each((_, link) => {
          const href = $(link).attr('href');
          if (href && !seen.has(href)) {
            queue.push(href);
            seen.add(href);
          }
        });
      } catch (error) {
        console.error(`Error fetching ${currentUrl}:`, error.message);
      }
    }
  }
  
  // Step 5: Text Cleaning Function
  
  function removeNewlines(serie) {
    serie = serie.replace(/\n/g, ' ');
    serie = serie.replace(/\\n/g, ' ');
    serie = serie.replace(/ {2,}/g, ' ');
    return serie;
  }
  
  // Step 6: Process Crawled Texts
  
  (async function () {
    const texts = [];
  
    const domain = ''; // Set the domain here
  
    try {
      const textFiles = await fs.readdir(`text/${domain}`);
      for (const file of textFiles) {
        const filePath = path.join('text', domain, file);
        const stats = await fs.stat(filePath);
  
        if (stats.isFile()) {
          const text = await fs.readFile(filePath, 'utf-8');
  
          const cleanedFileName = file.substring(11, file.length - 4).replace(/-/g, ' ').replace(/_/g, ' ').replace(/#update/g, '');
          texts.push({ fileName: cleanedFileName, text });
        } else {
          console.log(`Skipped directory: ${filePath}`);
        }
      }
  
      // Create the "processed" directory if it doesn't exist
      try {
        await fs.mkdir('processed');
      } catch (mkdirError) {
        if (mkdirError.code !== 'EEXIST') {
          throw mkdirError;
        }
      }
  
      const processedTexts = texts.map(({ fileName, text }) => {
        const cleanedText = removeNewlines(text);
        return `${fileName}. ${cleanedText}`;
      });
  
      const processedCSV = processedTexts.join('\n');
      await fs.writeFile('processed/scraped.csv', processedCSV);
  
      console.log('Processing complete.');
    } catch (error) {
      console.error('Error during processing:', error.message);
    }
  })();