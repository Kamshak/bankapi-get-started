var querystring = require('querystring');
var http = require('https');
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');

var token = null;
function request(opts, body) {
  var options = _.extend(opts, {
      key:   new Buffer(process.env.SSL_KEY, 'base64'),
      cert:  new Buffer(process.env.SSL_CERT, 'base64'),
      host: "hackathon.postbank.de",                    // Server hostname
      port: 443                                 // Server port
  });
  options.path = options.path.replace('https://hackathon.postbank.de:443/bank-api/blau/postbankid', '');
  options.path = "/bank-api/blau/postbankid" + options.path;

  if (token) {
    options.headers = _.extend(options.headers  || {}, {
      'X-AUTH': token,
      'Content-Type': 'application/json'
    });
  }

  return new Promise((resolve, reject) => {
    var request = http.request(options, function(res) {
        var response = "";
        console.log(`${res.statusCode} - ${options.method}: ${options.host}:${options.port}${options.path}`);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            response += chunk;
        });
        res.on('end', function() {
          var data = JSON.parse(response);
          if (res.statusCode != 200) {
            return reject(data, res);
          } else {
            return resolve(data);
          }
        });
    });

    request.on('error', reject);

    // post the data
    if (body) {
      var bodyData = JSON.stringify(body);
      request.write(bodyData);
    }
    request.end();
  });
}

function post(path, params) {
  return request({
    path: path,
    method: 'POST',
  }, params);
}

function get(path) {
  return request({
    path: path,
    method: 'GET'
  });
}

function ping() {
  return get('/token/' + token);
}

function authenticate() {
  return post('/token?' + querystring.stringify({username: process.env.USERNAME, password: process.env.PASSWORD}), {})
  .then((res) => {
    token = res.token;
    console.log("Authenticated");

    // Start loop to avoid token expiry
    setTimeout(() => {
      ping();
    }, 60000);
  });
}

module.exports = {
  authenticate: authenticate,
  post: post,
  get: get,
  ping: ping
}
