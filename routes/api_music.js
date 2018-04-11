const express = require('express');
const request = require('request');
const fs = require('fs');

const router = express.Router();

router.post('/', (req, res) => {

  console.log('Mailody Music API is required');

  var tag = req.param('tag');
  var reqCode = req.param('code');
  var song = {};
  var code = 'no machted code';

  console.log(__dirname + '/../data/music_list.json');

  // Get song list (emulate database or other API)
  var musicList = JSON.parse(fs.readFileSync(__dirname + '/../data/music_list.json', 'utf8'));

  if (tag) {
    console.log('Get music by emotion');
    for (var k in musicList) {
      if (musicList.hasOwnProperty(k) && k === tag) {
        song = musicList[k];
        code = song[0].id;
      }
    }
  } else if (code) {
    console.log('get music by code: ' + reqCode);
    for (var k in musicList) {
      console.log(k);
      if (musicList.hasOwnProperty(k) && musicList[k][0].id === reqCode) {
        console.log(musicList[k][0].id);
        song = musicList[k];
        code = song[0].id;
      }
    }
  }


  res.send({
    song: song,
    code: code
  });

});

module.exports = router;
