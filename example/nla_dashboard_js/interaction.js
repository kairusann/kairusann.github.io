$(document).ready(function(){
    // Scroll text with overflow
    $(document).on('mouseover','.scroll_on_hover',function() {
        $(this).removeClass("ellipsis");
        var maxscroll = $(this).width();
        var speed = maxscroll * 50;
        $(this).animate({
            scrollLeft: maxscroll + 80
        }, speed, "linear");
    });

    $(document).on('mouseout','.scroll_on_hover',function() {
        $(this).stop();
        $(this).addClass("ellipsis");
        $(this).animate({
            scrollLeft: 0
        }, 'slow');
    });

    
})

/************
*************
OPTION CONTROLLERS
*************
************/
// Highest Concern Controls
$(document).on('click', '#dropdown-view-trend', function () {
    currentView = "condition";
	currentAgg = "National";
	// update chart title
	$("#chart-title").text("Percentage of Lakes in Most Disturbed Condition");
	$("#hc-ar-subtext").text("2012 Estimates and Change from 2007 | ");
	$("#hc-ar-agg").text(currentAgg);
    updateHighestConcern(conditionCat, currentAgg);
	$("#dropdown-aggregation").html(
			'                              ' + 
						currentAgg			 +
			'                              ' + 
			'<span class="caret"></span>'
	);
});


$(document).on('click', '#dropdown-view-size', function () {
    currentView = "size";
	currentAgg = "WSA9 Ecoregions";
	// update chart title
	$("#chart-title").text("Percentage of Lakes in Most Disturbed Condition");
	$("#hc-ar-subtext").text("2012 Estimates | ");
	$("#hc-ar-agg").text(currentAgg);
    updateSizeMap(conditionCat, currentAgg);
	$("#dropdown-aggregation-sizemap").html(
			'                              ' + 
						currentAgg			 +
			'                              ' + 
			'<span class="caret"></span>'
	);
});

$(document).on('click', '#dropdown-view-risk', function () {
    currentView = "risk";
    currentAgg = "National";
	currentIndicator = "Benthic Invertebrates";
	$("#chart-title").text("Estimated Risk to Biota Caused by Stressors");
	$("#hc-ar-subtext").text("In Relation to: Benthic Invertebrates | ");
    $("#hc-ar-agg").text(currentAgg);
    updateRiskView(conditionCat, currentAgg, currentIndicator);
	// update chart title
	$("#dropdown-aggregation-risk").html(
			'                              ' + 
						currentAgg			 +
			'                              ' + 
			'<span class="caret"></span>'
	);
});

$(document).on('click', '#dropdown-ul-aggregation li a', function () {
    
    currentAgg = $(this).text();

    $("#dropdown-aggregation").html(
			'                              ' + 
						currentAgg			 +
			'                              ' + 
			'<span class="caret"></span>'
	);
    $("#hc-ar-agg").text($(this).text());

    if ( currentView == "condition" ) { updateHighestConcern(conditionCat,currentAgg); };
    if ( currentView == "size" ) { updateSizeMap(conditionCat,currentAgg); };
    if ( currentView == "risk" ) { updateRiskView(conditionCat,currentAgg, "Benthic Invertebrates"); };

    // currentAgg = concatAgg.substr(concatAgg.indexOf("--")+2)
	
});


$("#dropdown-ul-show-by li a").on("click", function() {
    currentView = "condition-si";
	var thisText = $(this).text();
	if ( thisText == "Show Data by Subpopulation" ) {
		currentAgg = "WSA9 Ecoregions"
		currentIndicator = "Benthic Invertebrates"
		$("#dropdown-aggregation-si").html('WSA9 Ecoregions<span class="caret"></span>');
		$("#dropdown-indicator-si").html('Benthic Invertebrates<span class="caret"></span>')
		updateHighestConcernSI(currentAgg, currentIndicator);
	} else {
		currentAgg = "National"
		$("#hc-ar-agg").text("National");
		$("#dropdown-aggregation").html('National<span class="caret"></span>');
		updateHighestConcern(conditionCat, currentAgg);
	}
});

