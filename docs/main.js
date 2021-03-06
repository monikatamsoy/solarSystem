
var pointLight,
    t,
    ship,
    // loadingBar,
    loader,
    theta,
    sun,
    moon,
    earth,
    mars,
    planetOrbit,
    planetData,
    earthRing,
    controls,
    scene,
    camera,
    renderer,
    scene;
var add = 0.005;
var planetSegments = 48;
const left = 37,
    right = 39,
    up = 38,
    down = 40,
    enter = 13;

var mercuryData = constructPlanetData(
    87.97,
    0.015,
    15,
    "earth",
    "img/mercury.jpeg",
    0.5,
    planetSegments
);
var venusData = constructPlanetData(
    224.7,
    0.015,
    25,
    "earth",
    "img/venus.jpeg",
    1,
    planetSegments
);
var earthData = constructPlanetData(
    365.2564,
    0.015,
    35,
    "earth",
    "img/earth.jpg",
    1.2,
    planetSegments
);
var marsData = constructPlanetData(
    400,
    0.015,
    50,
    "mars",
    "img/mars.jpeg",
    0.75,
    planetSegments
);
var jupiterData = constructPlanetData(
    450,
    0.005,
    85,
    "earth",
    "img/jupiter.jpeg",
    2.5,
    planetSegments
);
var saturnData = constructPlanetData(
    500,
    0.005,
    95,
    "earth",
    "img/saturn.jpeg",
    2,
    planetSegments
);
var uranusData = constructPlanetData(
    560,
    0.005,
    105,
    "earth",
    "img/uranus.jpeg",
    1,
    planetSegments
);
var neptuneData = constructPlanetData(
    800,
    0.015,
    115,
    "earth",
    "img/neptune.jpeg",
    1.6,
    planetSegments
);

var moonData = constructPlanetData(
    29.5,
    0.01,
    2.8,
    "moon",
    "img/moon.jpg",
    0.5,
    planetSegments
);
var orbitData = {
    value: 200,
    runOrbit: true,
    runRotation: true
};
var clock = new THREE.Clock();

/**
 * This eliminates the redundance of having to type property names for a planet object.
 * @param {type} myOrbitRate decimal
 * @param {type} myRotationRate decimal
 * @param {type} myDistanceFromAxis decimal
 * @param {type} myName string
 * @param {type} myTexture image file path
 * @param {type} mySize decimal
 * @param {type} mySegments integer
 * @returns {constructPlanetData.mainAnonym$0}
 */
function constructPlanetData(
    myOrbitRate,
    myRotationRate,
    myDistanceFromAxis,
    myName,
    myTexture,
    mySize,
    mySegments
) {
    return {
        orbitRate: myOrbitRate,
        rotationRate: myRotationRate,
        distanceFromAxis: myDistanceFromAxis,
        name: myName,
        texture: myTexture,
        size: mySize,
        segments: mySegments,
    };
}

/**
 * create a visible earthRing and add it to the scene.
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(innerDiameter, size, facets);
    var ring1Material = new THREE.MeshBasicMaterial({
        color: myColor,
        side: THREE.DoubleSide,
    });
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

/**
 * Used to create a three dimensional earthRing. This takes more processing power to
 * run that getRing(). So use this sparingly, such as for the outermost earthRing of
 * Saturn.
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getTube(
    size,
    innerDiameter,
    radialSegments,
    tubularSegments,
    myColor,
    name,
    distanceFromAxis,
    myTexture
) {
    var ringGeometry = new THREE.TorusGeometry(
        size,
        innerDiameter,
        radialSegments,
        tubularSegments
    );
    var ringMaterial = new THREE.MeshBasicMaterial({
        color: myColor,
        side: THREE.DoubleSide,
        map: myTexture,
    });
    myRing = new THREE.Mesh(ringGeometry, ringMaterial);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

/**
 * Simplifies the creation of materials used for visible objects.
 * @param {type} type
 * @param {type} color
 * @param {type} myTexture
 * @returns {THREE.MeshStandardMaterial|THREE.MeshLambertMaterial|THREE.MeshPhongMaterial|THREE.MeshBasicMaterial}
 */
