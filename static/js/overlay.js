$('#overlay-container').addClass('shown');
$('#overlay').click(function(){
	$('#overlay').toggleClass('slideUp');
	if($('#overlay').hasClass('slideUp')){
		$('.overlay-section').removeClass('shown');
	}
});
$('.expand-overlay').click(function(){
	$('#' + this.id.replace('expand-', '')).addClass('shown');
});