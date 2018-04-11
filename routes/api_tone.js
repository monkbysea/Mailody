const express = require('express');
const request = require('request');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const router = express.Router();

const domain = 'https://mailody.herokuapp.com';

router.post('/', (req, res) => {

  console.log('Mailody Tone API is required');

  var img = req.param('img');

  function findTone(toneArray) {
    var score = 0;
    var tag = 'joy';

    for (var i = 0; i < toneArray.length; i++) {
      var newScore = toneArray[i].score;
      if (newScore > score) {

        score = newScore;
        tag = toneArray[i].tone_id;

        console.log(newScore + ' > ' + score + " tag: " + tag);
      }
    }

    return tag;
  }

  // Request api_music for matching songs & generate code
  function getSong(tone) {

    var toneArray = tone.document_tone.tone_categories[0].tones;

    tag = findTone(toneArray);

    request({
      method: 'POST',
      url: domain + '/api_music?tag=' + tag,
    }, function(error, response, body) {

      if (error) {
        console.log('error:', error);
      } else {
        console.log('statusCode:', response && response.statusCode);

        var song = JSON.parse(body);

        res.send({tone: tone, song: song});

      }

    });
  }

  // Request IBM Tone API for emotional tags
  function getTone(txt) {

    const toneAnalyzer = new ToneAnalyzerV3({
      username: 'a072cb37-104c-43d4-b1c3-1ef1ba9c2996',
      password: 'Y3YiI0fQewEf',
      version: '2016-05-19',
      url: 'https://gateway.watsonplatform.net/tone-analyzer/api/'
    });

    toneAnalyzer.tone({
        tone_input: txt,
        content_type: 'text/plain'
      },
      function(err, tone) {
        if (err !== null) {
          console.log(err);
        } else {
          getSong(tone);
        }
      }
    );

  }

  // Request Google Vision API for ORC
  function getText(img) {

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
      if (error !== null) {
        console.log('error:', error);
      } else {
        console.log('statusCode:', response && response.statusCode);

        // Use IBM Api to detect motion
        var txt = JSON.parse(body).responses[0].fullTextAnnotation.text;

        getTone(txt);
      }

    });
  }

  getText(img);
});

module.exports = router;
