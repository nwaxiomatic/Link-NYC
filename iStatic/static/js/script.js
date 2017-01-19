var supportsAutoplay = false;
var waitTime;

var topWait = 0;
var bottomWait = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var randNum = getRandomInt(1,7);

var assetName = 'Asset_' + randNum.toString() + '_CATALA_PAF_LinkNYC_02.06.17';

$('#bg-video').vide({
	poster: 'static/media/img/' + assetName + '.mp4',
}, {
	posterType: 'jpg',
	origin: 'content-box',
});
setTimeout(          //wait for listener to run
    function(){
        $('#bg-video-box').addClass('shown');
    },
    waitTime
);

setTimeout(          //wait for listener to run
    function(){
        $('.center').addClass('shown');
    },
    topWait
)