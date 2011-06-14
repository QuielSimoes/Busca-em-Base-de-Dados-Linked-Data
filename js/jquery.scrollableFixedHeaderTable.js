// Author: Jerome Clyde C. Bulanadi

jQuery.fn.scrollableFixedHeaderTable = scrollableFixedHeaderTable;

sfht = {};
function scrollableFixedHeaderTable(widthpx, heightpx, showSelect,cookie) {
	/* table initialization */
	if (!$(this).hasClass('scrollableFixedHeaderTable'))
		return;
	var $this = $(this);
	
	$this.wrap('<div style="text-align: left"></div>');
	$this.parent().before('<div class="noDivBounds"><div class="sfhtColumnSelectButton_unPressed" title="Select Columns"></div><div class="sfhtColumnSelect"></div></div>')
	
	var $parentDiv = $this.parent();
	var $clone = $parentDiv.clone();
	
	$clone.find('tr:gt(0)').remove();
	
	var $fixedHeaderHtml = $clone.html();
	var $srcTableHtml = $parentDiv.html();
	
	$this.before('<table cellspacing="0" cellpadding="0" class="sfhtTable"><tr><td><div class="sfhtHeader"></div></td></tr><tr><td><div class="sfhtData"></div></td></tr></table>');
	$parentDiv.find('div:nth(0)').html($fixedHeaderHtml);
	$parentDiv.find('div:nth(1)').html($srcTableHtml);
	
	var headerId = $this.attr('id') + '_header';
	var $sfhtHeader = $parentDiv.find('.sfhtHeader');
	var $sfhtTable = $sfhtHeader.find('table').attr('id', headerId);
	
	$this.remove();
	$clone.remove();
	
	var $sfhtData = $parentDiv.find('.sfhtData');
	$sfhtData.height(heightpx).width(widthpx);
	var $mainTable = $sfhtData.find('table');
	var mainTableId = $mainTable.attr('id');
	
	/* synchronized scrolling */
	$sfhtData.scroll(function() {
		$sfhtHeader.scrollLeft($(this).scrollLeft());
	});
	
	/* adjustments */
	sfht.adjustTables($sfhtTable, $mainTable);
	sfht.adjustHeader($sfhtHeader, $sfhtData, $mainTable);
	
	if (!showSelect) {
		$parentDiv.prev().remove();
		return;
	}
	
	/* column select check boxes */
	$parentDiv.prev().find('div:nth(0)').attr('id', mainTableId + '_columnSelectButton');
	$parentDiv.prev().find('div:nth(1)').attr('id', mainTableId + '_columnSelect');
	
	
	sfht.loadColumnSelect($(sfht.getColumnSelect(mainTableId)), $sfhtHeader, mainTableId, $sfhtData, $mainTable, cookie);
	
	var $columnSelect = sfht.getColumnSelect(mainTableId);
	var $columnSelectButton = sfht.getSelectButton(mainTableId);
	
	$columnSelectButton.toggle(function() {
		$columnSelect.show(250);
		$columnSelectButton.attr('class','sfhtColumnSelectButton_Pressed');
		}, function() {
			$columnSelect.hide(250);
			$columnSelectButton.attr('class','sfhtColumnSelectButton_unPressed');
	});	
	
	$columnSelect.hide();
	
	/* cookie */
	if (cookie == null || cookie == '') {
		return;
	}
	var cSize = $sfhtHeader.find('td, th').length;
	if (cSize == 0) {
		return;
	}
	
	var storedCookie = $.cookie(cookie);
	if (storedCookie) {
		// synch the size
		storedCookie = storedCookie.substring(0, cSize);
		for (var index = 0; index < cSize; index++) {
			var indexState = parseInt(storedCookie.charAt(index));
			if (indexState != 1) {
				sfht.hideColumn(mainTableId, index);
				$columnSelect.find('input:nth(' + index + ')').removeAttr('checked');
			}
		}
	} else { // make new cookie
		var initState = sfht.fillState(cSize);
		$.cookie(cookie, initState);
	}
}

sfht.loadColumnSelect = function ($container, $sfhtHeader, mainTableId, $sfhtData, $mainTable, cookie) {
	var myInnerHtml = "<ul>";
	$sfhtHeader.find('td, th').each(function(index) {
		myInnerHtml += '<li><input type="checkbox" class="columnCheck" checked="checked">' + $(this).text() + '</input></li>';
	});
	myInnerHtml += '</ul>';
	$container.html(myInnerHtml);
	$container.find('.columnCheck').each(function(index) {
		var $this = $(this);
		$this.click(function() {
			var checked = $this.attr('checked');
			if (!checked) {
				sfht.hideColumn(mainTableId, index);
				if (cookie != null && cookie != '') {
					var cookieStr = $.cookie(cookie);
					cookieStr = replaceOneChar(cookieStr, '0', index + 1);
					$.cookie(cookie, cookieStr);
				} 
			} else {
				sfht.showColumn(mainTableId, index);
				if (cookie != null && cookie != '') {
					var cookieStr = $.cookie(cookie);
					cookieStr = replaceOneChar(cookieStr, '1', index + 1);
					$.cookie(cookie, cookieStr);
				} 
			}
			sfht.adjustHeader($sfhtHeader, $sfhtData, $mainTable);
		});
	});
}

