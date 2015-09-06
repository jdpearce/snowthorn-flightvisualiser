/* -----------------------------------------------------------------------------------
   Developed by the Applications Prototype Lab
   (c) 2015 Esri | http://www.esri.com/legal/software-license  
----------------------------------------------------------------------------------- */
var viewForward;
require([
  'esri/Map',
  'esri/Camera',
  'esri/views/MapView',
  'esri/views/SceneView',
  'esri/Viewpoint',
  'esri/geometry/Point',
  'dojo/domReady!'
],
function (
  Map,
  Camera,
  MapView,
  SceneView,
  Viewpoint,
  Point
  ) {

    var altitude = 3000;
    var spaceAltitude = 25512548;

    // this could be read in from a remote API or file
    var flightPathRaw = [[16.28930,-91.64872],[18.99725,-95.12108],[22.01850,-98.87463],
                        [25.15423,-102.91640],[28.07112,-107.49153],[30.94798,-112.77098],
                        [34.21402,-117.89405],[37.39113,-121.93530]];

    var flightPath = flightPathRaw.map(function(pt) {
      return new LatLon(pt[0], pt[1]);
    });

    // Start above the world, directly over the beginning of the flight path.
    var location0 = new Point({
        latitude: flightPath[0].lat,
        longitude: flightPath[0].lon,
        z: spaceAltitude
    });

    // Create the interpolated set of cameras
    var interpolatedCameras = [];
    for(var i=1; i<flightPath.length;i++) {
      interpolatedCameras = interpolatedCameras.concat(interpolate(flightPath[i-1], flightPath[i]));
    }

    // Initialize map and view
    var map = new Map({
        basemap: 'satellite'
    });

    viewForward = new SceneView({
        container: 'forward-map',
        map: map,
        camera: {
            heading: 0,
            position: location0,
            tilt: 0
        }
    });

    viewForward.then(function(){
      window.setTimeout(animateToStart, 3000);
    });

    function animateToStart() {
      viewForward.animateTo(interpolatedCameras.shift());
      window.setTimeout(moveNext, 3000);
    }

    function animateToEnd() {
      var endCamera = interpolatedCameras.shift();
      endCamera.heading = 0;
      endCamera.position.z = spaceAltitude;
      endCamera.tilt = 0;
      viewForward.animateTo(endCamera);
    }

    function moveNext() {
        var nextCamera = interpolatedCameras.shift();
        log("Moving to latitude:" + nextCamera.position.latitude + ", longitude:" + nextCamera.position.longitude + ", heading:" + nextCamera.heading);
        viewForward.camera = nextCamera;
        if (interpolatedCameras.length > 1)
          window.requestAnimationFrame(moveNext);
        else
          window.setTimeout(animateToEnd, 1000);
      };

    /// Returns an interpolated set of cameras
    function interpolate(startPoint, endPoint, numPoints) {
      if (!numPoints) numPoints = 2000;
      log("Start point:" + startPoint + ", End point:" + endPoint + ", Num points:" + numPoints);
 
      var tmpArray = [];
      var Δx = (endPoint.lat - startPoint.lat)/numPoints;
      var Δy = (endPoint.lon - startPoint.lon)/numPoints;
      log("Δx : " + Δx + ", Δy : " + Δy);

      var currentPoint = startPoint;
      var nextPoint;
      for(var i=0; i<= numPoints; i++)
      {
        nextPoint = new LatLon(currentPoint.lat + Δx, currentPoint.lon + Δy);
        tmpArray.push({
          heading: currentPoint.bearingTo(nextPoint),
          position: new Point({
            latitude: currentPoint.lat,
            longitude: currentPoint.lon,
            z: altitude
          }),
          tilt: 85
        });
        currentPoint = nextPoint;
      }

      return tmpArray;
    }

    function log(message) {
      if (!console) return;
      console.log(message);
    }
});


