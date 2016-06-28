$(function(){
	$('.datepicker').pickadate({
		format: 'mmmm dd, yyyy',
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 1 // Creates a dropdown of 1 years to control year
	});

	$('.timepicker').pickatime({

	});
}); // End of jQuery
