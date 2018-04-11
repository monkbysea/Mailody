const express = require('express');
const request = require('request');

const router = express.Router();

const domain = 'https://mailody.herokuapp.com';

router.post('/', (req, res) => {

  console.log('Mailody Code API is required');

  var img = req.param('img');

  // Request api_music for matching songs & generate code
  function getSong(code) {

    request({
      method: 'POST',
      url: domain + '/api_music?code=' + code,
    }, function(error, response, body) {

      if (error) {
        console.log('error:', error);
      } else {
        console.log('statusCode:', response && response.statusCode);
        var song = JSON.parse(body);
        res.send(song);
      }

    });
  }

  // Request Google Vision API for ORC
  function getText(img) {

    var regex = /mld\w/i;

    var gVision = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDVKIVDQQte9ZsrYhn8p7pXbglgQRse-3U';

    var data = {
      'requests': [
        {
          'image': {
            'content': img
          },
          'features': [
            {
              'type': 'TEXT_DETECTION'
            }
          ]
        }
      ]
    };

    request({
      method: 'POST',
      url: gVision,
      body: JSON.stringify(data)
    }, function(error, response, body) {
      //
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.

      // Use IBM Api to detect motion
      var txt = JSON.parse(body).responses[0].fullTextAnnotation.text;

      // console.log(txt);

      // var code = regex.test(txt);
      var code = txt.match(regex);

      if (code) {
        console.log('Code was found: ' + code);
        getSong(code);

      } else {
        console.log('No code was found: ' + txt);

        res.send('No code was found!');
      }

    });
  }

  getText(img);
});

module.exports = router;
