const request = require('request');
const cheerio = require('cheerio')

const url = 'https://www.cwb.gov.tw/V7/forecast/taiwan/New_Taipei_City.htm'

request(url, function (error, response, body) {
 	const $ = cheerio.load(body)
 	let weathers = []
  $('#box8 .FcstBoxTable01 tbody tr').each(function(i, elem) {
    weathers.push(
      $(this)
        .text()
        .split('\n')
    )
  })
	//console.log(weathers);
  weathers = weathers.map(weather => ({
    time: weather[1].substring(2).split(' ')[0],
    temperature: weather[2].substring(2)+' (°C)',
    comfortIndex: weather[5].substring(2),
    pop: weather[6].substring(2),
  }))

  console.log('New_Taipei_City\n', weathers)
  //console.log('error:', error); // Print the error if one occurred
 	//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
});