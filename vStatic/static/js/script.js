var supportsAutoplay = false;
var waitTime;

var topWait = 3000;
var bottomWait = 6000;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var randNum = getRandomInt(1,7);

var assetName = 'Asset_' + randNum.toString() + '_CATALA_PAF_LinkNYC_02.06.17';

$('#bg-video').vide({
	mp4: 'static/media/video/' + assetName + '.mp4',
	poster: 'static/media/img/' + assetName + '.mp4',
}, {
	posterType: 'jpg',
	origin: 'content-box',
});
instance = $('#bg-video').data('vide');
video = instance.getVideoObject();
video.addEventListener('play', function () {
    supportsAutoplay = true;
});
setTimeout(          //wait for listener to run
    function(){
        if(supportsAutoplay){
        	video.onloadeddata = function(){
            	$('#bg-video-box').addClass('shown');
            }
        }
        else {
        	$('#bg-video-box').addClass('shown');
        }
    },
    waitTime
);

setTimeout(          //wait for listener to run
    function(){
        $('.first-in').addClass('shown');
    },
    topWait
)
setTimeout(          //wait for listener to run
    function(){
        $('.second-in').addClass('shown');
    },
    bottomWait
)