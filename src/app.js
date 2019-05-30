const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicPath = path.join(__dirname, '..', 'public');
const viewsPath = path.join(__dirname, '..', 'templates', 'views');
const partialsPath = path.join(__dirname, '..', 'templates', 'partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather',
    author: 'Nicky van Urk'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    author: 'Nicky van Urk'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    text: 'This is some helpful text.',
    author: 'Nicky van Urk'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error:'You must provide an address'
    });
  }

  geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
    if (error) {
      return res.send({error});
    }
  
    forecast(latitude, longitude, (error, {temperature, temperatureHigh, temperatureLow, precipProbability, summary} = {}) => {
      if (error) {
        return res.send({error});
      }
      
      res.send({
        location,
        forecast:`${summary} It is currently ${temperature} degrees. The high today is ${temperatureHigh} with a low of ${temperatureLow}. There is ${precipProbability}% chance of rain.`});
      });
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    author: 'Nicky van Urk',
    errorMsg: 'Help article not found.'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    author: 'Nicky van Urk',
    errorMsg: 'Page not found.'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});