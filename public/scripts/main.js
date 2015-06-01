$(document).on('ready', function(){

	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var autocomplete, autocomplete2;
	var markers = [];
	
	var service = null;

	directionsDisplay = new google.maps.DirectionsRenderer();

	var mapOptions = {
	  center: { lat: 40.015, lng: -105.27},
	  zoom: 8
	};
	
			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			directionsDisplay.setMap(map);


	var initialize = function(){

			service = new google.maps.places.PlacesService(map);
			// Address bars
	    // Consolidate:
	    var input = $('#pac-input');
	    var input2 = document.getElementById('pac-input');

	    autocomplete = new google.maps.places.Autocomplete(
	    	(document.getElementById('pac-input')),
	    	{types: ['geocode'] 
	    });

	    autocomplete2 = new google.maps.places.Autocomplete(
	      (document.getElementById('pac-input2')),
	      {types: ['geocode'] 
	  	});
	  
		var start;
		var end;
		var cities = [];

		// User asks for the route
		$('#route').on('submit', function(e){
			e.preventDefault();
			clearMarkers();

			start = $(this).find('[name=origin]').val();
			end = $(this).find('[name=destination]').val();

			var request = {
				origin: start,
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING
			};
			
			// Ask for a route from Google Maps API
			directionsService.route(request, function(result, status){
				if(status == google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(result);

					var path = result.routes[0].overview_path;


					var rboxer = new RouteBoxer();
					var distance = 2;

					var boxes = rboxer.box(path, distance);
					drawBoxes(boxes);

					// for(var i = 0; i < boxes.length; i++){

						var locations = findPlaces(boxes, 0);
						console.log(locations);
					// }
				}
				else{
					console.log('Error');
				}
			});
				console.log(placeIds);
		});

	}; // End initialize()

	initialize();

	var createLocation = function(lat, lng){
			return new google.maps.LatLng(lat, lng);
	};

	function findPlaces(boxes,searchIndex) {
		var placeIds = [];

		var request = {
		 bounds: boxes[searchIndex],
		 radius: 10000,
		 types: ["gas_station"]
		};
		// alert(request.bounds);
		service.radarSearch(request, function (results, status) {
			console.log(status);
			if (status = google.maps.places.PlacesServiceStatus.OK) {
				// alert("Request["+searchIndex+"] failed: "+status);
				// return;
				for (var i = 0, result; result = results[i]; i++){
					console.log(result);
					// placeIds.push(result.place_id);
					var marker = createMarker(result);
				}
				console.log(searchIndex);
				searchIndex++;
				if (searchIndex < boxes.length) 
					findPlaces(boxes,searchIndex);
				
			}
		});
		return placeIds;
	}


	// var findPlaces = function(bound, map, service){
			
	// 		var request = {
	// 			location: createLocation(bound.getCenter().A, bound.getCenter().F),
	// 			radius: 50000,
	// 			// types: ['city_hall']
	// 		};

	// 		service.nearbySearch(request, function(results, status){
				
	// 			callback(results, status, map, service);
	// 		});
	// };

	var callback = function(results, status, map, service){
		console.log(results);
		if(status == google.maps.places.PlacesServiceStatus.OK){
			for(var i = 0; i < results.length; i++){
				createMarker(results[i], map, service);
				
			}
		}
	};

	var createMarker = function(place){
		var Marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location,
			placeId: place.place_id
		});
	};

	var clearMarkers = function(){
		markers.map(function(marker){
			marker.setMap(null);
		});
		markers.length = 0;
	};

	// Draw the array of boxes as polylines on the map
	function drawBoxes(boxes) {
		boxpolys = new Array(boxes.length);
			for (var i = 0; i < boxes.length; i++) {
				boxpolys[i] = new google.maps.Rectangle({
				bounds: boxes[i],
				fillOpacity: 0,
				strokeOpacity: 1.0,
				strokeColor: '#000000',
				strokeWeight: 1,
				map: map
			});
		}
	}
});








