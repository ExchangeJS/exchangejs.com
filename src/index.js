
jQuery.fn.startVideoInModal = function(modalSelector, videoSelector) {
	const URL_BASE = 'https://www.youtube.com/embed/';

	$(modalSelector).on('hide.bs.modal', function() {
		$(videoSelector).attr('src', '');
		return true;
	});

	return this.click(function(e) {
		e.preventDefault();

		const src = URL_BASE + $(this).data('video-id') + '?rel=0&autoplay=1';
		$(modalSelector)
			.modal('show')
			.on('shown.bs.modal', function() {
				$(videoSelector).attr('src', src);
			});
	});
};

jQuery(document).ready(function($) {
	$('.talk__videoLink').startVideoInModal('#video-modal', '#video-iframe');
});
