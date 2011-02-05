/*
jQuery.jqgantt v.0.1.0
Copyright (c) 2011 Andreas Arledal - andreas.arledal@me.com
MIT License Applies
*/

(function($) {
	
	$.fn.extend({
		
		// Pass options variable to the function
		jqgantt: function(options) {
			
			// Set default values
			var defaults = {
				cellWidth: 21,
				width: 800,
				height: 400,
				outerBorder: "1px solid #999"
			};

			var options = $.extend(defaults, options);
			
			return this.each(function() {
				var o = options;
				var startEnd = DateUtils.getBoundaryDatesFromData(o.data, 10);
				o.start = startEnd[0];
				o.end = startEnd[1];
				var container = $(this);
				BuildData.scrollers(o, container);
				container.addClass("jqgantt-wrapper");
				container.css('width', o.width).css('height', o.height);
				BuildData.headers(o, container);
				BuildData.rows(o, container);

				// Behaviour
				var scroll_interval;
				
				var max_top = $(".jqgantt-labels").position().top;
				var min_top = $(".jqgantt-labels").parent().height() - $(".jqgantt-labels").height();
				var max_left = $(".jqgantt-headers").position().left;
				var min_left = $(".jqgantt-headers").parent().width() - $(".jqgantt-headers").width();
				
				var easts = $('.east');
				easts.hover(function() {
					scroll_interval = setInterval(scrollRight, 40);
				}, function() {
					clearInterval(scroll_interval);
				}).mousedown(function() {
					scroll_interval = setInterval(scrollRight, 10);
				});
				var wests = $('.west');
				wests.hover(function() {
					scroll_interval = setInterval(scrollLeft, 40);
				}, function() {
					clearInterval(scroll_interval);
				}).mousedown(function() {
					scroll_interval = setInterval(scrollLeft, 10);
				});
				
				function scrollRight() {
					sl = $(".jqgantt-headers").position().left;
					if (sl > min_left) {
						$(".jqgantt-headers").css('left', sl - 5 + "px");
						$(".jqgantt-grids").css('left', sl - 5 + "px");
					}
				}
				
				function scrollLeft() {
					sl = $(".jqgantt-headers").position().left;
					if (sl < max_left) {
						$(".jqgantt-headers").css('left', sl + 5 + "px");
						$(".jqgantt-grids").css('left', sl + 5 + "px");
					}
				}
				
				
			});
		}
	});
	
	var BuildData = {
		scrollers: function(opts, container) {
			var calcPart = Math.round((opts.width + 2) / 4);
			var calcWidth = calcPart * 4;
			var overflowWidth = 19 - ((calcWidth - opts.width) / 2);
			
			container.before($("<div>", { "class": "north_west scroller", "css": {
				"width": overflowWidth + calcPart - 2 + "px",
				"height": "20px",
				"float": "left",
				"border-left": opts.outerBorder,
				"border-top": opts.outerBorder,
				"border-right": opts.outerBorder,
				"-moz-border-radius-topleft": "10px",
				"-webkit-border-top-left-radius": "10px",
				"border-top-left-radius": "10px",
				"background": "transparent url('../images/north_west.png') no-repeat left center"
			}}));
			container.before($("<div>", { "class": "west scroller", "css": {
				"width": calcPart * 2 - 1 + "px",
				"height": "20px",
				"float": "left",
				"border-top": opts.outerBorder,
				"border-right": opts.outerBorder,
				"background":  "transparent url('../images/north.png') no-repeat center center"
			}}));
			container.before($("<div>", { "class": "north_east scroller", "css": {
				"width": overflowWidth + calcPart - 1 + "px",
				"height": "20px",
				"float": "left",
				"border-right": opts.outerBorder,
				"border-top": opts.outerBorder,
				"-moz-border-radius-topright": "10px",
				"-webkit-border-top-right-radius": "10px",
				"border-top-right-radius": "10px",
				"background":  "transparent url('../images/north_east.png') no-repeat right center"
			}}))
			var wests = $("<div>", { "class": "jqgantt-west-scrollers scroller", "css": {
				"width": overflowWidth + 1 + "px",
				"height": opts.height + 2 + "px",
				"float": "left"
			}});
			container.before(wests);
			wests.append($("<div>", { "class": "north_west scroller", "css": {
				"width": overflowWidth + "px",
				"height": (opts.height + 2) / 4 - 1 + "px",
				"clear": "both",
				"float": "left",
				"border-left": opts.outerBorder,
				"border-bottom": opts.outerBorder
			}}));
			wests.append($("<div>", { "class": "west scroller", "css": {
				"float": "left",
				"width": overflowWidth + "px",
				"clear": "both",
				"height": (opts.height + 2) / 2 - 1 + "px",
				"border-left": opts.outerBorder,
				"border-bottom": opts.outerBorder,
				"background":  "transparent url('../images/west.png') no-repeat center center"
			}}));
			wests.append($("<div>", { "class": "south_west scroller", "css": {
				"width": overflowWidth + "px",
				"height": (opts.height + 2) / 4 + "px",
				"float": "left",
				"border-left": opts.outerBorder
			}}));
			var easts = $("<div>", { "class": "jqgantt-east-scrollers", "css": {
				"width": overflowWidth + 1 + "px",
				"height": opts.height + 2 + "px",
				"float": "left"
			}});
			container.after(easts);
			easts.append($("<div>", { "class": "north_east scroller", "css": {
				"width": overflowWidth + "px",
				"height": (opts.height + 2) / 4 - 1 + "px",
				"border-right": opts.outerBorder,
				"border-bottom": opts.outerBorder
			}}));
			easts.append($("<div>", { "class": "east scroller", "css": {
				"width": overflowWidth + "px",
				"height": (opts.height + 2) / 2 - 1 + "px",
				"border-right": opts.outerBorder,
				"border-bottom": opts.outerBorder,
				"background":  "transparent url('../images/east.png') no-repeat center center"
			}}));
			easts.append($("<div>", { "class": "south_east scroller", "css": {
				"width": overflowWidth + "px",
				"height": (opts.height + 2) / 4 + "px",
				"border-right": opts.outerBorder
			}}));
			var sw = $("<div>", { "class": "south_west scroller", "css": {
				"width": calcPart + overflowWidth - 2 + "px",
				"height": "19px",
				"float": "left",
				"clear": "both",
				"border-left": opts.outerBorder,
				"border-bottom": opts.outerBorder,
				"border-right": opts.outerBorder,
				"-moz-border-radius-bottomleft": "10px",
				"-webkit-border-bottom-left-radius": "10px",
				"border-bottom-left-radius": "10px",
				"background":  "transparent url('../images/south_west.png') no-repeat left center"
			}});
			easts.after(sw);
			var s = $("<div>", { "class": "south scroller", "css": {
				"width": calcPart * 2 - 1 + "px",
				"height": "19px",
				"float": "left",
				"border-bottom": opts.outerBorder,
				"border-right": opts.outerBorder,
				"background":  "transparent url('../images/south.png') no-repeat center center"
			}});
			sw.after(s);
			var se = $("<div>", { "class": "south_east scroller", "css": {
				"width": calcPart + overflowWidth - 1 + "px",
				"height": "19px",
				"float": "left",
				"border-bottom": opts.outerBorder,
				"border-right": opts.outerBorder,
				"-moz-border-radius-bottomright": "10px",
				"-webkit-border-bottom-right-radius": "10px",
				"border-bottom-right-radius": "10px",
				"background":  "transparent url('../images/south_east.png') no-repeat right center"
			}});
			s.after(se); 
		},
			
		monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		rowDivs: "",
		totalDates: 1,
		
		headers: function (opts, container) {
			container.append($("<div>", { "class": "jqgantt-fixed"}));
			var headersDiv = $("<div>", { "class": "jqgantt-headers"});
			container.append(headersDiv);
			var monthsDiv = $("<div>", { "class": "jqgantt-header-months" });
			var weeksDiv = $("<div>", { "class": "jqgantt-header-weeks"});
            var daysDiv = $("<div>", { "class": "jqgantt-header-days" });
			headersDiv.append(monthsDiv).append(weeksDiv).append(daysDiv);
			
			var last = opts.start.clone().add(-4).days();
			if (last.getDate() > 24) { 
				last.set({day: 24}); 
			}
			var lastMonth = last.getMonth();
			var lastWeek = last.getWeek();
			
			var daysInWeek = 0;
			var daysInMonth = 0;
			
			var end = opts.end.clone().add(4).days();
			if(end.getDate() < 4) {
				end.set({day: 4});
			}
			
			var daysBetween = DateUtils.daysBetween(last, end);
			headersDiv.css('width', daysBetween * opts.cellWidth);
			
			while (last.compareTo(end) == -1) {
				daysInWeek += 1;
				daysInMonth += 1;
				var next = last.clone().addDays(1);
				daysDiv.append($("<div>", { "class": "jqgantt-header-day", "css": { "width": opts.cellWidth -1 + "px"}}).append(last.getDate()));
				if (lastWeek != next.getWeek()) {
					weeksDiv.append($("<div>", {
						"class": "jqgantt-header-week",
						"style": "width: " + (daysInWeek * opts.cellWidth - 1) + "px"
					}).append(last.getWeek()));
					lastWeek = next.getWeek();
					daysInWeek = 0;
				}
				if (lastMonth != next.getMonth()) {
					monthsDiv.append($("<div>", {
						"class": "jqgantt-header-month",
						"style": "width: " + (daysInMonth * opts.cellWidth - 1) + "px"
					}).append(BuildData.monthNames[last.getMonth()] + "/" + last.getFullYear()));
					lastMonth = next.getMonth();
					daysInMonth = 0;
				}
				BuildData.rowDivs += '<div class="jqgantt-grid-row-cell';
				if (DateUtils.isWeekend(last)) {
					BuildData.rowDivs += ' weekend';
				}
				BuildData.rowDivs += '" style="width: ' + opts.cellWidth + '"></div>';
				BuildData.totalDates += 1;
				last = next;
			}
			daysDiv.find("div:last").addClass('last');
			weeksDiv.append($("<div>", {
				"class": "jqgantt-header-week last",
				"style": "width: " + (daysInWeek * opts.cellWidth - 1) + "px"
			}).append(end.getWeek()));
			monthsDiv.append($("<div>", {
				"class": "jqgantt-header-month last",
				"style": "width: " + (daysInMonth * opts.cellWidth - 1) + "px"
			}).append(BuildData.monthNames[last.getMonth()] + "/" + last.getFullYear()));
		},
		
		rows: function(opts, container) {
			var labelsDiv = $("<div>", { "class": "jqgantt-labels" });
			var blocksDiv = $("<div>", { "class": "jqgantt-blocks", "css": { 
				"width": opts.cellWidth * BuildData.totalDates + "px"
			}});
			var gridDiv = $("<div>", { "class": "jqgantt-grids", "css": {
				"width": opts.cellWidth * BuildData.totalDates + "px"
			}});
			container.append(labelsDiv).append(blocksDiv).append(gridDiv);
			for (var i = 0; i < opts.data.length; i++) {
				var size = DateUtils.daysBetween(opts.data[i].start, opts.data[i].end) + 1;
				var offset = DateUtils.daysBetween(opts.start, opts.data[i].start) + 4;
				labelsDiv.append('<div class="jqgantt-label">'+opts.data[i].name+"</div>");
				var row = $("<div>", { "class": "jqgantt-grid-row" });
				var blockContainer = $("<div>", {"class": "jqgantt-blocks-row" });
				gridDiv.append(row).append(blockContainer);
				row.append(BuildData.rowDivs);
				var div = $("<div>", {
					"class": "jqgantt-block",
					"css": {
						"width": ((size * opts.cellWidth) - 7) + "px",
						"margin-left": ((offset * (opts.cellWidth) + 3)) + "px",
						"z-index": "2"
					}
				});
				blockContainer.append(div);
			}
		}
	};
	
	var DateUtils = {
    	
        daysBetween: function (start, end) {
            if (!start || !end) { return 0; }
            //start = Date.parse(start); end = Date.parse(end);
            if (start.getYear() == 1901 || end.getYear() == 8099) { return 0; }
            var count = 0, date = start.clone();
            while (date.compareTo(end) == -1) { count = count + 1; date.addDays(1); }
            return count;
        },
        
        isWeekend: function (date) {
            return date.getDay() % 6 == 0;
        },

		getBoundaryDatesFromData: function (data, minDays) {
			var minStart = new Date(); 
			var maxEnd = new Date();
			for (var i = 0; i < data.length; i++) {
				var start = data[i].start;
				var end = data[i].end;
				if (i == 0) { 
					minStart = start;
					maxEnd = end; 
				}
				if (minStart.compareTo(start) == 1) { minStart = start; }
				if (maxEnd.compareTo(end) == -1) { maxEnd = end; }
				
			}
			
			// Insure that the width of the chart is at least the slide width to avoid empty
			// whitespace to the right of the grid
			if (DateUtils.daysBetween(minStart, maxEnd) < minDays) {
				maxEnd = minStart.clone().addDays(minDays);
			}
			
			return [minStart, maxEnd];
		}
    };

	
	
})( jQuery );