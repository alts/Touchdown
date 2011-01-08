(function(window) {
	var bound = {},
		touches = [],
		touchdown_on = false;

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
							console.log(class_key);
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
							info.reset_timer = setTimeout(function(){
								info.touch = null;
							}, 500);
						}
					}
				}
			}, false);

			document.body.addEventListener('touchend', function(e) {
				for (var n = e.target; n.nodename != 'BODY'; n = n.parentNode) {
					for (class_key in bound) {
						var info = bound[class_key],
							event = info.touch;
						if (hasClass(n, class_key) && event) {
							clearTimeout(info.reset_timer);
							setTimeout(function(){
								info.touch = null;
							}, 500);

							for (var i = 0, l = info.callbacks.length; i < l; i++) {
								info.callbacks[i]({
									type: 'touchdown',
									start: event,
									end: e
								}, n);
							}
						}
					}
				}
			}, false);
		}

		bound[class_name] = bound[class_name] || {
			callbacks:[],
			touch:null,
			reset_timer:null
		};
		bound[class_name].callbacks.push(callback);
	}
})(this);
