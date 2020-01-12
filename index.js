const http = require('http');

exports.handler = async (event, context) => {

  console.log("params: " + event.queryStringParameters.ip);
  
  return new Promise((resolve, reject) => {

    var ip = event.queryStringParameters.ip;
    
    console.log('chunk: inside: ip-api: ' + ip + '\n');

    const options = {
        host: 'ip-api.com',
        path: "/json/" + ip,
        port: 80,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`STATUS: ip-api: code: ${res.statusCode}\n`);
      console.log(`HEADERS: ip-api: ${JSON.stringify(res.headers)}\n`);
    
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
          console.log(`BODY: ip-api: ${chunk}\n`);
          console.log('chunk: ip-api: ' + chunk + '\n');
          resolve(chunk);
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    // send the request
    req.write('');
    req.end();
  }).then (function(chunk) {
  
    return new Promise((resolve, reject) => {
      
      var parsedResponse = JSON.parse(chunk);
      var query = encodeURI(parsedResponse.query);
      var city = encodeURI(parsedResponse.city);
      var state = encodeURI(parsedResponse.region);
      var country = encodeURI(parsedResponse.countryCode);
      var zip = encodeURI(parsedResponse.zip);
      var concatenatedLocation = "IP%3A%20" + query + "%20%2F%20" + city + "%2C%20" + state + "%2C%20" + country + "%20%2F%20";
      
      console.log('chunk: inside: inside: pushover: ' + parsedResponse.city + '\n');
      console.log('chunk: inside: inside: pushover: ' + parsedResponse.region + '\n');
      console.log('chunk: inside: inside: pushover: ' + parsedResponse.countryCode + '\n');
      console.log('chunk: inside: inside: pushover: ' + parsedResponse.query + '\n');
      console.log('chunk: inside: inside: pushover: concat: ' + concatenatedLocation + '\n');

      const options = {
          host: 'api.pushover.net',
          path: "/1/messages.json?token=&user=&message=" + concatenatedLocation + "someone%20is%20on%20website&title=visitor",
          port: 80,
          method: 'POST'
      };

      const req = http.request(options, (res) => {
        console.log(`STATUS: pushover: ${res.statusCode}\n`);

        resolve('Success: pushover');
      });

      req.on('error', (e) => {
        reject(e.message);
      });

      // send the request
      req.write('');
      req.end();
    });
  });
};
