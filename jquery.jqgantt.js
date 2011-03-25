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
				zoomLevel: "day",
				cellWidth: 21,
				width: 800,
				height: 400,
				outerBorder: "1px solid #999",
	            clickable: true,
	            draggable: true,
	            resizable: true,
				expandableChilds: true,
				expandedChilds: true
			};

			var options = $.extend(defaults, options);

			return this.each(function() {
				var o = options;
				var headerPartsHeight = 22;
				var headersHeight;
				switch (o.zoomLevel) {
					case "day":
						headersHeight = headerPartsHeight * 3;
						break;
					case "week":
						headersHeight = headerPartsHeight * 2;
						break;
					case "month":
						headersHeight = headerPartsHeight;
						break;
				}
				o.headersHeight = headersHeight;
				
				var startEnd = DateUtils.getBoundaryDatesFromData(o.data, 10);
				o.start = startEnd[0];
				o.end = startEnd[1];
				var container = $('<div>', { "class": "jqgantt-wrapper", "id": "test"});
				$(this).append(container);
				BuildData.scrollers(o, container);
				container.css('width', o.width).css('height', o.height);
				BuildData.headers(o, container);
				BuildData.rows(o, container);

				// Behaviour
				new Behavior(container, o).apply();
				
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
				});
				easts.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollRight, 10);
				});
				
				var wests = $('.west');
				wests.hover(function() {
					scroll_interval = setInterval(scrollLeft, 40);
				}, function() {
					clearInterval(scroll_interval);
				});
				wests.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollLeft, 10);
				});
				
				var norths = $(".north");
				norths.hover(function() {
					scroll_interval = setInterval(scrollUp, 40);
				}, function() {
					clearInterval(scroll_interval);
				});
				norths.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollUp, 10);
				});
				
				var souths = $(".south");
				souths.hover(function() {
					scroll_interval = setInterval(scrollDown, 40);
				}, function() {
					clearInterval(scroll_interval);
				});
				souths.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollDown, 10);
				});
				
				var northWests = $(".north_west");
				northWests.hover(function() {
					scroll_interval = setInterval(scrollNorthWest, 40);
				}, function() {
					clearInterval(scroll_interval);
				});
				northWests.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollNorthWest, 10);
				});
				
				var northEasts = $(".north_east");
				northEasts.hover(function() {
					scroll_interval = setInterval(scrollNorthEast, 40);
				}, function() {
					clearInterval(scroll_interval);
				});
				northEasts.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollNorthEast, 10);
				});
				
				var southWests = $(".south_west");
				southWests.hover(function() {
					scroll_interval = setInterval(scrollSouthWest, 40);
				}, function() {
					clearInterval(scroll_interval);
				});
				southWests.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollSouthWest, 10);
				});
				
				var southEasts = $(".south_east");
				southEasts.hover(function() {
					scroll_interval = setInterval(scrollSouthEast, 40);
				}, function() {
					clearInterval(scroll_interval);
				});
				southEasts.mousedown(function() {
					clearInterval(scroll_interval);
					scroll_interval = setInterval(scrollSouthEast, 10);
				});
				
				function scrollNorthWest() {
					scrollUp();
					scrollLeft();
				}
				function scrollNorthEast() {
					scrollUp();
					scrollRight();
				}
				function scrollSouthWest() {
					scrollDown();
					scrollLeft();
				}
				function scrollSouthEast() {
					scrollDown();
					scrollRight();
				}
				
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
				function scrollUp() {
					st = $(".jqgantt-labels").position().top;
					if (st < max_top) {
						$(".jqgantt-labels").css('top', st + 5 + "px");
						$(".jqgantt-grids").css('top', st + 5 + "px");
					}
				}
				function scrollDown() {
					st = $(".jqgantt-labels").position().top;
					if (st > min_top) {
						$(".jqgantt-labels").css('top', st - 5 + "px");
						$(".jqgantt-grids").css('top', st - 5 + "px");
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
			container.before($("<div>", { "class": "north scroller", "css": {
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
		gridLength: 1,
		totalDays: 1,
				
		headers: function (opts, container) {
			container.append($("<div>", { "class": "jqgantt-fixed", "css": {
				"height": opts.headersHeight + "px"
			}}));
			var headersDiv = $("<div>", { "class": "jqgantt-headers", "css": {
				"height": opts.headersHeight + "px"
			}});
			container.append(headersDiv);
			var monthsDiv = $("<div>", { "class": "jqgantt-header-months" });
			headersDiv.append(monthsDiv);
			if(opts.zoomLevel == "week") {
				var weeksDiv = $("<div>", { "class": "jqgantt-header-weeks"});
				headersDiv.append(weeksDiv);
			} else if (opts.zoomLevel == "day") {
				var weeksDiv = $("<div>", { "class": "jqgantt-header-weeks"});
            	var daysDiv = $("<div>", { "class": "jqgantt-header-days" });
				headersDiv.append(weeksDiv).append(daysDiv);
			}
			
			var last;
			var end;
			switch (opts.zoomLevel) {
				case "day":
					last = opts.start.clone().add(-4).days();
					if (last.getDate() > 24) { 
						last.set({day: 24}); 
					}
					end = opts.end.clone().add(4).days();
					if (end.getDate() < 4) {
						end.set({day: 4});
					}
					break;
				case "week":
					last = opts.start.clone().moveToDayOfWeek(1, -1);
					end = opts.end.clone().moveToDayOfWeek(0);
					break;
				case "month":
					last = opts.start.clone().moveToFirstDayOfMonth();
					end = opts.end.clone().moveToLastDayOfMonth();
					break;
			}
			var lastMonth = last.getMonth();
			var lastWeek = last.getWeek();
			
			var daysInWeek = 0;
			var daysInMonth = 0;
			var weeksInMonth = 0;
			
			var daysBetween = DateUtils.daysBetween(last, end);
			BuildData.totalDays = daysBetween;
			var numCells = daysBetween; 
			switch (opts.zoomLevel) {
				case "week":
					numCells = (daysBetween + 1) / 7;
					break;
				case "month":
					numCells = DateUtils.monthsBetween(last, end);
					break;
			}
			headersDiv.css('width', numCells * opts.cellWidth);
			
			while (last.compareTo(end) == -1) {
				daysInWeek += 1;
				daysInMonth += 1;
				var next = last.clone().addDays(1);
				if (opts.zoomLevel == "day") {
					daysDiv.append($("<div>", { "class": "jqgantt-header-day", "css": { "width": opts.cellWidth -1 + "px"}}).append(last.getDate()));
					BuildData.rowDivs += '<div class="jqgantt-grid-row-cell';
					if (opts.zoomLevel == "day" && DateUtils.isWeekend(last)) {
						BuildData.rowDivs += ' weekend';
					}
					BuildData.rowDivs += '" style="width: ' + (opts.cellWidth - 1) + 'px;"></div>';
					BuildData.gridLength += 1;
				}
				if (opts.zoomLevel == "day" || opts.zoomLevel == "week") {
					if (lastWeek != next.getWeek()) {
						var weeksWidth;
						if (opts.zoomLevel == "week") {
							weeksWidth = opts.cellWidth - 1;
							BuildData.rowDivs += '<div class="jqgantt-grid-row-cell';
							if (opts.zoomLevel == "day" && DateUtils.isWeekend(last)) {
								BuildData.rowDivs += ' weekend';
							}
							BuildData.rowDivs += '" style="width: ' + (opts.cellWidth - 1) + 'px;"></div>';
							BuildData.gridLength += 1;
						} else {
							weeksWidth = daysInWeek * opts.cellWidth - 1;
						}
						weeksDiv.append($("<div>", {
							"class": "jqgantt-header-week",
							"style": "width: " + weeksWidth + "px"
						}).append(last.getWeek()));
						lastWeek = next.getWeek();
						daysInWeek = 0;
						weeksInMonth += 1;
					}
				}
				if (lastMonth != next.getMonth()) {
					var monthsWidth;
					if (opts.zoomLevel == "month") {
						monthsWidth = opts.cellWidth - 1;
						BuildData.rowDivs += '<div class="jqgantt-grid-row-cell';
						if (opts.zoomLevel == "day" && DateUtils.isWeekend(last)) {
							BuildData.rowDivs += ' weekend';
						}
						BuildData.rowDivs += '" style="width: ' + (opts.cellWidth - 1) + 'px;"></div>';
						BuildData.gridLength += 1;
					} else if (opts.zoomLevel == "week") {
						monthsWidth = weeksInMonth * opts.cellWidth -1;
					} else {
						monthsWidth = daysInMonth * opts.cellWidth - 1
					}
					monthsDiv.append($("<div>", {
						"class": "jqgantt-header-month",
						"style": "width: " + monthsWidth + "px"
					}).append(BuildData.monthNames[last.getMonth()] + "/" + last.getFullYear()));
					lastMonth = next.getMonth();
					daysInMonth = 0;
					weeksInMonth = 0;
				}
				
				last = next;
			}
			if (opts.zoomLevel == "day") {
				daysDiv.find("div:last").addClass('last');
			}
			if (opts.zoomLevel == "day" || opts.zoomLevel == "week") {
				var weeksWidth;
				if (opts.zoomLevel == "week") {
					weeksWidth = opts.cellWidth - 1;
					BuildData.rowDivs += '<div class="jqgantt-grid-row-cell';
					if (opts.zoomLevel == "day" && DateUtils.isWeekend(last)) {
						BuildData.rowDivs += ' weekend';
					}
					BuildData.rowDivs += '" style="width: ' + (opts.cellWidth - 1) + 'px;"></div>';
				} else {
					weeksWidth = daysInWeek * opts.cellWidth - 1;
				}
				weeksDiv.append($("<div>", {
					"class": "jqgantt-header-week last",
					"style": "width: " + weeksWidth + "px"
				}).append(end.getWeek()));
			}
			var monthsWidth;
			if (opts.zoomLevel == "month") {
				monthsWidth = opts.cellWidth - 1;
				BuildData.rowDivs += '<div class="jqgantt-grid-row-cell';
				if (opts.zoomLevel == "day" && DateUtils.isWeekend(last)) {
					BuildData.rowDivs += ' weekend';
				}
				BuildData.rowDivs += '" style="width: ' + (opts.cellWidth - 1) + 'px;"></div>';
			} else if (opts.zoomLevel == "week") {
				monthsWidth = (weeksInMonth + 1) * opts.cellWidth -1;
			} else {
				monthsWidth = daysInMonth * opts.cellWidth - 1
			}
			var monthDiv = $("<div>", {
				"class": "jqgantt-header-month last",
				"style": "width: " + monthsWidth + "px"
			});
			monthsDiv.append(monthDiv);
			if (monthsWidth > 50) {
				monthDiv.append(BuildData.monthNames[last.getMonth()] + "/" + last.getFullYear());
			}
		},
		
		rows: function(opts, container) {
			var daySize = DateUtils.monthsBetween(opts.start, opts.end) / DateUtils.daysInMonths(opts.start, opts.end);
			var labelsDiv = $("<div>", { "class": "jqgantt-labels", "css": {
				"top": opts.headersHeight + "px"
			}});
			var gridDiv = $("<div>", { "class": "jqgantt-grids", "css": {
				"width": opts.cellWidth * BuildData.gridLength + "px",
				"top": opts.headersHeight + "px"
			}});
			container.append(labelsDiv).append(gridDiv);
			var linkId = 0;
			for (var i = 0; i < opts.data.length; i++) {
				buildRows(opts.data[i].items, 0, null, '');
			}
			labelsDiv.find("div:first").addClass('first');
			labelsDiv.find("div:last").addClass('last');
			gridDiv.find("div.jqgantt-grid-row:first").addClass('first');
			gridDiv.find("div.jqgantt-grid-row:last").addClass('last').addClass('last-in-group');
			function buildRows(data, level, parent, linkClasses) {
				var hidden = false;
				var childParentClass = 'parent';
				if (level > 0) { childParentClass = 'child'; }
				if (level > 0 && !opts.expandedChilds && opts.expandableChilds) { 
					hidden = true;
				}
				for (var i = 0; i < data.length; i++) {
					linkId++;
					var size, offset;
					switch (opts.zoomLevel) {
						case "day":
							size = DateUtils.daysBetween(data[i].start, data[i].end) + 1;
							offset = DateUtils.daysBetween(opts.start, data[i].start) + 4;
							break;
						case "week":
							size = DateUtils.daysBetween(data[i].start, data[i].end) / 7 + 1;
							offset = DateUtils.daysBetween(opts.start, data[i].start) / 7;
							break;
						case "month":
							size = (DateUtils.daysBetween(data[i].start, data[i].end) + 1) * daySize;
							offset = DateUtils.daysBetween(opts.start, data[i].start) * daySize;
							break;
					}
					var classes = "jqgantt-block" + ((data[i].class) ? ' ' + data[i].class : '');
					var labelDiv = $('<div>', { 
						"class": "jqgantt-label " + childParentClass + " " + " " + linkClasses + " parent_" + parent,
						"css": {
							"padding-left": 10 * level + "px"
						},
						"text": data[i].name
					});
					if (data[i].children) {
						var link = $("<a>", { 
							"class": "parent ui-icon " + ((opts.expandedChilds) ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-1-e'),
							"href": "#",
							"css": { "float": "left" }
						})
						.data('link-id', linkId)
						.click(function() { 
							var childs = $('.parent_'+$(this).data('link-id'));
							if ($(this).hasClass('ui-icon-triangle-1-s')) {
								childs.hide();
							} else {
								childs.show();
								$(".parent", childs).addClass('ui-icon-triangle-1-s').removeClass('ui-icon-triangle-1-e');
							}
							$(this).toggleClass('ui-icon-triangle-1-s ui-icon-triangle-1-e');
						});
						labelDiv.prepend(link);
					} else {
						labelDiv.css('padding-left', 10 * level + 16 + "px");
					}
					labelsDiv.append(labelDiv);
					var row = $("<div>", { "class": "jqgantt-grid-row parent_" + parent + " " + linkClasses});
					if (parent) { row.data('parent', parent)}
					if (hidden) { row.hide(); labelDiv.hide();}
					gridDiv.append(row);
					row.append(BuildData.rowDivs);
					if (level == 0) {
						row.prevAll('div.jqgantt-grid-row').first().addClass('last-in-group');
						row.addClass('first-in-group');
					}
					var div = $("<div>", {
						"class": classes,
						"css": {
							"width": ((size * opts.cellWidth) - 7) + "px",
							"margin-left": ((offset * (opts.cellWidth) + 3)) + "px",
							"z-index": "2"
						}
					});
					if (data[i].color) {
						div.css('background-color', data[i].color);
					}
					if (data[i].text) {
						var span = $("<span>", {
							"class": "jqgantt-block-text",
							"text": data[i].text
						});
						div.append(span);
					}
					var blockData = { name: data[i].name, text: data[i].text };
					div.data("block-data", data[i]);
					row.append(div);
					
					if(data[i].children) {
						buildRows(data[i].children, level + 1, linkId, linkClasses + " parent_"+parent);
					}
					
				}
			}
			
		}
	};
	
	var Behavior = function (div, opts) {
		
		function apply() {
			if (opts.clickable) { 
            	bindBlockClick(div, opts.behavior.onClick); 
        	}
            if (opts.resizable) { 
            	bindBlockResize(div, opts.cellWidth, opts.start, opts.behavior.onResize); 
        	}
            
            if (opts.draggable) { 
            	bindBlockDrag(div, opts.cellWidth, opts.start, opts.behavior.onDrag); 
        	}
		}

        function bindBlockClick(div, callback) {
            $("div.jqgantt-block").live("click", function () { // TODO just in this div
                if (callback) { callback(jQuery(this).data("block-data")); }
            });
        }
        function bindBlockResize(div, cellWidth, startDate, callback) {
        	jQuery("div.jqgantt-block", div).resizable({
        		grid: cellWidth, 
        		handles: "e,w",
        		stop: function () {
        			var block = jQuery(this);
        			//updateDataAndPosition(div, block, cellWidth, startDate);
        			if (callback) { callback(block.data("block-data")); }
        		}
        	});
        }
        
        function bindBlockDrag(div, cellWidth, startDate, callback) {
        	jQuery("div.jqgantt-block", div).draggable({
        		axis: "x", 
        		grid: [cellWidth, cellWidth],
        		stop: function () {
        			var block = jQuery(this);
        			//updateDataAndPosition(div, block, cellWidth, startDate);
        			if (callback) { callback(block.data("block-data")); }
        		}
        	});
        }
        
        function updateDataAndPosition(div, block, cellWidth, startDate) {
        	var container = jQuery("div.ganttview-slide-container", div);
        	var scroll = container.scrollLeft();
			var offset = block.offset().left - container.offset().left - 1 + scroll;
			
			// Set new start date
			var daysFromStart = Math.round(offset / cellWidth);
			var newStart = startDate.clone().addDays(daysFromStart);
			block.data("block-data").start = newStart;

			// Set new end date
        	var width = block.outerWidth();
			var numberOfDays = Math.round(width / cellWidth) - 1;
			block.data("block-data").end = newStart.clone().addDays(numberOfDays);
			jQuery("div.ganttview-block-text", block).text(numberOfDays + 1);
			
			// Remove top and left properties to avoid incorrect block positioning,
        	// set position to relative to keep blocks relative to scrollbar when scrolling
			block.css("top", "").css("left", "")
				.css("position", "relative").css("margin-left", offset + "px");
        }

        return {
        	apply: apply	
        };
	}
	
	var DateUtils = {
    	
        daysBetween: function (start, end) {
            if (!start || !end) { return 0; }
            //start = Date.parse(start); end = Date.parse(end);
            if (start.getYear() == 1901 || end.getYear() == 8099) { return 0; }
            var count = 0, date = start.clone();
            while (date.compareTo(end) == -1) { count = count + 1; date.addDays(1); }
            return count;
        },

		monthsBetween: function (start, end) {
			if (!start || !end) { return 0; }
			if (start.getYear() == 1901 || end.getYear() == 8099) { return 0; }
			var count = 0, date = start.clone();
			var firstMonth = date.getMonth();
			while (date.compareTo(end) == -1) {
				count += 1;
				date.moveToLastDayOfMonth().addDays(1);
			}
			return count;
		},
		
		daysInMonths: function (start, end) {
			if (!start || !end) { return 0; }
			if (start.getYear() == 1901 || end.getYear() == 8099) { return 0; }
			var count = 0, date = start.clone();
			var firstMonth = date.getMonth();
			while (date.compareTo(end) == -1) {
				count += Date.getDaysInMonth(date.getYear(), date.getMonth());
				date.moveToLastDayOfMonth().addDays(1);
			}
			return count;
		},
        
        isWeekend: function (date) {
            return date.getDay() % 6 == 0;
        },

		getBoundaryDatesFromData: function (data, minDays) {
			var minStart = data[0].items[0].start;
			var maxEnd = data[0].items[0].end;
			for (var i = 0; i < data.length; i++) {
				findDates(data[i].items);
			}
			function findDates(obj) {
				for (var j = 0; j < obj.length; j++) {
					var start = obj[j].start;
					var end = obj[j].end;
					if (minStart.compareTo(start) == 1) { minStart = start; }
					if (maxEnd.compareTo(end) == -1) { maxEnd = end; }
					if (obj[j].children) { findDates(obj[j].children); }
				}
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