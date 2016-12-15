if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats, controls;
var camera, scene, renderer;
var clock = new THREE.Clock();
var mixers = [];
var objects = [];
var numObjs = 2;
var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var allLoaded = false;
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var intersection = new THREE.Vector3();
var up_vector = new THREE.Vector3(0,1,0);
var INTERSECTED, SELECTED;

var plane_flat = new THREE.Plane(up_vector, 0);

init();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	scene = new THREE.Scene();
	// grid
	var gridHelper = new THREE.GridHelper( 14, 28, 0x303030, 0x303030 );
	gridHelper.position.set( 0, - 0.04, 0 );
	//scene.add( gridHelper );

	// scene
	var ambient = new THREE.AmbientLight( 0x101030 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xEEEEEE );
	directionalLight.position.set( 0, 1, 0 );
	scene.add( directionalLight );

	var texture = new THREE.Texture();

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};


	//textures
	var loader = new THREE.ImageLoader( manager );
	loader.load( 'static/obj/texture.jpg', function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;

	} );

	// models
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
		if(loaded == total){
			allLoaded = true;
		}

	};
	loader = new THREE.OBJLoader( manager );
	for(var i = 0; i < numObjs; i++){
		(function(index){
			loader.load( 'static/obj/obj.obj', function ( object ) {
				object.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						child.material.map = texture;
					}
				} );
				var tagObj = new THREE.Group();
				tagObj.name = "tag";
				tagObj.position.y = 2;
				object.add(tagObj);
				object.position.z = index * 10;
				object.name = "object" + index.toString();
				console.log(object.name);		
				scene.add( object );
				objects.push( object );
			}, onProgress, onError );
		})(i);
	}

	//renderer
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000, 0 );
	container.appendChild( renderer.domElement );

	// controls, camera
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	camera.position.set( 2, 18, 28 );
	controls.update();
	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
	renderer.domElement.addEventListener( 'touchstart', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'touchend', onDocumentMouseUp, false );
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
}

//event actions
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	moveObjects(mouse);				
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouse.x = ( event.touches[ 0 ].pageX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.touches[ 0 ].pageY / window.innerHeight ) * 2 + 1;
		moveObjects(mouse);
	}		
}

function moveObjects(mouse){
	raycaster.setFromCamera( mouse, camera );
	if ( SELECTED ) {
		if ( raycaster.ray.intersectPlane( plane_flat, intersection ) ) {
			SELECTED.position.copy( intersection.sub( offset ) );
		}
		return;
	}
	var intersects = raycaster.intersectObjects( objects );
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ];
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			plane.setFromNormalAndCoplanarPoint(
				camera.getWorldDirection( plane.normal ),
				INTERSECTED.position );
		}
		container.style.cursor = 'pointer';
	} else {
		if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
		container.style.cursor = 'auto';
	}
}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( objects, true );
	if ( intersects.length > 0 ) {
		controls.enabled = false;
		SELECTED = getParent(intersects[ 0 ].object);
		if ( raycaster.ray.intersectPlane( plane_flat, intersection ) ) {
			offset.copy( intersection ).sub( SELECTED.position );
		}
		container.style.cursor = 'move';
	}
}

function onDocumentMouseUp( event ) {
	event.preventDefault();
	controls.enabled = true;
	SELECTED = null;
	container.style.cursor = 'auto';
}

//helpers
function toScreenPosition(obj, camera){
    var vector = new THREE.Vector3();

    var widthHalf = 0.25 * renderer.context.canvas.width;
    var heightHalf = 0.25 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };
};

function getParent(obj){
	if(obj.parent == scene)
		return obj;
	return getParent(obj.parent);
}

//animate, render
function animate() {
	requestAnimationFrame( animate );
	if ( mixers.length > 0 ) {
		for ( var i = 0; i < mixers.length; i ++ ) {
			mixers[ i ].update( clock.getDelta() );
		}
	}
	render();
	if(allLoaded){
		for(var i = 0; i < objects.length; i ++){
			var tagObj = null;
			for(var j = 0; j < objects[i].children.length; j++){
				if(objects[i].children[j].name == 'tag'){
					tagObj = objects[i].children[j];
					break;
				}
			}
			var distance = objects[i].position.distanceTo( camera.position );
			var tagPos = toScreenPosition(tagObj, camera);
			var objPos = toScreenPosition(objects[i], camera);
			$("#tag" + (i+1).toString()).css({
				'left': tagPos.x + 'px',
				'top' : tagPos.y + 'px',
			});
			$("#tag" + (i+1).toString() + " .label").css({
				'font-size': 600/distance,
			});
			var pHeight = Math.abs(tagPos.y - objPos.y) - 8;
			$("#tag" + (i+1).toString() + " span").css({
				'bottom': -pHeight,
				'height' : pHeight,
			});
		}
	}
}

function render() {
	renderer.render( scene, camera );
}