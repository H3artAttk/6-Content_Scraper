const json2csv = require('json2csv');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

//Check for a folder ‘data’. If it exist, create one.
let url = "http://www.shirts4mike.com/";
var fields = ['title', 'price', 'imageurl', 'url','time'];

//Check for data folder
//if none, create

//request html, get links
function getProductLinks(url){
	return new Promise((resolve, reject) => {
		request(url+"shirts.php", function(error, response, html){
		  if(!error && response.statusCode == 200){
		  	let $ = cheerio.load(html);
				let shirtLinks = [];
				$('.products li').each(function(i,element) {
					//get href from nested a in li
					let newPath = $(this).find('a').attr("href");
					shirtLinks.push( url + newPath);
				});
				return resolve(shirtLinks);
		  }else{
		  	console.log('There was an error when trying to connnect to http://shirts4mike.com.')
		  	return reject(error);
		  };
		});	
	});	
}

//scrape each url
function scrapeEach(urls) {
  return Promise.all(urls.map(scrapeDetails)).then(allshirts => {
    return allshirts;
  });
}

//get the price, title, url and image url from the product page
function scrapeDetails(path){	
	return new Promise((resolve, reject) => {
		request(path, function(error, response, html){
			if(!error && response.statusCode == 200){
				let $ = cheerio.load(html);
				let newShirt = {};
				let d = new Date();
				newShirt.url = path;
				newShirt.price = $('span.price').text();
				newShirt.title = $('title').text();
				newShirt.imageurl = url + $('.shirt-picture span img').attr('src');
				newShirt.time = d.toString();				
				return resolve(newShirt);
			}else{
				return reject(new Error('Could not scrape shirt details for: '+url+path));
			}
		});
	});
};

//save CSV 
function saveCSV(results){
	//check for data folder
	if (!fs.existsSync("./data")) {
    console.log('making data folder');
    fs.mkdirSync("./data");
  }
  //save csv
	let csv = json2csv({ data: results, fields: fields });
	let timestamp = formatDate(); 
	fs.writeFile("./data/"+timestamp+'.csv', csv, (err) => {
	  if (err) throw err;
	  console.log('csv file saved!');
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

//run the scraper
getProductLinks(url).then(shirtLinks => {
	return scrapeEach(shirtLinks);
})
.then(allshirts => {
	console.log("saving csv");
	saveCSV(allshirts);
})
.catch(error => {
	fs.appendFileSync("scraper-error.log","[" + new Date() + "] : Error: " + error.message + "\n");
});
