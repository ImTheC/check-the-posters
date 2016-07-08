$(function(){

	$('.carousel').carousel({
			dist: 0,
			padding: 80,
			shift: 80
	});

	// Next slide
	$('#next').on("click", function(){
		$('.carousel').carousel('next');
	});

	// Previous slide
	$('#prev').on("click", function(){
		$('.carousel').carousel('prev');
	});

}); // End of jQuery
