/*** 
JSON To CSV Converter
***/
function export2csv(JSONData, ShowLabel) {
	//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
	var CSV = '';
	//Set Report title in first row or line
	//This condition will generate the Label/Header
	if (ShowLabel) {
		var row = "";
		//This loop will extract the label from 1st index of on array
		for (var index in arrData[0]) {
			if(index!='UserName1')
			//Now convert each value to string and comma-seprated
			row += index + ',';
		}
		row = row.slice(0, -1);
		//append Label row with line break
		CSV += row + '\r\n';
	}
	//1st loop is to extract each row
	for (var i = 0; i < arrData.length; i++) {
		var row = "";
		//2nd loop will extract each column and convert it in string comma-seprated
		for (var index in arrData[i]) {
			if (index != 'UserName1')
			row += '"' + arrData[i][index] + '",';
		}
		row.slice(0, row.length - 1);
		//add a line break after each row
		CSV += row + '\r\n';
	}
	if (CSV == '') {
		alert("Invalid data");
		return;
	}

	csv_blob = new Blob([CSV], { type: 'text/csv' }); //new way as anchor tag download not supported in latest chrome so use Blob
}

/*** 
Force Download
***/
function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || 'unknown';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}

/***
Explicitly Set CSS Style
***/

function explicitlySetStyle(element) {
  d3.select("body").append("svg").attr("id","emptysvg").attr("height",1).attr("width",1).style({"height": "1px", "width": "1px"});
  var emptySvgDeclarationComputed = getComputedStyle($('#emptysvg')[0]);
  var cSSStyleDeclarationComputed = getComputedStyle(element);
  var i, len, key, value;
  var computedStyleStr = "";
  for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
    key = cSSStyleDeclarationComputed[i];
    value = cSSStyleDeclarationComputed.getPropertyValue(key);
    if (value !== emptySvgDeclarationComputed.getPropertyValue(key)) {
	  if (key !== "height" && key !== "width" && key !== "marker-end") {
        computedStyleStr += key + ":" + value + ";";
	  }
    }
  }
  element.setAttribute('style', computedStyleStr);
  //element.removeAttribute('class');
  $("#emptysvg").remove();
}

function SVG2Canvas(targetElement, scale) {
    $("svg").find("*").each(function(){explicitlySetStyle(this)});
    $("svg").each(function(){explicitlySetStyle(this)});
    scale = scale || 1;
    $(targetElement).find('svg').each(function() {
        var canvas, xml, e_width, e_height, newWidth, newHeight;
        canvas = document.createElement("canvas");
        canvas.className = "screenShotTempCanvas";
        //convert SVG into a XML string
        xml = (new XMLSerializer()).serializeToString(this);

        // Removing the name space as IE throws an error
        xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

        //draw the SVG onto a canvas
        e_width = $(this).width(); e_height = $(this).height();
        newWidth = e_width * scale; newHeight = e_height * scale;
        canvg(canvas, xml, {scaleWidth:newWidth,scaleHeight:newHeight}); // {scaleBy: scale}
        $(canvas).insertAfter(this);
        //hide the SVG element
        var thisClass = $(this).attr("class"),
            newClass = thisClass + " tempHide";
        $(this).attr("class", newClass)
        $(this).hide();
      });
}

function SaveAsPNG(targetElement,fileName,scale) {
	//$("svg").find("*").each(function(){explicitlySetStyle(this)});
	//$("svg").each(function(){explicitlySetStyle(this)});
	$(window).scrollTop(0);$(window).scrollLeft(0);
	var scale = scale || 1;
	var useWidth = $(targetElement).innerWidth()*scale, useHeight = $(targetElement).innerHeight()*scale;
	html2canvas($(targetElement), {
		useCORS: true,
		logging: true,
		width: useWidth,
		height: useHeight
	}).then(function(canvas) {
		if (navigator.msSaveBlob) {
			console.log('this is IE');
			var URL = window.URL;
			var BlobBuilder = window.MSBlobBuilder;
			navigator.saveBlob = navigator.msSaveBlob;
			var imgBlob = canvas.msToBlob();
			if (BlobBuilder && navigator.saveBlob) {
				var showSave = function(data, name, mimetype) {
				var builder = new BlobBuilder();
				builder.append(data);
				var blob = builder.getBlob(mimetype || "application/octet-stream");
				if (!name) name = "Download.bin";
				navigator.saveBlob(blob, name);
			};
			showSave(imgBlob, fileName, "image/png");
		  }
		} else {
			if ($('#export-image-container').length == 0) $('body').append('<a id="export-image-container" download='+fileName+'>')
			img = canvas.toDataURL("image/png")
			img = img.replace('data:image/png;base64,', '')
			finalImageSrc = 'data:image/png;base64,' + img

			$('#export-image-container').attr('href', finalImageSrc)
			$('#export-image-container')[0].click()
			$('#export-image-container').remove()
		}
	});

	$(targetElement).find('.screenShotTempCanvas').remove();
    $(targetElement).find('.tempHide').show().attr("class", function() {
		var thisClass = $(this).attr("class"),
			newClass = thisClass.replace("tempHide","").trim();
		return newClass;
	});
	// $("svg").each(function(){$(this).removeAttr("style")});
	// $("svg").find("g").each(function(){$(this).removeAttr("style")});
    if ( currentView == "condition" ) { updateHighestConcern(conditionCat,currentAgg); };
    if ( currentView == "condition-si" ) { updateHighestConcernSI(currentAgg,currentIndicator); };
    if ( currentView == "size" ) { updateSizeMap(conditionCat,currentAgg); };
    if ( currentView == "risk" ) { updateRiskView(conditionCat,currentAgg,currentIndicator); };
    $("#modal-spinner").modal("hide")
}