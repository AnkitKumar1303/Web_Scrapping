const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require('xlsx');
let productList = [];

// Function to fetch data from Flipkart
const fetchDataFromFlipkart = async () => {
  try {
    const response = await axios.get(
      "https://www.flipkart.com/search?q=mobile+5g&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_1_6_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_6_na_na_na&as-pos=1&as-type=RECENT&suggestionId=mobile+5g%7CMobiles&requestId=460f8f7a-a221-43a7-b335-4b2df59f97f3&as-backfill=on",
      {
        headers: {
          'Content-Type': "text/html"
        }
      }
    );
    const data = response.data;
    const $ = cheerio.load(data);
    const productContainers = $('._1AtVbE.col-12-12');
    $(productContainers).each((index, element) => {
      let title = $(element).find('._4rR01T').text();
      let price = $(element).find("._30jeq3._1_WHN1").text();
      let rating = $(element).find("._3LWZlK").text();
      productList.push({ title, price, rating });
    });

    console.log(productList);

    // Create workbook 
    const workbook = xlsx.utils.book_new();
    
    // Prepare data for worksheet
    const sheetData = [
      ["Title", "Price", "Rating"],
      ...productList.map((product) => [product.title, product.price, product.rating]),
    ];

    const workSheet = xlsx.utils.aoa_to_sheet(sheetData);
    
    // Append data to workbook
    xlsx.utils.book_append_sheet(workbook, workSheet, 'Sheet1');

    // Write data to XLSX file
    xlsx.writeFile(workbook, 'output.xlsx');
    console.log('XLSX file created successfully!');

  } catch (error) {
    console.log(error);
  }
};

// Call the function to fetch data from Flipkart
fetchDataFromFlipkart();
