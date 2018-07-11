'use strict';
require("isomorphic-fetch");
require("isomorphic-form-data");

const http = require('http'),
      express = require('express'),
      Items = require('@esri/arcgis-rest-items');

const app = express();

// use hbs view engine, but attach it to .html
app.set('views', './apps/exb/stemapp')
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
// static assets that need to be served one level up from the exb
app.use('/', express.static('apps/exb'))
app.use('/assets', express.static('apps/exb/assets'))
app.use('/js', express.static('apps/exb'))

app.get('/', function(req, res) {
  res.redirect(301, 'https://radar-app.now.sh/exb?id=8261ae335d2044eb9837cb858847c692');
})

// now the route to handle the exb index file...
app.get('/exb', function(req, res){
  console.info(`id: ${req.query.id}`);

  // TODO: set the env in a config file
  let reqOpts = {
    portal: 'https://www.arcgis.com/sharing/rest'
  };
  // if there is an appId ...
  if (req.query.id) {
    // fetch the item...
    Items.getItem(req.query.id, reqOpts)
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
