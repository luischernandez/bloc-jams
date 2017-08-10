var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {title: 'Blue', duration: '4.26'},
        {title: 'Green', duration: '3.14'},
        {title: 'Red', duration: '5.01'},
        {title: 'Pink', duration: '3.21'},
        {title: 'Magenta', duration: '2.15'}
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {title: 'Hello, Operator?', duration: '1.01'},
        {title: 'Ring, ring, ring', duration: '5.01'},
        {title: 'Fits in your pocket', duration: '3.21'},
        {title: 'Can you hear me now', duration: '3.14'},
        {title: 'Wrong phone number', duration: '2.15'}
    ]
};

var albumDaVinci = {
    title: 'La Dolce Vita',
    artist: 'Leonardo da Vinci',
    label: 'Roma',
    year: '1500',
    albumArtUrl: 'assets/images/album_covers/17.png',
    songs: [
        {title: 'Il David', duration: '1.21'},
        {title: 'Cappella Sistina', duration: '12.35'},
        {title: 'Mona', duration: '6.22'},
        {title: "L'ultima Cena", duration: '4.54'},
        {title: 'Goliath', duration: '1.15'}
    ]
};

var createSongRow = function(songNumber, songName, songLength){
    var template =
      '<tr class="album-view-song-item">'
    + '<td class="song-item-number" data-song-number="' + songNumber + '">'+songNumber+'</td>'
    + '<td class="song-item-title">' + songName + '</td>'
    + '<td class="song-item-duration">' + songLength + '</td>'
    + '</tr>';
    var $row = $(template);

//clickHandler:
//if no song is currently playing and we click on a song, it should
//play that song and make the bubble show the pause sign template
//
//if the clicked on a song that is playing, get the song number and set the
//bubble to show the play button and toggle back that no song is playing.
//
//if we click on a different song after one was either playing of paused, that permanent
//button on the first song must go back to a number and now the clicked song must
//show the pause button.
var clickHandler = function() {
    var songNumber = $(this).attr('data-song-number');

    if(currentlyPlayingSong !== null){
        var currentlyPlayingCell = $('.song-item-number[data-song-number="'+currentlyPlayingSong+'"]');
        currentlyPlayingCell.html(currentlyPlayingSong);
    }
    if(currentlyPlayingSong !== songNumber){
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSong = songNumber;
    } else if (currentlyPlayingSong === songNumber) {
        $(this).html(playButtonTemplate);
        currentlyPlayingSong = null;
    }
};

var onHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');

    if(songNumber !== currentlyPlayingSong){
            songNumberCell.html(playButtonTemplate);
    }
};

var offHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');

    if(songNumber !== currentlyPlayingSong){
        songNumberCell.html(songNumber);
    }
};

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album){
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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"><span></a>';

var currentlyPlayingSong = null;

//trigger the setCurrentAlbum function when the window loads
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
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
