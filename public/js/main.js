jQuery(document).ready(function($) {

  console.log('main.js');

  var $text = $('#text');
  var $songInfo = $('#song-info');

  // For sender

  // Utilities
  function getImageContent(dataURL) {
    return dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  }

  // Photo Handler
  function handleFileSelect(e) {

    // Pause Song
    pauseSong();

    // Remove previous song info
    $('#song-name').html('');
    $('#song-artist').html('');
    $('.player-icon').remove();

    // Restore UI
    $('#preview').removeClass('hide');
    $('#preview img').attr('src', '');
    $('#song-name').removeClass('hide');
    $('#song-artist').removeClass('hide');

    // Params
    var playing = false;
    var songFound = false;

    var files = e.target.files; // FileList object
    var f = files[0];

    // Utilities
    function playSong() {
      $('#song').trigger("play");
      playing = true;
      $('#preview .player-icon').attr('src', '/img/pause.svg');
    }

    function pauseSong() {
      console.log('pause');
      $('#song').trigger("pause");
      playing = false;
      $('#preview .player-icon').attr('src', '/img/play.svg');
    }

    $('#upload-btn').addClass('hide');
    $('#status').removeClass('hide');

    $text.html('Finding great music for your card!');

    // Only process image files.
    if (f.type.match('image.*')) {

      $('#emotion ul').html('');

      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
            '" title="', escape(theFile.name), '"/>'
          ].join('');

          $('#preview').html(span, null);

          img = getImageContent(e.target.result);

          $.ajax({
            type: 'POST',
            url: '/api_tone',
            data: 'img=' + encodeURIComponent(img),
          }).done(function(res) {

            $('#add-btn').removeClass('hide');
            $('#status').addClass('hide');

            var toneArray = res.tone.document_tone.tone_categories;

            var songName = res.song.song[0].name;
            var songArtist = res.song.song[0].artist;
            var songSrc = res.song.song[0].src;
            var songArtwork = res.song.song[0].artwork;

            var songID = res.song.code;

            songFound = true;

            // Write Code
            $text.html('We found a song for your card');

            // Add artwork
            $('#preview img').attr('src', songArtwork);
            $('#preview').append('<img class = "player-icon" src="/img/play.svg"/>');

            $('#preview img').click(function() {

              // console.log(songFound);
              // console.log(playing);

              if (songFound && !playing) {
                playSong();
              } else if (songFound && playing) {
                pauseSong();
              }
            });

            // Add songs
            var source = '<source src="' + songSrc + '">'
            $('#song').html(source);

            // Add song info
            $('#song-name').html(songName);
            $('#song-artist').html(songArtist);

            // Add Music
            $('#add-btn').click(function() {

              $('#preview').addClass('hide');
              $('#song-name').addClass('hide');
              $('#song-artist').addClass('hide');

              $text.html('Please write <span><strong>"' + songID + '"</span></strong> on your card');

              $('#upload-btn').removeClass('hide').html('Add another card');
              $('#add-btn').addClass('hide');

            });

            // Add all emotion tags

            for (var i = 0; i < toneArray.length; i++) {

              toneCategory = toneArray[i];

              for (var j = 0; j < toneCategory.tones.length; j++) {

                var tone = toneCategory.tones[j];

                if (tone.score >= 0.5) {

                  var emo = '<li class="emo-tag">' + tone.tone_name + '</li>';

                  $('#emotion ul').append(emo);

                }
              }
            }


          }).fail(function(res) {
            console.log(res);
          });

        };
      })(f);

      reader.readAsDataURL(f);

    } else {
      console.log('Error: please use image files');
    }

  }

  $('#file').on('change', handleFileSelect);

});
