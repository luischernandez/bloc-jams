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

    return template;
};

var setCurrentAlbum = function(album){
//get the first element from array and set it to a variable
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
//set the values of those variables to a key-value from the album object
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year+' '+album.label;
    albumImage.setAttribute('src',album.albumArtUrl);
//set the innerHTML of albumSongList to an empty string
    albumSongList.innerHTML = '';
//loop through all the album songs invoking the createSongRow function
// to create a new row for each song title.
    for (var i=0; i<album.songs.length; i++){
        albumSongList.innerHTML += createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
    }
};

//checkpoint13 here
var findParentByClassName = function(element, targetClass){
    if(element){
        var currentParent = element.parentElement;
        while(currentParent.className !== targetClass && currentParent.className !== null){
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
}

var getSongItem = function(element){
    //if elementClassName = something get .song-item-number class
    switch (element.className) {
        //cases if I click on the children. should fetch up the DOM to the current parent of the element
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        //cases if I click somewhere on the row. should go down the DOM to the needed class
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        //cases if I click some element inside the row,(think peers)
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'song-item-number').querySelector('.song-item-number');
        //cases if I click on a different number. should fetch that element
        case 'song-item-number':
            return element;
        default:
            return; //return gives undefined by default
    }
}

var clickHandler = function(targetElement){
    var songItem = getSongItem(targetElement);

    if(currentlyPlayingSong === null){
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')){
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')){
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="'+currentlyPlayingSong+'"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"><span></a>';

var currentlyPlayingSong = null;

//trigger the setCurrentAlbum function when the window loads
window.onload = function(){
    setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function(event){
        if(event.target.parentElement.className === 'album-view-song-item'){
            var songItem = getSongItem(event.target);

            if(songItem.getAttribute('data-song-number') !== currentlyPlayingSong){
                songItem.innerHTML = playButtonTemplate;
            }
        }
    });

    for(var i=0; i<songRows.length; i++){
        songRows[i].addEventListener('mouseleave', function(event){
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');

            if(songItemNumber !== currentlyPlayingSong){
                songItem.innerHTML = songItemNumber;
            }
        });

        songRows[i].addEventListener('click', function(event){
            clickHandler(event.target);
        });
    }
};

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
