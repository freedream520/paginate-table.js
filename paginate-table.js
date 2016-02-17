(function($, window){
	$.fn.table = function(options) {
		return this.each(function() {
			var $instance = $(this);
			var defaults = {
				tableTmpl: 'tmpl-table',
				paginateTmpl: 'tmpl-paginate',
				fetch: function(e, params) {
					var request = $.extend(settings.request, $instance.data('request'), params);
					$.getJSON(settings.url, request).done(function(response) {
						$instance.trigger('render', response);
						$instance.data('request', request);
					});
				},
				render: function(e, data) {
					$instance.trigger('will-render', data);
					
					var $table = $instance.find('.table');
					var $paginate = $instance.find('.paginate');
					
					if(data.page.itemCount > 0) {
						$table.html(tmpl(settings.tableTmpl, data.page)).data("list", data.page.items);
						$paginate.html(tmpl(settings.paginateTmpl, data.page));
						$instance.show();
					} else {
						$instance.hide();
					}
					
					$instance.trigger('rendered');
				}
			};
			var settings = $.extend(defaults, $instance.data(), options);
			
			$instance.on('fetch', settings.fetch)
					 .on('render', settings.render);
			
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
		});
	};
	
	$('[role="paginate-table"]').table();
	
})(jQuery, window);