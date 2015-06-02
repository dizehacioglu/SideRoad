$(document).on('ready', function(){

	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var autocomplete, autocomplete2;
	var markers = [];
	var placeIds = [];
	var infowindow = new google.maps.InfoWindow();

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
			// Make sure page doesn't submit
			e.preventDefault();
			// Clear all previous markers on map
			clearMarkers();

			// Get the origin and destination from the user's input
			start = $(this).find('[name=origin]').val();
			end = $(this).find('[name=destination]').val();

			// Create a route request to feed to Google's route()
			var request = {
				origin: start,
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING
			};
			
			// Ask for a route from Google Maps API
			directionsService.route(request, function(result, status){
				// If everything with the Route checks out...
				if(status == google.maps.DirectionsStatus.OK){
					// Display the route on the map
					directionsDisplay.setDirections(result);

					// Get the path 
					var path = result.routes[0].overview_path;


					var rboxer = new RouteBoxer();
					var distance = 2;

					var boxes = rboxer.box(path, distance);
					//drawBoxes(boxes);
					
					// Find all of the locations around the route
					findPlaces(boxes, 0);
				}
				else{
					console.log('Error');
				}

				
				
			});
		});

	}; // End initialize()

	initialize();

	var createLocation = function(lat, lng){
			return new google.maps.LatLng(lat, lng);
	};

	function findPlaces(boxes, searchIndex) {

		var request = {
		 bounds: boxes[searchIndex],
		 radius: 10000,
		 types: ["city_hall"]
		};

		service.radarSearch(request, function (results, status) {
			console.log(status);
			if (status = google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0, result; result = results[i]; i++){
					var marker = createMarker(result);
					appendLocation(result.place_id);
				}	
				searchIndex++;
				if (searchIndex < boxes.length) 
					findPlaces(boxes,searchIndex);
			}
		});
	}

	var appendLocation = function(placeId){

		var request = {
			placeId: placeId
		};

		service.getDetails(request, function(place, status){
			if(status == google.maps.places.PlacesServiceStatus.OK){
				console.log(place);
				$('#locations').append(place.name);
			}
		});


		
	};

	var callback = function(results, status, map, service){
		console.log(results);
		if(status == google.maps.places.PlacesServiceStatus.OK){
			for(var i = 0; i < results.length; i++){
				createMarker(results[i], map, service);
				
			}
		}
	};

	var createMarker = function(place){
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location,
			placeId: place.place_id
		});

		 var request =  {
          reference: place.reference
    };


		google.maps.event.addListener(marker,'click',function(){
        service.getDetails(request, function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            var contentStr = '<h5>'+place.name+'</h5><p>'+place.formatted_address;
            if (!!place.formatted_phone_number) contentStr += '<br>'+place.formatted_phone_number;
            if (!!place.website) contentStr += '<br><a target="_blank" href="'+place.website+'">'+place.website+'</a>';
            contentStr += '<br>'+place.types+'</p>';
            infowindow.setContent(contentStr);
            infowindow.open(map,marker);
          } else { 
            infowindow.open(map,marker);
          }
        });

    });

	};

	var clearMarkers = function(){
		markers.map(function(marker){
			marker.setMap(null);
		});
		markers.length = 0;
	};

	// Draw the array of boxes as polylines on the map
	// function drawBoxes(boxes) {
	// 	boxpolys = new Array(boxes.length);
	// 		for (var i = 0; i < boxes.length; i++) {
	// 			boxpolys[i] = new google.maps.Rectangle({
	// 			bounds: boxes[i],
	// 			fillOpacity: 0,
	// 			strokeOpacity: 1.0,
	// 			strokeColor: '#000000',
	// 			strokeWeight: 1,
	// 			map: map
	// 		});
	// 	}
	// }
});








