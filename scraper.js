var json2csv = require('json2csv');
const request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');

//Check for a folder ‘data’. If it exist, create one.
let url = "http://www.shirts4mike.com/";
let products = [];
var fields = ['title', 'price', 'imageurl', 'url'];

//Check for data folder
//if none, create

//request html
request(url+"shirts.php", function(error, response, html){
	  if(!error){
	  	getProductDetails(html);
	  }else{
	  	console.log(error);
	  };
});	

//parse out products from html
function getProductDetails(html){
	let $ = cheerio.load(html);
	let shirtLinks = [];
	$('.products li').each(function(i,element) {
		//get href from nested a in li
		let newPath = $(this).find('a').attr("href");
		shirtLinks.push( url + newPath);
	});	
};



//get the price, title, url and image url from the product page
function scrapeDetails(url){
	
	request(url+path, function(error, response, html){
		if(!error){
			let $ = cheerio.load(html);
			let newShirt = {};
			newShirt.url = url + path;
			newShirt.price = $('.price').text();
			newShirt.title = $('.shirt-details h1').text();
			newShirt.imageurl = url + $('.shirt-picture span img').attr('src');
			products.push(newShirt);
		}else{
			console.log(error);
		}
	});
};

//save CSV 
function saveCSV(results){
	let csv = json2csv({ data: results, fields: fields });
	let timestamp = formatDate(); 
	fs.writeFile(timestamp+'.csv', csv, function(err) {
	  if (err) throw err;
	  console.log('file saved');
	});
};

//format date
function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

//CSV file should be saved inside the ‘data’ folder.
	//If your program is run twice, it should overwrite the data in the CSV file with the updated information.
//log errors to a file named scraper-error.log
	//should append to the bottom of the file with a time stamp and error 
	//e.g. [Tue Feb 16 2016 10:02:12 GMT-0800 (PST)] <error message>