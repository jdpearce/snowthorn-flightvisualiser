/* -----------------------------------------------------------------------------------
   Developed by the Applications Prototype Lab
   (c) 2015 Esri | http://www.esri.com/legal/software-license  
----------------------------------------------------------------------------------- */
require([
  'esri/Map',
  'esri/Camera',
  'esri/views/MapView',
  'esri/views/SceneView',
  'esri/Viewpoint',
  'esri/geometry/Point',
  'esri/geometry/support/webMercatorUtils',
  'dojo/domReady!'
],
function (
  Map,
  Camera,
  MapView,
  SceneView,
  Viewpoint,
  Point,
  webMercatorUtils
  ) {
    // Plane flight details
    var location = new Point({
        latitude: 16.28930,
        longitude: -91.64872,
        z: 30000,
        spatialReference: {
            wkid: 102100
        }
    });

    var location2 = new Point({
        latitude: 37.39113,
        longitude: -121.93530,
        z: 30000,
        spatialReference: {
            wkid: 102100
        }
    });

    var start = [location.latitude, location.longitude];
    var end = [location2.latitude, location2.longitude];
    var interpolatedPoints = interpolate(start, end);
    var bearing = calculateBearing(start, end);


    // Initialize map and view
    var map = new Map({
        basemap: 'satellite'
    });

    var viewForward = new SceneView({
        container: 'forward-map',
        map: map,
        camera: {
            heading: bearing,
            position: location,
            tilt: 85
        }
    });

    viewForward.then(function(){
      window.setTimeout(moveNext, 5000);
    });

    function moveNext() {
        var nextPoint = interpolatedPoints.shift();
        var nextBearing = calculateBearing(nextPoint, interpolatedPoints[0]);
        console.log("Moving to : " + nextPoint + ", bearing : " + nextBearing);
        var nextCamera = {
                        heading: nextBearing,
                        position: new Point({
                              latitude: nextPoint[0],
                              longitude: nextPoint[1],
                              z: 30000,
                              spatialReference: { wkid: 102100 }
                            }),
                        tilt: 85
                      };
        viewForward.animateTo(nextCamera);
        if (interpolatedPoints.length > 0)
          window.setTimeout(moveNext, 250);
      };

    /// Returns an interpolated set of points
    function interpolate(startPoint, endPoint, numPoints) {
      if (!numPoints) numPoints = 1000;
      console.log("start point : " + startPoint);
      console.log("end point : " + endPoint);
      console.log("num points : " + numPoints);
 
      var tmpArray = [];
      var xDiff = (endPoint[0] - startPoint[0])/numPoints;
      var yDiff = (endPoint[1] - startPoint[1])/numPoints;
      console.log("xDiff : " + xDiff + ", yDiff : " + yDiff);
      for(var i=1; i<= numPoints; i++)
      {
        tmpArray.push([startPoint[0] + xDiff*i, startPoint[1] + yDiff*i]);
      }
      return tmpArray;
    }

    function calculateBearing(startPoint, endPoint) {
      latitude1 = startPoint[0];
      latitude2 = endPoint[0];
      longitude1 = startPoint[1];
      longitude2 = endPoint[1];

      var y = Math.sin(longitude2-longitude1) * Math.cos(latitude2);
      var x = Math.cos(latitude1)*Math.sin(latitude2) -
              Math.sin(latitude1)*Math.cos(latitude2)*Math.cos(longitude2-longitude1);
      var brng = Math.atan2(y, x) * 180.0 / Math.PI;
      return (brng + 360) % 360;
    }
});


