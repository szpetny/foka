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
		
		$('[name="show"]').click(function(){
			whichOne = $(this).parent().children('.comment');
			$(whichOne).animate({width: "500px", height: "300px"}, {queue: false, duration: 3000}).css({overflow: "auto"});
		});
		
		$('[name="hide"]').click(function(){
			whichOne = $(this).parent().children('.comment');
			$(whichOne).css({ width: "", height: "", overflow: "hidden"});
		});
		
		$("#comment-form").dialog({
			 autoOpen: false,
			 height: 300,
			 width: 350,
			 modal: true,
			 buttons: {
			 "Add": function() {
				that.addComment(name, $("#from").val(), $("#comment").val(), function() {that.updateCommentCell();}); 
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
			 var who = $.trim($(that).parent().parent().parent().find("td.humanName").text());
			 $("#comment-form").data("who", who).dialog("open");
		 });
	},
	
	addComment: function(name, from, comment, callback) {
		$.ajax({
			url: 'api/hr/' + name + '/comment',
			data: "FROM: " + from + "with LOVE: " + comment + "<br/>",
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				callback(data);
			}
		});
	},
	
	updateCommentCell: function() {
		
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

