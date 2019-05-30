const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/9aa8fbf7389b81f5beb3154ad4a8ea97/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}?units=auto`;

  request({url, json: true}, (error, {body} = {}) => {
    if (error) {
      callback('Unable to connect to weather service!');
    } else if (body.error) {
      callback('Unable to find location');
    } else {
      callback(undefined, {
        temperature: body.currently.temperature,
        precipProbability: body.currently.precipProbability,
        summary: body.daily.data[0].summary,
        units: body.flags.units
      });
    }
  });
};

module.exports = forecast;