(function(window) {
	var bound = {},
		touches = [],
		touchdown_on = false,
		listen_to_moves = false;

	function hasClass(node, class_name) {
		return (' ' + node.className + ' ').replace(/[\n\r\t]/g, ' ')
			.indexOf(class_name) > -1;
	}

	window.touchdown = function(class_name, callback) {
		if (!touchdown_on) {
			touchdown_on = true;

			document.body.addEventListener('click', function(e) {
				for (var n = e.target; n.nodeName != 'BODY'; n = n.parentNode) {
					for (class_key in bound) {
						var info = bound[class_key];
						if (hasClass(n, class_key) && !info.touch) {
							for (var i = 0, l = info.callbacks.length; i < l; i++) {
								info.callbacks[i](e, n);
							}
						}
					}
				}
			}, false);

			document.body.addEventListener('touchstart', function(e) {
				for (var n = e.target; n.nodename != 'BODY'; n = n.parentNode) {
					for (class_key in bound) {
						var info = bound[class_key];
						if (hasClass(n, class_key)) {
							info.touch = e;
							info.time = +new Date;
							listen_to_moves = true;
						}
					}
				}
			}, false);

			document.body.addEventListener('touchmove', function(e) {
				if (listen_to_moves) {

				}
			}, false);

			document.body.addEventListener('touchend', function(e) {
				for (var n = e.target; n.nodename != 'BODY'; n = n.parentNode) {
					for (class_key in bound) {
						var info = bound[class_key],
							event = info.touch,
							now = +new Date;

						if (hasClass(n, class_key) && event) {
							listen_to_moves = false;
							if (info.time && now < info.time + 500) {
								for (var i = 0, l = info.callbacks.length; i < l; i++) {
									info.callbacks[i]({
										type: 'touchdown',
										start: event,
										end: e
									}, n);
								}
							} else {
								info.time = null;
							}

							setTimeout(function(){
								info.touch = null;
							}, 500);
						}
					}
				}
			}, false);
		}

		bound[class_name] = bound[class_name] || {
			callbacks:[],
			touch:null,
			time:null
		};
		bound[class_name].callbacks.push(callback);
	}
})(this);
