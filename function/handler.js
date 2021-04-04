const {scrapper} = require('../util/scrapper')

module.exports.scrap = async (event,context,callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const {url} = JSON.parse(event.body);
    // return if url not provided or invalid
    if(!url || url == ''){
      callback(null,{
        "statusCode": 400,
        "headers": { 'Content-Type': 'text/plain' },
        "body": 'Invalid request url, please try again.'
      });
     
    }
    //get scrapped data.
    let resData = await scrapper(url);
    
    //return only of resData has ogdata property.
    if(resData.hasOwnProperty('ogData')){
        callback(null,{
          "statusCode": 200,
          "body": JSON.stringify(resData)
        });
      }else{
        callback(null,{
          "statusCode": 500,
          "headers": { 'Content-Type': 'text/plain' },
          "body": 'Error fetching data, please try again.'
        },null);
      }
  } catch (error) {
      callback(null,{
        "statusCode": 500,
        "headers": { 'Content-Type': 'text/plain' },
        "body": 'Error fetching data, please try again.'
      },null)
    }
};