// RISK VIEW AGGREGATION FILTER
$(document).on('click', '#dropdown-ul-aggregation-risk li a', function () {

    var risk_filter_subpop = $(this).text(),
        risk_filter_category = "Most Disturbed",
        risk_filter_response = $("#dropdown-response-risk").text().trim();

    $("#dropdown-aggregation-risk").html(
			'                              ' + 
					risk_filter_subpop		 +
			'                              ' + 
			'<span class="caret"></span>'
	);
    $("#hc-ar-agg").text($(this).text());
	currentAgg = risk_filter_subpop;
	currentIndicator = risk_filter_response;
    updateRiskView(risk_filter_category,risk_filter_subpop, risk_filter_response);

});

// RISK VIEW RESPONSE FILTER
$(document).on('click', '#dropdown-ul-response-risk li a', function () {

    var risk_filter_subpop = $("#dropdown-aggregation-risk").text().trim(),
        risk_filter_category = "Most Disturbed",
        risk_filter_response = $(this).text();

    $("#dropdown-response-risk").html(
			'                              ' + 
				risk_filter_response		 +
			'                              ' + 
			'<span class="caret"></span>'
	);
	currentAgg = risk_filter_subpop;
	currentIndicator = risk_filter_response;
    updateRiskView(risk_filter_category,risk_filter_subpop, risk_filter_response);

});

// SIZE MAP TYPE FILTER
$(document).on('click', '#dropdown-ul-aggregation-sizemap li a', function () {

    var sizemap_filter_subpop = $(this).text(),
        sizemap_filter_category = "Highest Concern",
        sizemap_filter_indic = $("#dropdown-indic-sizemap").text().trim();

    $("#dropdown-aggregation-sizemap").html(
			'                              ' + 
				sizemap_filter_subpop		 +
			'                              ' + 
			'<span class="caret"></span>'
	);
    $("#hc-ar-agg").text($(this).text());
	currentAgg = sizemap_filter_subpop;
	currentIndicator = sizemap_filter_indic;
    updateSizeMap(sizemap_filter_category,sizemap_filter_subpop, "(All)");

});

// SINGLE INDICATOR VIEW AGGREGATION FILTER
$(document).on('click', '#dropdown-ul-aggregation-si li a', function () {
    var filter_type = $(this).text(),
        filter_indic = $("#dropdown-indicator-si").text().trim();
    $("#dropdown-aggregation-si").html(
			'                              ' + 
					filter_type				 +
			'                              ' + 
			'<span class="caret"></span>'
	);
    // $("#hc-ar-agg").text(filter_indic);
	currentAgg = filter_type;
	currentIndicator = filter_indic;
    updateHighestConcernSI(filter_type,filter_indic);
});

// SINGLE INDICATOR VIEW INDICATOR FILTER
$(document).on('click', '#dropdown-ul-indicator-si li a', function () {
    var filter_type = $("#dropdown-aggregation-si").text().trim(),
        filter_indic = $(this).text();
    $("#dropdown-indicator-si").html(
			'                              ' + 
					filter_indic			 +
			'                              ' + 
			'<span class="caret"></span>'
	);
	currentAgg = filter_type;
	currentIndicator = filter_indic;
    updateHighestConcernSI(filter_type,filter_indic);
});

// SIZE MAP INDICATOR FILTER
/*$(document).on('click', '#dropdown-ul-indic-sizemap li a', function () {

    var sizemap_filter_subpop = $("#dropdown-type-sizemap").text().trim();
        sizemap_filter_category = "Highest Concern",
        sizemap_filter_indic = $(this).text(),

    $("#dropdown-indic-sizemap").text($(this).text());
    $("#hc-ar-agg").text($(this).text());

    updateSizeMap(sizemap_filter_category,sizemap_filter_subpop, sizemap_filter_indic);

});
*/
/************
*************
BREAKOUT CHART
*************
************/
$("#d3-bullet").on("click", ".icon-breakout", function(){
    currentIndicator = $(this).siblings('.indicator').text();
    currentIndicator = currentIndicator.replace('*','');
    updateBreakOut();
    $('#modal-breakout').modal('show');

    // console.log(currentIndicator);
});

