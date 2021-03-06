(function(ns){
	if (typeof ns.chart === 'undefined'){
		ns.chart = {};
	}

	// tooltip function factory
	ns.chart.tip = function(ctx) {

		function series_index(){
			function parse(e){
				var series = e.data('series');
				if (series !== undefined){
					var i = parseInt(series);
					return isNaN(i) ? undefined : i;
				}
				return undefined;
			}

			var $this = $(this);
			var val = parse($this);
			return val !== undefined ? val : parse($this.parent('g[data-series]'));
		}

		// TODO allow usage of custom tooltips like jquery tipsy
		// init d3-tip (only once)
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
				// TODO support arrays?
				var val = ns.title_attr(d.y, ctx.def.axes.y);
				var text = val ? ns.sformat("<span style='color:red'>{0}</span>", val) : '';

				var series = series_index.call(this);
				var label = ctx.series[series];
				var sep = text ? ':' : '';
				label = label ? ns.sformat("<strong>{0}{1}</strong> ", label, sep) : '';

				return label + text;
			});

		ctx.svg.call(tip);

		return function(){
			/* Show and hide tip on mouse events */
			d3.select(this)
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);
		};
	};
})(typeof f3 === 'undefined' ? window.f3 = {} : f3);
