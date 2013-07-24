var logicJS = {
	dragFok: function() {
		$("div.draggableFok").draggable();
	},
	
	makeDroppable: function() {
		$("td.droppableCell").droppable({
			hoverClass: 'ui-state-active',
			tolerance: 'pointer',
			drop: function(event, ui) {
				var that = this;
				var tr = $(this).parent();
				var name = $('td.humanName', $(this).parent()).text();
				
				logicJS.update(name, function(current) {
					logicJS.incrementFokCounter(tr, current);
					logicJS.displayFok(tr, that);
					logicJS.restoreFokImg();
					logicJS.makeItDraggable();
				});
			}
		});
	},
	
	restoreFokImg: function() {
		$("#zoo").html(
			"<div class=\"draggableFok\" style=\"width:67px; height:64px; float:left;\">"
				+ "<img src=\"resources/images/fOK.png\" />"
			+"</div>"	
		);
	},
	
	incrementFokCounter: function(tr, currentHuman) {
		var counterVal = currentHuman.fokCount; 
		$('.fOkCounter', tr).text(counterVal);
	},
	
	displayFok: function(tr, td) {
		if ($.trim($('.fOkCounter', tr).text()) != '') {
			$(td).find('img').css('display', '');
		}
	},
	
	makeItDraggable: function() {
		$("div.draggableFok").draggable({
			snap: ".droppableCell",
			snapMode: "both",
			snapTolerance: 30,
			revert: true
		});
	},
	
	loadFokarium: function() {
		$('#fokarium tbody').empty();
		
		$.getJSON('api/hr/list', function(data) {
			data.forEach(function (record) {
				logicJS.addNewRow(record.humanName, record.fokCount);
			});
			logicJS.makeDroppable();
			logicJS.displayComments();
		});
	},
	
	initButtons: function() {
		$("#add").click(function() {
			var name = $.trim($("#humanRsrc").val());
			logicJS.insert(name);
			logicJS.addNewRow(name, 0);
			$("#humanRsrc").val('');
			logicJS.makeDroppable();
		});
		
		$("#reset").click(function(){
			logicJS.reset(function() {
				logicJS.loadFokarium();
			});
		});
	},
	
	addNewRow: function(name, fokCount) {
		var that = this;
		var row = $(Mustache.render($('#fok-row').text(), {
			humanName: name,
			fokCount: fokCount,
			displayFOK: fokCount > 0
		}));
		
		$("#fokarium > table > tbody").append(row);
		$('td span.evaporateResource', row).click(function() {
			$("#evaporateConfirmation").dialog({
				modal: true,
				closeOnEscape: false,
				buttons: [
				{text: "Yes", click: function() { 
									$(this).dialog("close");
									that.evaporateResource(name, function() {
										row.remove();
									});
							  }
				},
				{text: "No", click: function() { $(this).dialog("close");}},
				]
			}).show();
		});
		
		$("#comment-form").dialog({
			 autoOpen: false,
			 height: 300,
			 width: 350,
			 modal: true,
			 buttons: {
			 "Add": function() {
				that.addCommentIfNeededAndReturnAll($(this).data('who'), $("#comment").val(), function(name, data) {that.getComments(name, data);}); 
				 $(this).dialog("close");
			 },
			 "Cancel": function() {
				 $(this).dialog("close");
			 }},
			 close: function() {
				 $("#from").val("");
				 $("#comment").val("");
			 }
		 });
		
		 $('[name="addComment"]').click(function() {
			 var that = this;
			 var who = $.trim($(that).parent().siblings("td.humanName").text());
			 $("#comment-form").data("who", who).dialog("open");
		 });
	},
	
	addCommentIfNeededAndReturnAll: function(name, comment, callback) {
		$.ajax({
			url: 'api/hr/' + name + '/comment',
			data: JSON.stringify(comment),
			dataType: 'json',
			headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
			type: 'POST',
			success: function(data) {
				callback(name, data);
			}
		});
	},
	
	getComments: function(name, data) {
		 var whoseFok = $("td.humanName:contains('"+ name +"')").siblings(".droppableCell").children('img');
		 var listString = '<ul class="ui-widget-content">';
		 for (var i = 0; i < data.length; i++) {
			 listString += '<li>' + data[i] + '</li>';
		 }
		 listString += '</ul>';
		 if (listString != '<ul class="ui-widget-content"></ul>') {
			 whoseFok.attr('title', listString);
			 whoseFok.tooltip({track: true, 
	    		   delay: 20, 
	    		   showURL: false});
		 }
	},
	
	displayComments: function() {
		var droppableCells = $('td.droppableCell');
		var that = this;
		for (var i = 0; i < droppableCells.length; i++) {
			if ($(droppableCells[i]).children('img').css('display') != 'none') {
				var humanName = $.trim($(droppableCells[i]).siblings("td.humanName").text());
				that.addCommentIfNeededAndReturnAll(humanName, "", 
						function(name, data) {that.getComments(name, data);});
				
			}
		}
	},
	
	insert: function(name) {
		$.ajax({
			url: 'api/hr',
			type: 'POST',
			data: JSON.stringify({
				humanName: name
			}),
			contentType: 'application/json',
			dataType: 'json'
		});
	},
	
	update: function(name, callback) {
		$.ajax({
			url: 'api/hr/' + name + '/raise',
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				callback(data);
			}
		});
	},
	
	evaporateResource: function(name, callback) {
		$.ajax({
			url: 'api/hr/' + name + '/evaporate',
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				callback();
			}
		});
	},
	
	reset: function(callback) {
		$.ajax({
			url: 'api/hr/reset',
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				callback();
			}
		});
	},
};

