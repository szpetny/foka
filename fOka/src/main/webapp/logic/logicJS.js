var logicJS = {
	db: "",	
		
	initDb: function() {
		if (!$.cookie('fokarium')) {
			db = TAFFY();
		}
		else {
			var jsonDb = $.cookie('fokarium');
			db = TAFFY(jsonDb);
		}
		
	},	
	
	dragFok: function() {
		$("div.draggableFok").draggable();
		this.makeDroppable();
	},
	
	makeDroppable: function() {
		$("td.droppableCell").droppable({
			drop: function(event, ui) {
				var tr = $(this).parent();
				var rowNo = tr.index();
				
				var counterVal;
				if ($.trim($(tr).children().last().text()) == '') {
					counterVal = 1;
				}
				else {
					var tmpVal = $.trim($(tr).children().last().text());
					tmpVal = parseInt(tmpVal, '10');
					counterVal = tmpVal + 1;
				}
				
				$(tr).children().last().text(counterVal);
				$(tr).children().first().children().first().val(counterVal);

				logicJS.update(rowNo);
				
				if ($.trim($(tr).children().last().text()) != '') {
					$(this).find('img').css('display', '');
				}
				$("#zoo").html(
					"<div class=\"draggableFok\" style=\"width:134px; height:127px; float:left;\">"
						+ "<img src=\"../resources/images/fOK.png\" />"
					+"</div>"	
				);
				logicJS.makeItDraggable();
			}
		});
	},
	
	makeItDraggable: function() {
		$("div.draggableFok").draggable({
			snap: ".droppableCell"
		});
	},
	
	createFokarium: function() {
		$("#fokarium").append('<table class="ui-widget-content">');
		$("#fokarium > table").append(
			'<thead id="header" class="ui-widget-header">' 
				+ '<tr><td style="padding:10px">Human resource</td><td style="padding:10px">fOK</td><td style="padding:20px">fOK counter</td></tr>'
			+ '</thead>'
		);
		$("#fokarium > table").append('<tbody class="ui-widget-content">');
		
		
		db().each(function (record, recordnumber) {
			logicJS.addNewRow(record.id, record.humanName, record.fokCount);
		});
	},
	
	addNewHumanResource: function() {
		$("#add").click(function() {
			var rowNo = $("#fokarium > table tbody tr:last").index() + 1;
			var name = $.trim($("#humanRsrc").val());
			logicJS.insert(rowNo, name);
			logicJS.addNewRow(rowNo, name, 0);
			$("#humanRsrc").val('');
			logicJS.makeDroppable();
		});
	},
	
	addNewRow: function(rowNo, name, fokCount) {
		$("#fokarium > table > tbody").append('<tr name="' + name + '" class="record">');
		
		var rowNo = $("#fokarium > table tr:last").index();
		
		$("#fokarium > table > tbody > tr[name='" + name + "']")
			.append('<td class="ui-widget-content" style="padding:20px" name="facet">' + name + 
						'<input type="hidden" id="fokCount' + rowNo + '" value="" />' +
					'</td>');
		
		var display = fokCount > 0 ? '' : 'style="display:none"';
		$("#fokarium > table > tbody > tr[name='" + name + "']")
			.append('<td class="ui-widget-content droppableCell" style="width:134px; height:127px;">' +
						'<img src="../resources/images/fOK.png" ' + display + ' />' +
					'</td>');
		
		$("#fokarium > table > tbody > tr[name='" + name + "']")
			.append('<td class="ui-widget-content fOkCounter" style="padding:20px">' + fokCount + '</td>');
	},
	
	insert: function(rowNo, name) {
		db.insert({id: rowNo, humanName: name, fokCount: 0});
		this.save();
	},
	
	update: function(rowNo) {
		var fokCount = db({id: rowNo}).first().fokCount + 1;
		db({id: rowNo}).update({fokCount: fokCount});
		this.save();
	},
	
	save: function() {
		$.removeCookie("fokarium");
		$.cookie("fokarium", db().stringify(), {expires: 365});
	},
	
};

