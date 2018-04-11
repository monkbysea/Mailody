jQuery(document).ready(function($) {

  console.log('recipient.js');

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

    // Params
    var playing = false;
    var songFound = false;

    var files = e.target.files; // FileList object
    var f = files[0];

    $('#upload-btn').addClass('hide');
    $('#status').removeClass('hide');

    $text.html('Retrieving the music for your card');

    // Utilities
    function playSong () {
      $('#song').trigger("play");
      playing = true;
      $('#preview .player-icon').attr('src', '/img/pause.svg');
    }

    function pauseSong () {
      $('#song').trigger("pause");
      playing = false;
      $('#preview .player-icon').attr('src', '/img/play.svg');
    }

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
          $('#example').addClass('hide');

          img = getImageContent(e.target.result);

          $.ajax({
            type: 'POST',
            url: '/api_code',
            data: 'img=' + encodeURIComponent(img),
          }).done(function(res) {

            console.log(res);

            $('#upload-btn').removeClass('hide').html('Scan another card');
            $('#status').addClass('hide');

            $text.html('Here\'s the song from the sender');

            console.log(res.hasOwnProperty('song'));

            if (res.hasOwnProperty('song')) {

              var songName = res.song[0].name;
              var songArtist = res.song[0].artist;
              var songSrc = res.song[0].src;
              var songArtwork = res.song[0].artwork;

              songFound = true;

              // Add artwork
              $('#preview img').attr('src', songArtwork);
              $('#preview').append('<img class = "player-icon" src="/img/play.svg"/>');

              $('#preview img').click(function() {
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

              // Play song
              playSong();



            } else {
              $text.html('Are you sure there\'s a code in your photo? Please try again with a clearer shot or try another card with Mailody Code.');
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
