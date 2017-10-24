const csv = require('csv');
const request = require('request');
const cheerio = require('cheerio');
//Check for a folder ‘data’. If it exist, create one.
let url = "http://www.shirts4mike.com/shirts.php";

//request html
request(url, function(error, response, html){
  if(!error){
  	getProducts(html);
  }
});

//parse out products from html
function getProducts(html){
	var $ = cheerio.load(html);
	$('.products li').forEach(function(element) {
		//get href from nested a in li
	});
};

//get the price, title, url and image url from the product page
function getShirtDetails(){
	request();
};

//Should be stored in an CSV file that is named for the date, e.g. 2016-11-21.csv.
//Column headers in this order: Title, Price, ImageURL, URL, and Time
//CSV file should be saved inside the ‘data’ folder.
	//If your program is run twice, it should overwrite the data in the CSV file with the updated information.
//log errors to a file named scraper-error.log
	//should append to the bottom of the file with a time stamp and error 
	//e.g. [Tue Feb 16 2016 10:02:12 GMT-0800 (PST)] <error message>