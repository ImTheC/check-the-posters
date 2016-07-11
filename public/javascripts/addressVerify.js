// ### Address Verification
var markers = [];

function initMap() {
	var geocoder = new google.maps.Geocoder();
	document.getElementById('full_address').addEventListener('focusout', function(){
		geocodeAddress(geocoder);
	});
}

function geocodeAddress(geocoder, resultsMap) {
	var address = document.getElementById('full_address').value;

	geocoder.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			var components = results[0].address_components;

			document.getElementById('address').value = components[0].short_name + " " + components[1].short_name;
			document.getElementById('city').value = components[3].short_name;
			document.getElementById('state').value = components[5].short_name;
			document.getElementById('zip').value = components[7].short_name;
			Materialize.toast('Address found!', 4000, 'green');

		} else {
			Materialize.toast('Unable to find address! Try again!', 4000, 'red');
		}
	});
}