$('#modal-breakout').on('show.bs.modal', function () {
   // console.log('modal');
   $(this).find('.modal-content').css({
          width:'760px', 
          height:'auto', 
          'max-height':'100%'
   });
   $(this).find('.modal-dialog').css({
            width: '760px',
            height:'auto', 
            margin: '150px auto',
            'max-height':'100%'
   });

});


// Breakout Icon Hover
$('.icon-breakout').mouseover(function(){
    console.log($(this));
})
/************
*************
HIGHLIGHTING
*************
************/

$(document).on("click",".title.indicator", function(){
	// Condition and Change Highlighting
	var el = $(this).parent().parent(),
		thisClass = el.attr("class"),
		thisLoc = el.data("loc"),
		bulletClasses = $(".bullet-sub"),
		dimClasses = $(".dim"),
		slopeClasses = $(".slope-sub"),
		rangeClasses = $(".range-sub"),
		sizeClasses = $(".sizemap-sub"),
		RelRiskClasses = $("#d3-bullet-rel-risk .bullet-sub"),
		RelRiskExtClasses = $("#d3-bullet-rel-risk-ext .bullet-sub"),
		AttrRiskClasses = $("#d3-bullet-attr-risk .bullet-sub"),
		AttrRiskExtClasses = $("#d3-bullet-attr-risk-ext .bullet-sub");
		
	if(thisClass.indexOf("dim") < 0 && dimClasses.length > 1) {
		bulletClasses.attr("class","bullet-sub");
		sizeClasses.attr("class","sizemap-sub");
	} else {
		bulletClasses.attr("class","bullet-sub dim");
		sizeClasses.attr("class","sizemap-sub dim");
		el.attr("class",function(index,className){
			return className.split(" ")[0]
		});
	}

	slopeClasses.attr("class",function(){
		if (thisClass.indexOf("dim") < 0 && dimClasses.length > 1) return "slope-sub";
		else {
			var slopeLoc = $(this).data("loc");
			if(thisLoc == slopeLoc) $(this).attr("class","slope-sub");
			else $(this).attr("class","slope-sub dim");
		}
	});
	rangeClasses.attr("class",function(){
		if(thisClass.indexOf("dim") < 0 && dimClasses.length > 1) return "range-sub";
		else {
			var rangeLoc = $(this).data("loc");
			if (thisLoc == rangeLoc) $(this).attr("class","range-sub");
			else $(this).attr("class","range-sub dim");
		}
	});
	RelRiskClasses.attr("class",function(){
		if(thisClass.indexOf("dim") < 0 && dimClasses.length > 1) return "bullet-sub";
		else {
			var bulletLoc = $(this).data("loc");
			if (thisLoc == bulletLoc) $(this).attr("class","bullet-sub");
			else $(this).attr("class","bullet-sub dim");
		}
	});
	RelRiskExtClasses.attr("class",function(){
		if(thisClass.indexOf("dim") < 0 && dimClasses.length > 1) return "bullet-sub";
		else {
			var bulletLoc = $(this).data("loc");
			if (thisLoc == bulletLoc) $(this).attr("class","bullet-sub");
			else $(this).attr("class","bullet-sub dim");
		}
	});
	AttrRiskClasses.attr("class",function(){
		if(thisClass.indexOf("dim") < 0 && dimClasses.length > 1) return "bullet-sub";
		else {
			var bulletLoc = $(this).data("loc");
			if (thisLoc == bulletLoc) $(this).attr("class","bullet-sub");
			else $(this).attr("class","bullet-sub dim");
		}
	});
	AttrRiskExtClasses.attr("class",function(){
		if(thisClass.indexOf("dim") < 0 && dimClasses.length > 1) return "bullet-sub";
		else {
			var bulletLoc = $(this).data("loc");
			if (thisLoc == bulletLoc) $(this).attr("class","bullet-sub");
			else $(this).attr("class","bullet-sub dim");
		}
	});
});

$('#modal-breakout button').click(function(){
    $(".bullet-sub").attr("class","bullet-sub");
    $(".slope-sub").attr("class","slope-sub");
    $(".range-sub").attr("class","range-sub");
})

