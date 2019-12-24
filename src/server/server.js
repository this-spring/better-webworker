var express = require('express');
var app = express();
let count = 1;
app.get('/test', function(request, response) {
  count += 1;
  var data = {
    number: count,
  };
  response.header("Access-Control-Allow-Origin", "*");
  response.write(JSON.stringify(data));
  response.end();
});

app.listen('8010', function() {
  console.log("server start success, port is 8010");
});