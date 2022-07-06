//Packages
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const url = 'https://www.amazon.in/Apple-iPhone-13-128GB-Green/dp/B09V4B6K53/ref=sr_1_4?qid=1657039349&refinements=p_6%3AA14CZOWI0VEHLG%7CA1P3OPO356Q9ZB%7CA2HIN95H5BP4BL%2Cp_89%3AApple&s=electronics&sr=1-4'

const product = {name:"", price:"", link:""};

//Set Interval
const handle = setInterval(scrape, 86400000);

async function scrape(){
    //Fetch Data
    const {data} = await axios.get(url);
    //Load up the html
    const $ = cheerio.load(data);
    const item = $('div#dp');
    //Extract the data that we need
    product.name = $(item).find("h1 span#productTitle").text().replace(/ /g,"");
    product.link = url;
    const price = parseInt($(item).find("span .a-offscreen").first().text().replace(/[₹,]/g, ""));
    product.price = price
    console.log(product);

    //Send an SMS
    if(price < 74000){
        client.messages.create({
            body: `The price of ${product.name} is now ₹${product.price}. Purchase it at ${product.link}`,
            from: "+197050*****",
            to: "+91**********",
        }).then((message) => {
            console.log(message);
            clearInterval(handle);
        });
    }

}

scrape();