/*
$(document).on("click",".title.indicator", function(){

    var el = $(this).parent().parent(),
    thisClass = el.attr("class"),
    thisClasses = thisClass.split(" "),
    thisLoc = el.data("loc"),
    bulletClass = $(".bullet-sub"), 
	RelRiskClass = $("#d3-bullet-rel-risk .bullet-sub"),
	AttrRiskClass = $("#d3-bullet-attr-risk .bullet-sub"),
    slopeClass = $(".slope-sub"),
    rangeClass = $(".range-sub");
    switchCount = 0;

    bulletClass.attr("class",function(index, classNames) {
        var classes = classNames.split(" ");
        // console.log(classes);

        // If no dim and no highlight, highlight this, dim all others 
        if ( (classes.indexOf("dim") < 0) && ( classes.indexOf("highlight") < 0 ) ) {  
            el.attr("class",'bullet-sub highlight');
            return classNames + ' dim';
        } 
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            el.attr("class",'bullet-sub dim');
        } 
        else {
            el.attr("class",'bullet-sub highlight');
        }

        if ( classes.indexOf("highlight") > -1 ) {
            switchCount ++;
        }

        //if ( switchCount == 0 ) {
        //        return "bullet-sub";
        //    }
    });

    slopeClass.attr("class",function(index, classNames) {
        var slopeClasses = classNames.split(" "),
            thisClasses = thisClass.split(" "),
            slopeLoc = $(this).data("loc");

            // console.log("Slope Classes",slopeClasses);

        if ( ( thisClasses.indexOf("dim") < 0 ) && ( thisClasses.indexOf("highlight") < 0 ) ) { 
            $(this).attr("class",'slope-sub dim'); 
            if ( thisLoc == slopeLoc ) {  
                $(this).attr("class",'slope-sub highlight');   
            } 
        }
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            if ( thisLoc == slopeLoc ) {  
                $(this).attr("class",'slope-sub dim');
            } 
        } 
        else {
            if ( thisLoc == slopeLoc ) {  
                $(this).attr("class",'slope-sub highlight');
            } 
        }
    })

    rangeClass.attr("class",function(index, classNames) {
        var rangeClasses = classNames.split(" "),
            thisClasses = thisClass.split(" "),
            rangeLoc = $(this).data("loc");

            // console.log("Range Classes",rangeClasses);

        if ( ( thisClasses.indexOf("dim") < 0 ) && ( thisClasses.indexOf("highlight") < 0 ) ) { 
            $(this).attr("class",'range-sub dim'); 
            if ( thisLoc == rangeLoc ) {  
                $(this).attr("class",'range-sub highlight');   
            } 
        }
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            if ( thisLoc == rangeLoc ) {  
                $(this).attr("class",'range-sub dim');
            } 
        } 
        else {
            if ( thisLoc == rangeLoc ) {  
                $(this).attr("class",'range-sub highlight');
            } 
        }
    })

	RelRiskClass.attr("class",function(index, classNames) {
        var bulletClasses = classNames.split(" "),
            thisClasses = thisClass.split(" "),
            bulletLoc = $(this).data("loc");

        if ( ( thisClasses.indexOf("dim") < 0 ) && ( thisClasses.indexOf("highlight") < 0 ) ) { 
            $(this).attr("class",'bullet-sub dim'); 
			switchCount --;
            if ( thisLoc == bulletLoc ) {  
                $(this).attr("class",'bullet-sub highlight');
				switchCount ++;
            } 
        }
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            if ( thisLoc == bulletLoc ) {  
                $(this).attr("class",'bullet-sub dim');
				switchCount --;
            } 
        } 
        else {
            if ( thisLoc == bulletLoc ) {  
                $(this).attr("class",'bullet-sub highlight');
				switchCount ++;
            } 
        }
    })

	AttrRiskClass.attr("class",function(index, classNames) {
        var bulletClasses = classNames.split(" "),
            thisClasses = thisClass.split(" "),
            bulletLoc = $(this).data("loc");

        if ( ( thisClasses.indexOf("dim") < 0 ) && ( thisClasses.indexOf("highlight") < 0 ) ) { 
            $(this).attr("class",'bullet-sub dim'); 
			switchCount --;
            if ( thisLoc == bulletLoc ) {  
                $(this).attr("class",'bullet-sub highlight');
				switchCount ++;
            } 
        }
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            if ( thisLoc == bulletLoc ) {  
                $(this).attr("class",'bullet-sub dim');
				switchCount --;
            } 
        } 
        else {
            if ( thisLoc == bulletLoc ) {  
                $(this).attr("class",'bullet-sub highlight');
				switchCount ++;
            } 
        }
    })

    // If all highlights are turned off (switchCount == 0), reset all classes to default
    if ( switchCount == 0 ) {
        bulletClass.attr("class",function(index, classNames) {
            return "bullet-sub";
        })
        slopeClass.attr("class",function(index, classNames) {
            return "slope-sub";
        })
        rangeClass.attr("class",function(index, classNames) {
            return "range-sub";
		}) 
		RelRiskClass.attr("class",function(index, classNames) {
            return "bullet-sub";
        })
		AttrRiskClass.attr("class",function(index, classNames) {
            return "bullet-sub";
        })
    }
})

// SIZE MAP HIGHLIGHTING
$(document).on("click",".sizemap-sub", function(){
    var el = $(this),
    thisClass = el.attr("class"),
    thisClasses = thisClass.split(" "),
    thisLoc = el.data("loc"),
    sizemapClass = $(".sizemap-sub"), 
    switchCount = 0;

    sizemapClass.attr("class",function(index, classNames) {
        var classes = classNames.split(" ");

        // If no dim and no highlight, highlight this, dim all others 
        if ( (classes.indexOf("dim") < 0) && ( classes.indexOf("highlight") < 0 ) ) {  
            el.attr("class",'sizemap-sub highlight');
            return classNames + ' dim';
        } 
        else if ( thisClasses.indexOf("highlight") > -1 ) {
            el.attr("class",'sizemap-sub dim');
        } 
        else {
            el.attr("class",'sizemap-sub highlight');
        }

        if ( classes.indexOf("highlight") > -1 ) {
            switchCount ++;
        }
    });

    // If all highlights are turned off (switchCount == 0), reset all classes to default
    if ( switchCount == 0 ) {
        sizemapClass.attr("class",function(index, classNames) {
            return "sizemap-sub";
        })
    };
});
*/

