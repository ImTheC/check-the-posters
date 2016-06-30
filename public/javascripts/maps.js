function initMap() {

	var geocoder = new google.maps.Geocoder();
	var address = document.getElementById('address').value;
	geocodeAddress(geocoder, map, address);

}

function geocodeAddress(geocoder, resultsMap, address) {
	console.log(address);
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {

		var mapDiv = "<div id='map' class='z-depth-1'></div>";
		$('#placeMapHere').append(mapDiv);
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 8,
			center: {lat: 30.267153, lng: -97.74306079999997} // Austin, TX
		});

		var marker = new google.maps.Marker({
				map: resultsMap,
				animation: google.maps.Animation.DROP,
				position: results[0].geometry.location
			});

			resultsMap.setCenter(results[0].geometry.location);
			resultsMap.setZoom(15);

		} else {
			console.log("Unable to load address for map.");
		}
	});
}