function getMaterial(type, color, myTexture) {
    var materialOptions = {
        color: color === undefined ? "rgb(255, 255, 255)" : color,
        map: myTexture === undefined ? null : myTexture,
    };

    switch (type) {
        case "basic":
            return new THREE.MeshBasicMaterial(materialOptions);
        case "lambert":
            return new THREE.MeshLambertMaterial(materialOptions);
        case "phong":
            return new THREE.MeshPhongMaterial(materialOptions);
        case "standard":
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}

/**
 *  Draws all of the orbits to be shown in the scene.
 * @returns {undefined}
 */
function createVisibleOrbits(planet) {
    var orbitWidth = 0.05;

    planetOrbit = getRing(
        planet.distanceFromAxis + orbitWidth,
        planet.distanceFromAxis - orbitWidth,
        320,
        0x332a24,
        planet,
        0
    );
}

/**
 * Simplifies the creation of a sphere.
 * @param {type} material THREE.SOME_TYPE_OF_CONSTRUCTED_MATERIAL
 * @param {type} size decimal
 * @param {type} segments integer
 * @returns {getSphere.obj|THREE.Mesh}
 */
function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

/**
 * Creates a planet and adds it to the scene.
 * @param {type} myData data for a planet object
 * @param {type} x integer
 * @param {type} y integer
 * @param {type} z integer
 * @param {type} myMaterialType string that is passed to getMaterial()
 * @returns {getSphere.obj|THREE.Mesh|loadTexturedPlanet.myPlanet}
 */
function loadTexturedPlanet(myData, x, y, z, myMaterialType) {
    var myMaterial;
    var passThisTexture;

    if (myData.texture && myData.texture !== "") {
        passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
    }
    if (myMaterialType) {
        myMaterial = getMaterial(
            myMaterialType,
            "rgb(255, 255, 255 )",
            passThisTexture
        );
    } else {
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = myData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

/**
 * Simplifies creating a light that disperses in all directions.
 * @param {type} intensity decimal
 * @param {type} color HTML color
 * @returns {THREE.PointLight|getPointLight.light}
 */
function getPointLight(intensity, color) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

/**
 * Move the planet around its orbit, and rotate it.
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
 * @param {type} stopRotation optional set to true for rings
 * @returns {undefined}
 */
function movePlanet(myPlanet, myData, myTime, stopRotation) {
    if (orbitData.runRotation && !stopRotation) {
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit) {
        myPlanet.position.x =
            Math.cos(myTime * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) *
            myData.distanceFromAxis;
        myPlanet.position.z =
            Math.sin(myTime * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) *
            myData.distanceFromAxis;
    }
}

/**
 * Move the moon around its orbit with the planet, and rotate it.
 * @param {type} myMoon
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
 * @returns {undefined}
 */
function moveMoon(myMoon, myPlanet, myData, myTime) {
    movePlanet(myMoon, myData, myTime);
    if (orbitData.runOrbit) {
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

/**
 * This function is called in a loop to create animation.
 * @param {type} renderer
 * @param {type} scene
 * @param {type} camera
 * @param {type} controls
 * @returns {undefined}
 */
function update(renderer, scene, camera, controls) {
    pointLight.position.copy(sun.position);
    controls.update();
    

    var time = Date.now();
    // t += 0.5;
    // earth.position.x = earthData.distanceFromAxis*Math.cos(t)
    movePlanet(mercury, mercuryData, time);
    movePlanet(venus, venusData, time);
    movePlanet(earth, earthData, time);
    movePlanet(mars, marsData, time);
    movePlanet(jupiter, jupiterData, time);

    movePlanet(saturn, saturnData, time);
    movePlanet(uranus, uranusData, time);
    movePlanet(neptune, neptuneData, time);

    movePlanet(earthRing, earthData, time, true);
    movePlanet(saturnRing, saturnData, time, true);

    sun.rotation.y -= 0.0005;
    // moveMoon(moon, earth, moonData, time);

    asteroids.forEach(function (obj) {
        obj.rotation.x -= obj.r.x;
        obj.rotation.y -= obj.r.y;
        obj.rotation.z -= obj.r.z;
    });

    if(ship) {
        ship.position.y +=add;
        if(ship.position.y >= 0.1 || ship.position.y <= -0.1) add *= -1;

        
    }
            
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

function ColorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

let onKeyDown = (e) => {
    if (e.keyCode == left)
    {   
        // ship.position.x -= 0.4;
        ship.rotation.y -= 0.1;
        // camera.position.x -= 0.1;
    }
    else if (e.keyCode == right) 
    {   
        ship.rotation.y += 0.1;
        // camera.position.x += 0.1;
    }
    else if (e.keyCode == up) {
        {   
            ship.position.y += 0.4;
            // camera.position.y += 0.4;
        }
    } else if (e.keyCode == down) 
    {   
        ship.position.y -= 0.4;
        // camera.position.y -= 0.4;
    } else if (e.keyCode == enter)
    {   
        ship.position.z -= 0.8;
        ship.position.x += 0.8
        camera.position.z -= 0.8;
        // camera.position.sub(ship.position).setLength(5).add(ship.position);
    }
};
/**
 * This is the function that starts everything.
 * @returns {THREE.Scene|scene}
 */

function createAsteroids() {
    var maxWidth = 50;
    var maxHeight = 20;
    var maxDepth = 50;
    var asteroids = [];
    for (var i = 0; i < 100; i++) {
        asteroids.push(createRock(0.005 + Math.random(), 200, maxWidth, maxHeight, maxDepth));
    }
    for (var i = 0; i < 500; i++) {
        asteroids.push(createRock(0.0005 + Math.random(), 50, maxWidth, maxHeight, maxDepth));
    }
    for (var i = 0; i < 800; i++) {
        asteroids.push(createRock(0.0002 + Math.random(), 100, maxWidth, maxHeight, maxDepth));
    }
    return asteroids;
}

function createRock(size, spreadX, maxWidth, maxHeight, maxDepth) {
    var geometry = new THREE.DodecahedronGeometry(size, 1);
    geometry.vertices.forEach(function (v) {
        v.x += 0 - Math.random() * (size / 4);
        v.y += 0 - Math.random() * (size / 4);
        v.z += 0 - Math.random() * (size / 4);
    });
    var color = "#111111";
    color = ColorLuminance(color, 2 + Math.random() * 10);
    //   console.log(color);
    texture = new THREE.MeshStandardMaterial({
        color: color,
        shading: THREE.FlatShading,
        roughness: 0.8,
        metalness: 1,
    });
    //   shininess: 0.5,
    cube = new THREE.Mesh(geometry, texture);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.scale.set(
        0.5 + Math.random() * 0.4,
        0.5 + Math.random() * 0.8,
        0.5+ Math.random() * 0.4
    );
    cube.rotation.y = Math.PI / 4;
    cube.rotation.x = Math.PI / 4;
    theta = Math.random()*360 ;
    var x = 67*Math.cos(theta) + (Math.random() - 0.5) * 5  ;
    var z = 67*Math.sin(theta) + (Math.random() - 0.5) * 5 ;
    cube.position.set(x, 0, z );
    cube.r = {};
    cube.r.x = Math.random() * 0.001;
    cube.r.y = Math.random() * 0.001;
    cube.r.z = Math.random() * 0.001;
    
    scene.add(cube) 
    return cube
}

    
    // loader = .setPath('./img/');
    // loader.setPath('./img/');
    // const self = this;
    
    // Load a glTF resource
    


function init() {
    // Create the camera that allows us to view into the scene.
    camera = new THREE.PerspectiveCamera(
        45, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        1000 // far clipping plane
    );
    camera.position.z = 100;
    camera.position.x = 0;
    camera.position.y = 10;
    
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create the scene that holds all of the visible objects.
    scene = new THREE.Scene();

    // Create the renderer that controls animation.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach the renderer to the div element.
    document.getElementById("webgl").appendChild(renderer.domElement);

    // Create controls that allows a user to move the scene with a mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    const button = ARButton.createButton(renderer);
    console.log(button)
    document.body.appendChild(button)
    // Load the images used in the background.
    var path = "cubemap/";
    var format = ".jpeg";
    var urls = [
        path + "px" + format,
        path + "nx" + format,
        path + "py" + format,
        path + "ny" + format,
        path + "pz" + format,
        path + "nz" + format,
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    // Attach the background cube to the scene.
    scene.background = reflectionCube;

    // Create light from the sun.
    pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    // Create light that is viewable from all directions.
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    // Create the sun.
    var sunTexture = new THREE.ImageUtils.loadTexture("img/sun.jpeg");
    var sunMaterial = getMaterial("phong", "rgb(255, 255, 255)", sunTexture);
    sun = getSphere(sunMaterial, 10, 48);
    scene.add(sun);

    // Create the glow of the sun.
    var spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.ImageUtils.loadTexture("img/glow.png"),
        useScreenCoordinates: false,
        color: 0xcc9c53,
        transparent: false,
        blending: THREE.AdditiveBlending,
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(35, 35, 0.1);
    sun.add(sprite); // This centers the glow at the sun.

    // Create the Earth, the Moon, and a earthRing around the earth.
    mercury = loadTexturedPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    venus = loadTexturedPlanet(venusData, venusData.distanceFromAxis, 0, 0);

    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    mars = loadTexturedPlanet(marsData, marsData.distanceFromAxis, 0, 0);
    jupiter = loadTexturedPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);

    saturn = loadTexturedPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);

    uranus = loadTexturedPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
    neptune = loadTexturedPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);

    moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    earthRing = getTube(
        1.8,
        0.05,
        480,
        480,
        0x757064,
        "earthRing",
        earthData.distanceFromAxis
    );

    saturnRingTexture = new THREE.ImageUtils.loadTexture("img/saturnRing.png");
    saturnRing = getTube(
        3.8,
        0.7,
        2,
        480,
        0x757064,
        "saturnRing",
        saturnData.distanceFromAxis,
        saturnRingTexture
    );

    // Create the visible orbit that the Earth uses.
    createVisibleOrbits(mercuryData);
    createVisibleOrbits(venusData);
    createVisibleOrbits(earthData);
    createVisibleOrbits(marsData);
    createVisibleOrbits(jupiterData);
    createVisibleOrbits(saturnData);
    createVisibleOrbits(uranusData);
    createVisibleOrbits(neptuneData);

    asteroids = createAsteroids();
    
    // var loadingBar = new LoadingBar();

    loader = new THREE.GLTFLoader( );
    // loader.setPath('./img/');
    // loader.setPath('./img/');
    loader.load(
        // resource URL
        "./img/spaceShip.glb",
        // called when the resource is loaded
        function ( gltf ) {
            const bbox = new THREE.Box3().setFromObject( gltf.scene );
            console.log(`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(2)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)}`);
            
            gltf.scene.traverse( ( child ) => {
                if (child.isMesh){
                    child.material.metalness = 0.2;
                }
            })
            
            ship = gltf.scene;
            ship.scale.set(0.2,0.2,0.2);
            ship.position.set(0,5,90);
            ship.rotation.y = Math.PI/2;

            // ship.rotation.x = Math.PI/2
            scene.add( gltf.scene );
            
           
            
            // loadingBar.visible = false;
            window.self = self;
             renderer.setAnimationLoop( self.render.bind(self));
        },
        // called while loading is progressing
        function ( xhr ) {

            // loadingBar.progress = (xhr.loaded / xhr.total);
            
        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }  
        
    );

    // const group = new THREE.Group();
    // group.add(camera)
    // group.add(ship)

    // Create the GUI that displays controls.
    var gui = new dat.GUI();
    var folder1 = gui.addFolder("light");
    folder1.add(pointLight, "intensity", 0, 10);
    var folder2 = gui.addFolder("speed");
    folder2.add(orbitData, "value", 0, 500);
    folder2.add(orbitData, "runOrbit", 0, 1);
    folder2.add(orbitData, "runRotation", 0, 1);

    
    // Start the animation.
    update(renderer, scene, camera, controls);

    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("keydown", onKeyDown, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Start everything.
init();