sfht.hideColumn = function(id, index) {
	var $mainTable = $('table[id=' + id + "]");
	var $headerTable = sfht.getFixedHeader(id);
	$mainTable.find('tr').each(function() {
		//$(this).find('td:nth(' + index + ')').hide();
		$($(this).find('td,th')[index]).hide();
	});
	$headerTable.find('tr').each(function() {
		//$(this).find('td:nth(' + index + ')').hide();
		$($(this).find('td,th')[index]).hide();
	});
	var jqKey = sfht.getSfhtVar(id);
	var lastWidth = sfht[jqKey]['lastWidth'];
	var indexWidth = sfht[jqKey]['tdWidths'][index];
	lastWidth -= indexWidth;
	sfht[jqKey]['lastWidth'] = lastWidth;
	$mainTable.width(lastWidth);
	$headerTable.width(lastWidth);
}

sfht.showColumn = function (id, index) {
	var $mainTable = $('table[id=' + id + "]");
	var $headerTable = sfht.getFixedHeader(id);
	$mainTable.find('tr').each(function() {
		//$(this).find('td:nth(' + index + ')').show();
		$($(this).find('td,th')[index]).show();
	});
	$headerTable.find('tr').each(function() {
		//$(this).find('td:nth(' + index + ')').show();
		$($(this).find('td,th')[index]).show();
	});
	var jqKey = sfht.getSfhtVar(id);
	var lastWidth = sfht[jqKey]['lastWidth'];
	var indexWidth = sfht[jqKey]['tdWidths'][index];
	lastWidth += indexWidth;
	sfht[jqKey]['lastWidth'] = lastWidth;
	$mainTable.width(lastWidth);
	$headerTable.width(lastWidth);
}

sfht.adjustHeader = function($sfhtHeader, $sfhtData, $mainTable) {
	var containerWidth = $sfhtData.width();
	var containerInnerWidth = $sfhtData.innerWidth();
	var scrollBarSize = containerWidth - containerInnerWidth;
	var dataTableWidth = $mainTable.width();

	if (!($.browser.mozilla || $.browser.msie || $.browser.opera)) {
		containerInnerWidth = dataTableWidth >= containerWidth ? containerWidth - 17 : containerWidth;
	}

	if (dataTableWidth >= containerInnerWidth) {
		$sfhtHeader.width(containerInnerWidth);
	} else {
		$sfhtHeader.width(dataTableWidth);
	}
}


sfht.adjustTables = function($sfhtTable, $mainTable) {
	var tdWidthArr = new Array();
	var adjTableWidth = 0;

	var totalWidth = 0;
	var idAdjWidth = sfht.getSfhtVar($mainTable.attr('id'));

	//var id = '#' + $mainTable.attr('id'); // IE compatibility
	var id = $mainTable.attr('id');
	//var queryStr = id + ' tr:nth(0) td';
	var idPrefix = 'table[id=' + id + '] tr:nth(0)';
	$(idPrefix).find('td, th').each(function(index) {
		var $this = $(this);
		var actualWidth = parseInt($this.width());
		var attrWidth = parseInt($this.attr('width'));
		var plusWidth = attrWidth > actualWidth ? attrWidth : actualWidth;
		totalWidth += plusWidth;
		tdWidthArr[index] = plusWidth;
		$this.width(plusWidth);
		$sfhtTable.find('td:nth(' + index + '), th:nth(' + index + ')').width(plusWidth);
	});
	
	adjTableWidth = totalWidth;
	// $sfhtTable.width(totalWidth);
	// $mainTable.width(totalWidth);
	
	/* Register this variable to sfht globals */
	sfht[idAdjWidth] = {'lastWidth': adjTableWidth, 'tdWidths': tdWidthArr};
}

sfht.getSfhtVar = function(id) {
	return id + 'Widths';
}

sfht.getSelectButton = function(id) {
	return($('div[id=' + id + '_columnSelectButton]'));
}

sfht.getColumnSelect = function(id) {
	var selector = '';
	return($('div[id=' + id + '_columnSelect]'));
}

sfht.getFixedHeader = function(id) {
	return ($('table[id=' + id + '_header]'));
}

sfht.fillState = function (i) {
	  if (i == 0) {
	    return;
	}
	state = '';
	for (var x = 0; x < i; x++) {
	    state += '1';
	}
	return state ;
}

function replaceOneChar(s,c,n){
	var re = new RegExp('^(.{'+ --n +'}).(.*)$','');
	return s.replace(re,'$1'+c+'$2');
};
