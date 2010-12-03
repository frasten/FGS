	$.queue2 = {
		_timer: null,
		_queue: [],
		add: function(fn, context, time) {
			var setTimer = function(time) {
				$.queue2._timer = setTimeout(function() {
					time = $.queue2.add();
					if ($.queue2._queue.length) {
						setTimer(time);
					}
				}, time || 1);
			}

			if (fn) {
				$.queue2._queue.push([fn, context, time]);
				if ($.queue2._queue.length == 1) {
					setTimer(time);
				}
				return;
			}

			var next = $.queue2._queue.shift();
			if (!next) {
				return 0;
			}
			next[0].call(next[1] || window, next[1]);
			return next[2];
		},
		clear: function() {
			clearTimeout($.queue2._timer);
			$.queue2._queue = [];
		}
	};