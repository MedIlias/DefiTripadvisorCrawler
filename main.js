const axios = require('axios');
const cheerio = require('cheerio');
const wget = require('node-wget');
const { parse } = require('node-html-parser');
const fs = require('fs');


const listSelector = 'div[data-test-target="restaurants-list"] > div > div > div > div > div > div > div > a';
const nameSelector = 'h1[data-test-target="top-info-header"]';
const phoneSelector = 'span[data-test-target="restaurant-detail-info-phone"]';


const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
  'Referer': 'https://www.tripadvisor.be/'
};





function getRestaurantInfo(html) {
  const root = parse(html);

  const name = root.querySelector(nameSelector).textContent.trim();
  const phone = root.querySelector(phoneSelector).textContent.trim();

  return { name, phone };
}

async function scrapeList(url) {
  try {
    const response = await axios.get(url, { headers });
    const html = response.data;
    const root = parse(html);

    const restaurantUrls = root.querySelectorAll(listSelector)
      .map((element) => element.getAttribute('href'));

    const restaurantPromises = restaurantUrls.map(async (restaurantUrl) => {
      const absoluteUrl = `https://www.tripadvisor.be${restaurantUrl}`;
      const response = await axios.get(absoluteUrl);
      const restaurantHtml = response.data;
      return getRestaurantInfo(restaurantHtml);
    });

    return Promise.all(restaurantPromises);
  } catch (error) {
    throw error;
  }
}

scrapeList("https://fr.tripadvisor.be/Restaurants-g188646-Charleroi_Hainaut_Province_Wallonia.html")
  .then((output) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `${timestamp}.json`;
    const jsonData = JSON.stringify(output);

    fs.writeFile(fileName, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log(`Data saved to ${fileName}`);
      }
    });
  })
  .catch((err) => {
    console.error('Error scraping data:', err);
  });






/*
async function main(maxPages = 50) { 
	// initialized with the first webpage to visit 
	const paginationURLsToVisit = ["https://fr.tripadvisor.be/Restaurants-g188646-Charleroi_Hainaut_Province_Wallonia.html"]; 
	const visitedURLs = []; 
 
	const productURLs = new Set(); 
 
	// iterating until the queue is empty 
	// or the iteration limit is hit 
	while ( 
		paginationURLsToVisit.length !== 0 && 
		visitedURLs.length <= maxPages 
	) { 
		// the current webpage to crawl 
		const paginationURL = paginationURLsToVisit.pop(); 
 
		// retrieving the HTML content from paginationURL 
		const pageHTML = await axios.get(paginationURL); 
 
		// adding the current webpage to the 
		// web pages already crawled 
		visitedURLs.push(paginationURL); 
 
		// initializing cheerio on the current webpage 
		const $ = cheerio.load(pageHTML.data); 
 
		// retrieving the pagination URLs 
		$(".page-numbers a").each((index, element) => { 
			const paginationURL = $(element).attr("href"); 
 
			// adding the pagination URL to the queue 
			// of web pages to crawl, if it wasn't yet crawled 
			if ( 
				!visitedURLs.includes(paginationURL) && 
				!paginationURLsToVisit.includes(paginationURL) 
			) { 
				paginationURLsToVisit.push(paginationURL); 
			} 
		}); 
 
		// retrieving the product URLs 
		$("li.product a.woocommerce-LoopProduct-link").each((index, element) => { 
			const productURL = $(element).attr("href"); 
			productURLs.add(productURL); 
		}); 
	} 
 
	// logging the crawling results 
	console.log([...productURLs]); 
 
	// use productURLs for scraping purposes... 
} 
 
// running the main() function 
main() 
	.then(() => { 
		// successful ending 
		process.exit(0); 
	}) 
	.catch((e) => { 
		// logging the error message 
		console.error(e); 
 
		// unsuccessful ending 
		process.exit(1); 
	});



*/






/*

async function getRestaurantInfo(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const name = $(nameSelector).text().trim();
  const phone = $(phoneSelector).text().trim();

  return { name, phone };
}



async function scrapeList(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const restaurantUrls = $(listSelector).map((_, element) => $(element).attr('href')).get();

  const restaurantPromises = restaurantUrls.map(async (restaurantUrl) => {
    const absoluteUrl = `https://www.tripadvisor.be${restaurantUrl}`;
    return await getRestaurantInfo(absoluteUrl);
  });

  return Promise.all(restaurantPromises);
}







const listUrl = 'https://fr.tripadvisor.be/Restaurants-g188646-Charleroi_Hainaut_Province_Wallonia.html';

scrapeList(listUrl)
  .then((output) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `${timestamp}.json`;
    const jsonData = JSON.stringify(output);

    fs.writeFile(fileName, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log(`Data saved to ${fileName}`);
      }
    });
  })
  .catch((err) => {
    console.error('Error scraping data:', err);
  });

*/




















