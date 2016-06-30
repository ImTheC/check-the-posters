$(function () {

	$('.card-action').on("click", function(ev){
		ev.preventDefault();
		$(this).addClass("heartClick");
		var poster_id = $(this).find("#id").text();
		var hearts = $(this).find("#hearts-total").text();
		hearts = parseInt(hearts);

		$.ajax({
			type: "PUT",
			url: "/posters/" + poster_id + "/heart"
		}).then(function(result){
			if (result === "minus") {
				hearts = hearts-1;
				$('.heartClick').find("#hearts-total").text(" " + hearts.toString());
				$('.heartClick').removeClass("heartClick");
			} else {
				hearts = hearts+1;
				$('.heartClick').find("#hearts-total").text(" " + hearts.toString());
				$('.heartClick').removeClass("heartClick");
			}
		}); // End of AJAX call
	}); // End of .card-action.on("Click")

}); // End of jQuery
