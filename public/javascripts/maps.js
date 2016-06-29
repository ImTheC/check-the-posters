function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: {lat: 30.267153, lng: -97.74306079999997}
	});

	var geocoder = new google.maps.Geocoder();
	document.getElementById('address').addEventListener('focusout', function() {
		geocodeAddress(geocoder, map);
	});
	document.getElementById('address').addEventListener('keyup', function(key) {
		if ( key === 13) {
			geocodeAddress(geocoder, map);
		}
	});
}

function geocodeAddress(geocoder, resultsMap) {
	var address = document.getElementById('address').value;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {

		var marker = new google.maps.Marker({
				map: resultsMap,
				animation: google.maps.Animation.DROP,
				position: results[0].geometry.location
			});

			resultsMap.setCenter(results[0].geometry.location);
			resultsMap.setZoom(15);
			document.getElementById('firstComponent').innerHTML="The Formatted Address is: " + results[0].formatted_address;
			document.getElementById('secondComponent').innerHTML="The Location is " + results[0].geometry.location;

		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});

}
