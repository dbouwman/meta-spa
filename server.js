'use strict';
require("isomorphic-fetch");
require("isomorphic-form-data");

const http = require('http'),
      express = require('express'),
      Items = require('@esri/arcgis-rest-items');

const app = express();

// use hbs view engine, but attach it to .html
app.set('views', './')
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// Only have one route...
app.get('/', function(req, res){
  console.info(`appId: ${req.query.appId}`);
  // TODO: set the env in a config file
  let reqOpts = {
    portal: 'https://qaext.arcgis.com/sharing/rest'
  };
  // if there is an appId ...
  if (req.query.appId) {
    // fetch the item...
    Items.getItem(req.query.appId, reqOpts)
    .then((item) => {
      // construct the url to the thumbnail
      item.thumbnailImageUrl = `${reqOpts.portal}/content/items/${item.id}/info/${item.thumbnail}`;
      // res.send(`Title: ${item.title}`);
      res.render('index', { item: item })
    })
    .catch((err) => {
      res.send(`Error: ${err.message}`);
    })
  } else {
    // just return the template...
    console.info('No appid passed.');
    res.render('index');

  }
});
app.listen(3000, function () {
  console.info(`Server started...`);
  // read index.html into memory...
});
