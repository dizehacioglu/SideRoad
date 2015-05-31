$(document).on('ready', function(){

	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var autocomplete, autocomplete2;
	var steps;
	var latLangs = [];

	directionsDisplay = new google.maps.DirectionsRenderer();

	var mapOptions = {
	  center: { lat: 40.015, lng: -105.27},
	  zoom: 8
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	directionsDisplay.setMap(map);

	var initialize = function(){
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

		$('#route').on('submit', function(e){
			e.preventDefault();

			start = $(this).find('[name=origin]').val();
			end = $(this).find('[name=destination]').val();

			var request = {
				origin: start,
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING
			};
			
			directionsService.route(request, function(result, status){
				if(status == google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(result);

					var path = result.routes[0].overview_path;


					var rboxer = new RouteBoxer();
					var distance = 2;

					var boxes = rboxer.box(path, distance);

					for (var i = 0; i < boxes.length; i++){

						// var location = new google.maps.LatLng(boxes[i].za.A, boxes[i].qa.A);
						var location = new google.maps.LatLng(boxes[i].getCenter().A, boxes[i].getCenter().F);
						// console.log(boxes[i].za.A);
						// console.log(boxes[i].za.j);
						var request = {
							bounds: boxes[i],
							radius: 10,
							// types: ['city_hall']
						};

						var Marker = new google.maps.Marker({
							map: map,
							position: location
						});

						var service = new google.maps.places.PlacesService(map);
						service.nearbySearch(request, callback);

						// console.log(request);
					}
				}
				else{
					console.log('Error');
				}
			});
		});
	 }; // End initialize()

	 initialize();

	var callback = function(results, status){
		

		if(status == google.maps.places.PlacesServiceStatus.OK){
			for(var i = 0; i < results.length; i++){
				createMarker(results[i]);
				
			}
		}
	};

	var createMarker = function(place){
		var Marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});
		console.log(place.geometry);
	};


	// google.maps.event.addDomListener(window, 'load', initialize);

});







