$(function () {

	$('.card-action').on("click", function(){
		var poster_id = $(this).find("#id").text();
		var hearts = $(this).find("#hearts-total").text();
		hearts = parseInt(hearts);
		// hearts = hearts+1
		// $(this).find("#hearts-total").text(" " + hearts.toString());
		$.ajax({
			type: "PUT",
			url: "/posters/" + poster_id + "/heart",
			data: hearts+1
		}).then(function(){
			// $.ajax({
			// 	type: "put",
			// 	url: "/posters/" + poster_id,
			// 	data: {hearts: hearts+1}
			// }).then(function(){
			// 	$(this).find("#hearts-total").text(hearts+1);
			});
		});
	});

}); // End of jQuery
