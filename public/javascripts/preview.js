$(function(){

	$('#imgurl').on("change", function(){
		var url = $(this).val();
		var posterImg = "<img id='posterImg' class='poster materialboxed responsive-img' src='" + url + "'>";
		$("#posterImg").remove();
		$("#posterImageGoesHere").append(posterImg);
	});

}); // End of jQuery
