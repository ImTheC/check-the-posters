$(function(){

// ### Initialize Material Elements on Page ###
	$('.datepicker').pickadate({
		format: 'mmmm dd, yyyy',
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 1 // Creates a dropdown of 1 years to control year
	});

	$('select').material_select();

	$('.modal-trigger').leanModal();


// ### DELETE POSTERS ###
	$('#deleteYes').on('click', function(){
		var poster_id = $(this).closest('.modal-footer').find('#poster_id').text();

		$.ajax({
			method: "POST",
			url: "/posters/" + poster_id + "?_method=DELETE",
		}).then(function(result){
			if ( result ) {
				document.location.pathname = "/posters";
			}
		}); // End of AJAX call
	}); // End of on click


// ### Preview Image URL
	$('#imgurl').on("change", function(){
		var url = $(this).val();
		var posterImg = "<img id='posterImg' class='poster materialboxed responsive-img' src='" + url + "'>";
		$("#posterImg").remove();
		$("#posterImageGoesHere").append(posterImg);
	});

}); // End of jQuery
