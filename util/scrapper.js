const chromium = require('chrome-aws-lambda');
const cheerio = require("cheerio");
const redis = require('redis');

/**
 * @param  {String} url
 * Function takes url, scrap og data and returns promise with scrapped data 
 */
module.exports.scrapper = async (url) => {

    return new Promise ( async (resolve, reject) => {
        try {

            //redis client invocation
            const client = await redis.createClient(process.env.REDIS_URL);
            await client.auth(process.env.REDIS_AUTH);
            let ogObject = {};
            let ogDefaultObject = {};
            
            //if available in cache then return data else call url.
            client.get(url, async (err,data) => {
                if(data){
                    resolve({"ogData":data});
                }else{
                    let path = await chromium.executablePath;
                    chromium.puppeteer
                    .launch({
                        args: chromium.args,
                        defaultViewport: chromium.defaultViewport,
                        executablePath: path,
                        headless: chromium.headless,
                        ignoreHTTPSErrors: true,
                      })
                    .then(function (browser) {
                        return browser.newPage();
                    })
                    .then(function (page) {
                        return page.goto(url).then(function () {
                            return page.content();
                        });
                    })
                    .then(function (html) {
                        const $ = cheerio.load(html);
                        // iterate meta tags to get the ogdata
                        $("meta").each((index, meta) => {
                            console.log('index'+ index);
                        
                            if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name) || (!meta.name && !meta.content)) return;
                        
                            const property = meta.attribs.property || meta.attribs.name;
                            const content = meta.attribs.content || meta.attribs.value;
                            
                            if (property.indexOf("og") > -1) {
                                ogObject[property] = content;
                            } else {
                                ogDefaultObject[property] = content;
                            }
                        });
                        // if og data is not present, send default tags
                        ogObject = JSON.stringify(ogObject).indexOf('og') == -1 ? ogDefaultObject : ogObject;
                        //set data to redis cache
                        client.setex(url, 3600, JSON.stringify(ogObject))
                        resolve({"ogData":ogObject})
                    })
                    .catch(function (err) {
                        reject(new Error(err))
                    });
                }
            });   
        } catch (error) {
            reject(new Error(error));
        }
    });
}

