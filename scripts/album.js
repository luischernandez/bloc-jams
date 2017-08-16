var createSongRow = function(songNumber, songName, songLength){
    var template =
      '<tr class="album-view-song-item">'
    + '<td class="song-item-number" data-song-number="' + songNumber + '">'+songNumber+'</td>'
    + '<td class="song-item-title">' + songName + '</td>'
    + '<td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    + '</tr>';

    var $row = $(template);

    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if(currentlyPlayingSongNumber !== null){
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if(currentlyPlayingSongNumber !== songNumber){
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();

            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});

            } else if (currentlyPlayingSongNumber === songNumber) {
                if (currentSoundFile.isPaused()) {
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                    currentSoundFile.play();
                    updateSeekBarWhileSongPlays();
                } else {
                    $(this).html(playButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPlayButton);
                    currentSoundFile.pause();
                }
            }

};

    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if(songNumber !== currentlyPlayingSongNumber){
                songNumberCell.html(playButtonTemplate);
            }
        };

    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if(songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(songNumber);
        }
        console.log("songNumber type is "+ typeof songNumber +"\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album){
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
//se$t the values of those variables to a key-vue from the album object
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year+' '+album.label);
    $albumImage.attr('src', album.albumArtUrl);
//set the innerHTML of albumSongList to an empty string
    $albumSongList.empty();
//loop through all the album songs invoking the createSongRow function
// to create a new row for each song title.
    for (var i=0; i<album.songs.length; i++){
        var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile){
        currentSoundFile.bind('timeupdate', function(event){
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(this.getTime());
        });
    }
}

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio*100;

    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent+'%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
}

var setupSeekBars = function(){
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if($(this).parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio*currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio*100);
        }

        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event){
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if($seekBar.parent().attr('class') == 'seek-control'){
                seek(seekBarFillRatio*currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        $(document).bind('mouseup.thumb', function(){
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        })
    })
}

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

//nextSong() should increment the index in the array when >> button is pushed
//it must know the prev song and cycle to the last song
//use trackIndex() to get the index of the current song and increment for the nextSong
//set a new current song to currentSongFromAlbum
//update the player bar
//update the html of the prev's song .song-itm-number with a number cuz it is a bubble
//update the html of the new song to show the pause button
var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    if(currentSongIndex>=currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    var lastSongNumber = currentlyPlayingSongNumber;
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

//very similar to next song but special case is the first song, not the last
var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--; //here we DECREMENT index
    //special case below:
    if(currentSongIndex<0){
        currentSongIndex = currentAlbum.songs.length-1;
    }
    var lastSongNumber = currentlyPlayingSongNumber;
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile.isPaused()) {
        //get the songnumber cell to change it into pause button when we click play
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(pauseButtonTemplate);
        //change the bar to pause when we click play
        $('.main-controls .play-pause').html(playerBarPauseButton);
        //play the song
        currentSoundFile.play();
    } else {
        //get the song number cell to change it to play when we click pause
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(playButtonTemplate);
        //change the bar to show play button when we click pause
        $('.main-controls .play-pause').html(playerBarPlayButton);
        //pause the song
        currentSoundFile.pause();
    }
}

//create setSong() to take 1 argument 'songNumber', and assign
// currentlyPlayingSongNumber and currentSongFromAlbum a new value based
//on new song number.
//Replace all manual assignments.
var setSong = function(songNumber){
    if(currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber); //some new value
    currentSongFromAlbum = currentAlbum.songs[songNumber-1]; //some new value
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var seek = function(time) {
    if(currentSoundFile){
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume) {
    if(currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

//make getSongNumberCell(), takes 1 argmt 'number', and returns the song
// number element that corresponds.
//Replace all manual assignments.
var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="'+ number +'"]');
};


//write a  function to update the h2 text with the song and artist name
var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

//checkpoint 21 assignment below:
var setCurrentTimeInPlayerBar = function(currentTime){
    //set text of element with .current-time to the current total-time
    $('.current-time').text(filterTimeCode(currentTime));
    //add method to updateSeekBarWhileSongPlays()
}

var setTotalTimeInPlayerBar = function(totalTime){
    //set text of element with .total-time class to the length of song
    $('.total-time').text(filterTimeCode(totalTime));
    //add the method to updatePlayerBarSong() so total time is set when song plays
}

var filterTimeCode = function(timeInSeconds){
    //use the parseFloat() method
    var minutes = Math.floor(parseFloat(timeInSeconds/60));
    var seconds = Math.floor(timeInSeconds%60);
    return minutes+":"+seconds;
    //store variables for whole seconds and whole minutes using math.floor
    //return the time in the format x:xx
}


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"><span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 50;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

//trigger the setCurrentAlbum function when the window loads
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
});

//if set to picasso, change to Marconi
//if set to marconi, change to davinci
//if set to davinci, set to picasso
document.getElementsByClassName('album-cover-art')[0].addEventListener('click',
function(){
    var title = document.getElementsByClassName('album-view-title')[0];
    if(title.firstChild.nodeValue==="The Colors"){
        setCurrentAlbum(albumMarconi);
    } else if(title.firstChild.nodeValue==="The Telephone"){
        setCurrentAlbum(albumDaVinci);
    } else if(title.firstChild.nodeValue==="La Dolce Vita"){
        setCurrentAlbum(albumPicasso);
    }
});
