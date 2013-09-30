(function( $ ) {

	$.fn.imageLouper = function(options) {

		options = $.extend({
			size: 200,
			magnification: 2.5,
			frameSize: 4,
			frameColor: 'white',
			background: 'black',
			trigger: 'hover',
			style: 'offset'
		}, options || {});

		var radius = options.size / 2,
			active = false,
			loupe = $('<figure/>').css({
				width: options.size,
				height: options.size,
				position: 'absolute',
				pointerEvents: 'none',
				display: 'none'
			}),
			c = $('<canvas/>').attr({
				width: options.size,
				height: options.size
			}),
			bg = $('<div/>').css({
				width: options.size - options.frameSize*2,
				height: options.size - options.frameSize*2,
				position: 'absolute',
				top: options.frameSize,
				left: options.frameSize,
				borderRadius: '50%',
				backgroundColor: options.background,
				backgroundRepeat: 'no-repeat',
				overflow: 'hidden'
			});

		loupe.append(bg);

		if (options.style === 'offset') {
			loupe.append(c);
			var ctx = c.get(0).getContext('2d');
			ctx.beginPath();
			ctx.arc(radius, radius, radius, 0.5*Math.PI, 2*Math.PI);
			ctx.quadraticCurveTo(options.size*0.95, options.size*0.95, options.size, options.size);
			ctx.quadraticCurveTo(options.size*0.95, options.size*0.95, radius, options.size);
			ctx.fillStyle = options.frameColor;
			ctx.fill();
		} else {
			bg.css({
				width: options.size - (options.frameSize / 2),
				height: options.size - (options.frameSize / 2),
				border: options.frameSize + 'px solid ' + options.frameColor
			});
		}

		bg.clone().css({
			background: '-webkit-radial-gradient(transparent, transparent 50%, rgba(0,0,0,.8))'
		}).appendTo(loupe);

		loupe.appendTo('body');

		if (options.trigger === 'click') {
			this.css('cursor', '-webkit-zoom-in');
			this.on('click', function() {
				loupe.toggle();
				active = !active;
				$(this).css('cursor', '-webkit-zoom-' + (active ? 'out' : 'in'));
			});
		}

		this.on('mousemove touchmove', function(e) {
			e.preventDefault();

			if (e.type === 'touchmove') {
				e = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			}

			var w = this.width,
				h = this.height,
				x = (e.offsetX / w),
				y = (e.offsetY / h),
				magW = w * options.magnification,
				magH = h * options.magnification,
				xOffset = -((x * magW) - radius),
				yOffset = -((y * magH) - radius);

			bg.css('backgroundImage') === 'none' && bg.css('backgroundImage', 'url(' + ( $(this).data('magnify') || this.src ) + ')');

			bg.css({
				backgroundPosition: xOffset + 'px ' + yOffset + 'px',
				backgroundSize: magW + 'px ' + magH + 'px'
			});

			loupe.css({
				top: e.pageY - (options.style === 'offset' ? options.size - 5 : (options.size / 2) + (options.frameSize / 2)),
				left: e.pageX - (options.style === 'offset' ? options.size - 5 : (options.size / 2) + (options.frameSize / 2))
			});

			if (options.trigger === 'hover' || active) {
				loupe.show();
			}
		});

		this.on('mouseout touchend', function(e) {
			e.preventDefault();
			loupe.hide();
			active = false;
			if (options.trigger === 'click') {
				$(this).css('cursor', '-webkit-zoom-' + (active ? 'out' : 'in'));
			}
		});

		return this;

	};

})( jQuery );
