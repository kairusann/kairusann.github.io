//stick it on the page
var viz, workbook;

window.onload= function() {
	var vizDiv = document.getElementById('tableau');
	var vizURL = "http://public.tableau.com/views/FederalSpending_0/FederalBudget";
	var options = {
		width: '320px',
		height: '675px',
		hideToolbar: true,
		hideTabs: true,
		onFirstInteractive: function () {
			workbook = viz.getWorkbook();
			document.getElementById('sheetName').innerHTML = viz.getWorkbook().getActiveSheet().getName();
		}
	};
	viz = new tableauSoftware.Viz(vizDiv, vizURL, options);
	viz.addEventListener('tabswitch', function(event) {
		document.getElementById('sheetName').innerHTML = event.getNewSheetName();
	});
	viz.addEventListener('marksselection', onMarksSelection);
};

//get selected marks
function onMarksSelection(marksEvent) {
  return marksEvent.getMarksAsync().then(selectFunc);
}

//filter data
function showOnly(filterName, values) {
	sheet = viz.getWorkbook().getActiveSheet();
	if(sheet.getSheetType() === 'worksheet') {
		sheet.applyFilterAsync(filterName, values, 'REPLACE');
		console.log("filtered");
	} else {
		worksheetArray = sheet.getWorksheets();
		for(var i = 0; i < worksheetArray.length; i++) {
			worksheetArray[i].applyFilterAsync(filterName, values, 'REPLACE');
		}
		console.log("filtered");
	}
}

//clear filter
function clearFilter(filterName) {
	sheet = viz.getWorkbook().getActiveSheet();
	if(sheet.getSheetType() === 'worksheet') {
		sheet.clearFilterAsync(filterName);
	} else {
		worksheetArray = sheet.getWorksheets();
		for(var i = 0; i < worksheetArray.length; i++) {
			worksheetArray[i].clearFilterAsync(filterName);
		}
	}
}

//set parameter for fed, agency, burueau
function setParameter(name,value) {
	workbook.changeParameterValueAsync(name,value);
	console.log("param set");
}

function setAndFilter(filterName,values,name,value) {
	setParameter(name,value).then(
	showOnly(filterName, values)
	);
	console.log("param set");
}
