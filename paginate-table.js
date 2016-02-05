(function($, window){
	$.fn.table = function(options) {
		var $instance = $(this);
		var defaults = {
				tableTmpl: 'tmpl-table',
				paginateTmpl: 'tmpl-paginate'
		};
		var data = $instance.data();
		var settings = $.extend(defaults, data, options);
		
		$instance.on('fetch', function(e, params) {
			var request = $.extend(settings.request, $instance.data('request'), params);
			$.getJSON(settings.url, request).done(function(response) {
				$instance.trigger('render', response);
				$instance.data('request', request);
			});
		}).on('render', function(e, data) {
			$instance.trigger('will-render', data);
			$instance.find('.table')
				.html(tmpl(settings.tableTmpl, data.page))
				.data("list", data.page.items);
			$instance.find('.paginate')
				.html(tmpl(settings.paginateTmpl, data.page));
			$instance.trigger('rendered');
		});
		
		$instance.on('submit', '.tmpl-paginate form', function(e) {
			e.preventDefault();
			var $this = $(this);
			$instance.trigger('fetch', {
				'pageNumber': $this.find('.input-page-number').val()
			});
		}).on('click', '.tmpl-paginate .goto-page', function(e) {
			e.preventDefault();
			var $this = $(this);
			$instance.trigger('fetch', {
				'pageNumber': $this.data('pageNumber')
			});
		});
		
		$instance.trigger('fetch');
		return $instance;
	};
})(jQuery, window);