/************
*************
MOBILE TOOTIP HELPER
*************
************/
$(document).on("click","body", function(){
    $(".d3-tip").css("opacity","0")
});

/*var toggleChartViewStart = function(chartId) {
        $(".spinner").addClass("in").removeClass("hidden");
        $(".tab-pane").removeClass("active");
        $(chartId).addClass("active").removeClass("hidden fade");        
        $("#chart-header").addClass("hidden");
        $("#chart-header-map").addClass("hidden");
        $(chartId + " #controls").addClass("hidden");
        $("#chart-" + chartId).addClass("hidden");
    }

var toggleChartViewEnd = function(chartId) {
        $(".spinner").removeClass("in").addClass("hidden");
        $("#chart-header").removeClass("hidden").addClass("in");
        $("#chart-header-map").removeClass("hidden");
        $(chartId + " #controls").removeClass("hidden");
        $("#chart-" + chartId).removeClass("hidden");
    }*/

/************
*************
PRESENTATION CONTROLLERS
*************
************/

//Toggle bullet label visibility
/*$("#button-toggle-labels").on("click", function(el){
  var toggleBut = $("#button-toggle-labels"),
      labels = $(".label-ul-bounds text");
  
  if(!toggleBut.hasClass("toggle-on")){
    toggleBut.addClass("toggle-on")
    $(labels).attr("class","active");
  } else if(toggleBut.hasClass("toggle-on")) {
    toggleBut.removeClass("toggle-on")
    $(labels).attr("class","inactive");
  }
})*/
$(document).on('click', '#dropdown-ul-label li a', function () {
	var thisText = $(this).text().trim(),
		CI_labels = $(".label-ul-bounds text:nth-child(1)"),
		Est_labels = $(".label-ul-bounds text:nth-child(2)");

	if(thisText == "Confidence Intervals") {
		$(Est_labels).attr("class","inactive");
		$(CI_labels).attr("class","active");
	} 
	
	if (thisText == "Point Estimate") {
		$(CI_labels).attr("class","inactive");
		$(Est_labels).attr("class","active");
	} 

	if (thisText == "None") {
		$(CI_labels).attr("class","inactive");
		$(Est_labels).attr("class","inactive");
	}

    $("#dropdown-label").html(
			'                              ' + 
					thisText		 		 +
			'                              ' + 
			'<span class="caret"></span>'
	);

});


