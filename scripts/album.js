var createSongRow = function(songNumber, songName, songLength){
    var template =
      '<tr class="album-view-song-item">'
    + '<td class="song-item-number" data-song-number="' + songNumber + '">'+songNumber+'</td>'
    + '<td class="song-item-title">' + songName + '</td>'
    + '<td class="song-item-duration">' + songLength + '</td>'
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
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            setSong(songNumber);
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
    setSong(songNumber);

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
    setSong(songNumber);

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number"'+ currentlyPlayingSongNumber +'"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number"'+lastSongNumber+ '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

//create setSong() to take 1 argument 'songNumber', and assign
// currentlyPlayingSongNumber and currentSongFromAlbum a new value based
//on new song number.
//Replace all manual assignments.
var setSong = function(songNumber){
    currentlyPlayingSongNumber = parseInt(songNumber); //some new value but which one?
    currentSongFromAlbum = currentAlbum.songs[songNumber-1]; //some new value but which one?
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
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"><span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

//trigger the setCurrentAlbum function when the window loads
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
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