$(document).on('click', '#dropdown-ul-label-si li a', function () {
	var thisText = $(this).text().trim(),
		CI_labels = $(".label-ul-bounds text:nth-child(1)"),
		Est_labels = $(".label-ul-bounds text:nth-child(2)");

	if(thisText == "Confidence Intervals") {
		$(Est_labels).attr("class","inactive");
		$(CI_labels).attr("class","active");
	} 
	
	if (thisText == "Point Estimate") {
		$(CI_labels).attr("class","inactive");
		$(Est_labels).attr("class","active");
	} 

	if (thisText == "None") {
		$(CI_labels).attr("class","inactive");
		$(Est_labels).attr("class","inactive");
	}

    $("#dropdown-label-si").html(
			'                              ' + 
					thisText		 		 +
			'                              ' + 
			'<span class="caret"></span>'
	);

});

$(document).on('click', '#dropdown-ul-label-risk li a', function () {
	var thisText = $(this).text().trim();
		//CI_labels = $(".label-ul-bounds text:nth-child(1)"),
		//Est_labels = $(".label-ul-bounds text:nth-child(2)");

	if(thisText == "Confidence Intervals") {
		relextentheight     = 45 - relextentmargin.top - relextentmargin.bottom;
		relriskheight       = 45 - relriskmargin.top - relriskmargin.bottom;
		attrriskheight      = 45 - attrriskmargin.top - attrriskmargin.bottom;
	} 
	
	if (thisText == "Point Estimate") {
		relextentheight     = 45 - relextentmargin.top - relextentmargin.bottom;
		relriskheight       = 45 - relriskmargin.top - relriskmargin.bottom;
		attrriskheight      = 45 - attrriskmargin.top - attrriskmargin.bottom;
	} 

	if (thisText == "None") {
		relextentheight     = 30 - relextentmargin.top - relextentmargin.bottom;
		relriskheight       = 30 - relriskmargin.top - relriskmargin.bottom;
		attrriskheight      = 30 - attrriskmargin.top - attrriskmargin.bottom;
	}

    $("#dropdown-label-risk").html(
			'                              ' + 
					thisText		 		 +
			'                              ' + 
			'<span class="caret"></span>'
	);
	
	updateRiskView(conditionCat, currentAgg, currentIndicator);

});

/************
*************
FOOTER ICON CONTROLLERS
*************
************/

$("#icons img:nth-of-type(1)").on("click", function() {
	$("#modal-spinner").modal("show")
	SVG2Canvas(".chart-container");
	setTimeout(function(){SaveAsPNG(".chart-container",currentView + ".png");},1000);
	// $("#modal-spinner").modal("hide")
});

$("#modal-icons img:nth-of-type(1)").on("click", function() {
	SVG2Canvas("#modal-breakout");
	SaveAsPNG("#modal-breakout .modal-content","breakout.png");
	updateBreakOut();
});

// Temporarily removal of print icon 
$("#icons img:nth-of-type(2),#modal-icons img:nth-of-type(2)").attr("class","hidden");

$("#icons img:nth-of-type(3)").on("click", function() {
	export2csv(main_data,true);
	saveAs(csv_blob,currentAgg+"_"+currentView+".csv");
});

$("#modal-icons img:nth-of-type(3)").on("click", function() {
	export2csv(breakout_data,true);
	saveAs(csv_blob,currentIndicator+"_"+currentView+".csv");
});

$("#icons img:nth-of-type(4)").on("click", function() {
	// SaveToDisk("doc/Help files_"+currentView+".pdf","Help files_"+currentView+".pdf")
	window.open("doc/"+currentView+"_-_How_to_interpret.svg");
});

$("#modal-icons img:nth-of-type(4)").on("click", function() {
	// SaveToDisk("doc/Help files_"+currentView+".pdf","Help files_"+currentView+".pdf")
	window.open("doc/breakout_-_How_to_interpret.svg");
});