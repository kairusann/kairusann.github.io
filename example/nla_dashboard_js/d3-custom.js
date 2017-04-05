var toggleChartViewStart = function(chartId) {
        $("#chart-header").addClass("hidden").removeClass("in");
        $("#chart-" + chartId).addClass("hidden");
        $("#controls").addClass("hidden");
        $(".chart-container .spinner").addClass("in").removeClass("hidden");
        $(".tab-pane").removeClass("in active");
        $("#"+chartId).addClass("in active").removeClass("hidden"); 
}

var toggleChartViewEnd = function(chartId) {
        $(".chart-container .spinner").removeClass("in").addClass("hidden");
        $("#chart-" + chartId).removeClass("hidden");
        $("#chart-header").removeClass("hidden").addClass("in");
        $("#controls").removeClass("hidden");
}

/************
*************
DATA SOURCES
*************
************/
var NLA12_Condition_Estimates		= "data/NLA_Condition_Estimates.csv",
    NLA0712_Change_Estimates		= "data/NLA_Change_Estimates.csv",
    NLA12_Risk_Estimates     		= "data/NLA_Risk_Estimates.csv";


/************
*************
ALIASES - NLA12_Condition_Estimates
*************
************/
var nla12_ce_record     = "Record",
    nla12_ce_indic      = "Indicator",
    nla12_ce_indic_plain= "Indicator (Plain Language)",
    nla12_ce_metsubcat  = "Metric subcategory",
    nla12_ce_metcat     = "Metric Category",
    nla12_ce_type       = "Type",
    nla12_ce_subpop     = "Subpopulation",
    nla12_ce_subpopl    = "Subpopulation (Plain Language)",
    nla12_ce_agg        = "Aggregation",
    nla12_ce_cat        = "Condition Class Categorization",
    // nla12_ce_padnull    = "Pad Null Row for Change?",
    nla12_ce_estp       = "Estimate.P",
	nla12_ce_estu       = "Estimate.U",
    nla12_ce_lcb95pctp  = "LCB95Pct.P",
    nla12_ce_ucb95pctp  = "UCB95Pct.P",
	nla12_ce_lcb95pctu	= "LCB95Pct.U",
	nla12_ce_ucb95pctu	= "UCB95Pct.U",
    // nla12_ce_nresp      = "NResp",
    nla12_ce_confinv    = "Confidence Interval (Point in Time)",
    nla12_ce_nestp      = "National Estimate.P",
    nla12_ce_nlb        = "National LB Ref Range",
    nla12_ce_nub        = "National UB Ref Range",
	nla12_ce_nlbu       = "National LB Ref Range.U",
	nla12_ce_nubu       = "National UB Ref Range.U";

/************
*************
ALIASES - NLA0712_Change_Estimates
*************
************/
var nla0712_ce_record       = "Record",
    nla0712_ce_indic        = "Indicator",
    nla0712_ce_indic_plain  = "Indicator (Plain Language)",
    nla0712_ce_metsubcat    = "Metric subcategory",
    nla0712_ce_metcat       = "Metric Category",
    nla0712_ce_type         = "Type",
    nla0712_ce_subpop       = "Subpopulation",
    nla0712_ce_subpopl      = "Subpopulation (Plain Language)",
    nla0712_ce_agg          = "Aggregation",
    nla0712_ce_cat          = "Condition Class Categorization",
    nla0712_ce_sig          = "Significantly Different (95% CL)",
    nla0712_ce_diffestp     = "DiffEst.P",
    nla0712_ce_difflcb95pctp = "Diff.LCB95Pct.P",
    nla0712_ce_diffucb95pctp = "Diff.UCB95Pct.P",
    nla0712_ce_diffcilenp   = "Difference CI Length.P",
    nla0712_ce_estp1        = "Estimate.P 1",
    nla0712_ce_estp2        = "Estimate.P 2";
    // nla0712_ce_nresp1       = "NResp 1",
    // nla0712_ce_nresp2       = "NResp 2",
    // nla0712_ce_nresp        = "N Resp";

/************
*************
ALIASES - NLA12_Relative_Risk_Estimates
*************
************/

var nla12_rel_risk_type               = "Type",
    nla12_rel_risk_subpop		      = "Subpopulation",
	nla12_rel_risk_subpop_plain		  = "Subpopulation (Plain Language)",
    nla12_rel_risk_response           = "Response",
    nla12_rel_risk_response_plain     = "Response (Plain Language)",
    nla12_rel_risk_stressor           = "Stressor",
    nla12_rel_risk_stressor_plain     = "Stressor (Plain Language)",
    nla12_rel_risk_metric_category    = "Metric Category",
    // nla12_rel_risk_nresp              = "NResp",
    nla12_rel_risk_estimate           = "Estimate.R",
    nla12_rel_risk_lcb95pct           = "LCB95Pct.R",
    nla12_rel_risk_ucb95pct           = "UCB95Pct.R";


/************
*************
ALIASES - NLA12_Attributable_Risk_Estimates
*************
************/    

var nla12_attr_risk_type               = "Type",
    nla12_attr_risk_subpop			   = "Subpopulation",
	nla12_attr_risk_subpop_plain	   = "Subpopulation (Plain Language)",
    nla12_attr_risk_response           = "Response",
    nla12_attr_risk_response_plain     = "Response (Plain Language)",
    nla12_attr_risk_stressor           = "Stressor",
    nla12_attr_risk_stressor_plain     = "Stressor (Plain Language)",
    nla12_attr_risk_metric_category    = "Metric Category",
    // nla12_attr_risk_nresp              = "NResp",
    nla12_attr_risk_estimate           = "Estimate.A",
    nla12_attr_risk_lcb95pct           = "LCB95Pct.A",
    nla12_attr_risk_ucb95pct           = "UCB95Pct.A";


/************
*************
ALIASES - Condition Class Categories
*************
************/
var ccc_grp     = "Indicator and Category (group)",
    ccc_ind_cat = "Indicator and Category",
    ccc_cat     = "Condition Class Cateogorization";

/************
*************
DATA - Store data in RAM 
*************
************/
/*
// Acquire condition classifications
d3.csv(NLA12_Condition_Estimates, function(error, data) {
	cond_est_data = data;
});
d3.csv(NLA0712_Change_Estimates, function(error, data) {
	change_est_data = data;
});
*/

// Define default chart filters (updateHighestConcern)
var conditionCat = "Most Disturbed",
    arr_type_subpop = "National"

// Define initial chart filters (size map)
var sizemap_filter_category = "Most Disturbed",
    sizemap_filter_subpop = "National";
    // sizemap_filter_indic = ["(All)"];

// Stores value of current dashboard view
var currentView;

/*
// Define initial chart filters (risk estimates)
var risk_filter_category = "Highest Concern",
    risk_filter_subpop = "WSA9_Ecoregions";
*/

/************
*************
DIMENSION CONTROLLERS
*************
************/

    //BULLET DIMENISIONS
var bulletmargin        = { top: 0, right: 40, bottom: 0, left: 240 },
    bulletcontainer     = 460,
    bulletwidth         = 460 - bulletmargin.left - bulletmargin.right,
    bulletheight        = 30 - bulletmargin.top - bulletmargin.bottom,
    //SLOPE DIMENISIONS
    slopemargin         = {top: 4, right: 5, bottom: 4, left: 5},
    slopecontainer      = 50,    
    slopewidth          = 50 - slopemargin.left - slopemargin.right,
    slopeheight         = 30 - slopemargin.top - slopemargin.bottom,
    //RANGE DIMENISIONS
    rangemargin         = { top: 0, right: 15, bottom: 0, left: 15 },
    rangecontainer      = 255,
    rangewidth          = 255 - rangemargin.left - rangemargin.right,
    rangeheight         = 30 - rangemargin.top - rangemargin.bottom,
    //BULLETSI DIMENISIONS
	bulletmarginSI      = { top: 0, right: 50, bottom: 0, left: 220 },
    bulletcontainerSI   = 460,
    bulletwidthSI       = 460 - bulletmargin.left - bulletmargin.right,
    bulletheightSI      = 30 - bulletmargin.top - bulletmargin.bottom,
    //RANGESI DIMENISIONS
    rangemarginSI         = { top: 0, right: 15, bottom: 0, left: 15 },
    rangecontainerSI      = 265,
    rangewidthSI          = 265 - rangemargin.left - rangemargin.right,
    rangeheightSI         = 30 - rangemargin.top - rangemargin.bottom,
    //BULLETB DIMENISIONS
    bulletmarginB        = { top: 0, right: 40, bottom: 0, left: 150 },
    bulletcontainerB     = 370,
    bulletwidthB         = 370 - bulletmarginB.left - bulletmarginB.right,
    bulletheightB        = 30 - bulletmarginB.top - bulletmarginB.bottom,
    //SLOPEB DIMENISIONS
    slopemarginB         = {top: 4, right: 5, bottom: 4, left: 2},
    slopecontainerB      = 50,    
    slopewidthB          = 50 - slopemarginB.left - slopemarginB.right,
    slopeheightB         = 30 - slopemarginB.top - slopemarginB.bottom,
    //RANGEB DIMENISIONS
    rangemarginB         = { top: 0, right: 15, bottom: 0, left: 15 },
    rangecontainerB      = 296,
    rangewidthB          = 296 - rangemarginB.left - rangemarginB.right,
    rangeheightB         = 30 - rangemarginB.top - rangemarginB.bottom,

    //SIZE MAP DIMENSIONS
    sizemapmargin       = { top: 0, right: 0, bottom: 0, left: 0 },
    sizemapcontainer    = 765,
    sizemapwidth        = 765 - sizemapmargin.left - sizemapmargin.right,
    sizemapheight       = 30 - sizemapmargin.top - sizemapmargin.bottom,

    //Risk chart dimensions

    relextentmargin     = { top: 0, right: 30, bottom: 0, left: 215 },
    relextentcontainer  = 370,
    relextentwidth      = 370 - relextentmargin.left - relextentmargin.right,
    relextentheight     = 30 - relextentmargin.top - relextentmargin.bottom,

    relriskmargin       = { top: 0, right: 0, bottom: 0, left: 0 },
    relriskcontainer    = 160,
    relriskwidth        = 160 - relriskmargin.left - relextentmargin.right,
    relriskheight       = 30 - relriskmargin.top - relriskmargin.bottom,

    attrriskmargin      = { top: 0, right: 0, bottom: 0, left: 0 },
    attrriskcontainer   = 160,
    attrriskwidth       = 160 - attrriskmargin.left - attrriskmargin.right,
    attrriskheight      = 30 - attrriskmargin.top - attrriskmargin.bottom;

    bordercushion       = 2;


var chart = d3.charts.chart();

/*************
POPULATE DROPDOWNS
*************/
d3.csv(NLA12_Condition_Estimates, function(error, data) {  

    /*************
    Aggregation DROPDOWNS
    *************/
/*
        // create empty array to store unique dropdown filter value
        arr_type_subpop = [];

        // for each concatenate type and subpop and push to empty array
        data.forEach(function(d){
          // var newAgg = d[nla12_ce_type] + "--" + d[nla12_ce_subpop];
		  var newAgg = d[nla12_ce_subpopl];
          arr_type_subpop.push(newAgg);
        })

        // Filter out unique array values
        arr_type_subpop = $.unique(arr_type_subpop);
*/
		
        // populate the dropdown menu

	/*var arr_subpopl = d3.set(data.map(function(d) { return d[nla12_ce_subpopl]; })).values();
	
	arr_subpopl.sort(d3.ascending);
	console.log(arr_subpopl);
	arr_subpopl.splice(arr_subpopl.indexOf("National"),1);
	arr_subpopl = ["National"].concat(arr_subpopl);*/
	
	var arr_subpopl = ["National", "Coastal Plains", "EPA Region 1", "EPA Region 2", "EPA Region 3", "EPA Region 4", "EPA Region 5", "EPA Region 6", "EPA Region 7", "EPA Region 8", "EPA Region 9", "EPA Region 10", "Eastern Highlands", "Mississippi River Basin", "Natural", "Northern Appalachians", "Northern Plains", "Plains and Lowlands", "Reservoir", "Southern Appalachians", "Southern Plains", "Temperate Plains", "Upper Midwest", "Western Mountains", "Western Region", "Xeric"]
	
	d3.select("#dropdown-ul-aggregation").selectAll("li")
		.data(arr_subpopl)
	  .enter().append("li")
		.attr("role","presentation")
	  .insert("a")
		.attr("role","menuitem")
		.attr("tabindex","-1")
		.attr("href","#")
		.html(function(d){ return d; });

    /*************
    Type DROPDOWNS
    *************/
	var arr_type = d3.set(data.map(function(d) { return d[nla12_ce_type]; })).values();
	// arr_indic.unshift("(All)");
	arr_type = arr_type.filter(function(d){ return d != "National" && d != "Mississippi River Basin"; });
	// populate the type dropdown menu
	arr_type.sort(d3.ascending);

	d3.select("#dropdown-ul-aggregation-sizemap").selectAll("li")
		.data(arr_type)
	  .enter().append("li")
		.attr("role","presentation")
	  .insert("a")
		// .filter(function(d){ return d != "National" && d != "Mississippi River Basin"; })
		.attr("role","menuitem")
		.attr("tabindex","-1")
		.attr("href","#")
		.html(function(d) { return d; });

	/*************
	Single Indicator DROPDOWNS
	*************/

	var arr_type = d3.set(data.map(function(d) { return d[nla12_ce_type]; })).values(),
		arr_indic = d3.set(data.map(function(d) { return d[nla12_ce_indic_plain]; })).values();

	arr_type.sort(d3.ascending);
	arr_type.splice(arr_type.indexOf("National"),1);
	arr_type = ["National"].concat(arr_type);

	arr_indic.sort(d3.ascending);

	// populate the dropdown menu
	d3.select("#dropdown-ul-aggregation-si").selectAll("li")
		.data(arr_type)
		.enter().append("li")
		.attr("role","presentation")
		.insert("a")
		.attr("role","menuitem")
		.attr("tabindex","-1")
		.attr("href","#")
		.html(function(d){ return d; });

	d3.select("#dropdown-ul-indicator-si").selectAll("li")
		.data(arr_indic)
		.enter().append("li")
		.attr("role","presentation")
		.insert("a")
		.attr("role","menuitem")
		.attr("tabindex","-1")
		.attr("href","#")
		.html(function(d){ return d; });

})

/*************
Risk View DROPDOWNS
*************/

d3.csv(NLA12_Risk_Estimates, function(error, data) {

    // var arr_subpopl = d3.set(data.map(function(d) { return d[nla12_rel_risk_subpop_plain]; })).values();
	var arr_subpopl = ["National", "Eastern Highlands", "Mississippi River Basin", "Natural", "Plains and Lowlands", "Reservoir", "Western Region"];
    var arr_response = d3.set(data.map(function(d) { return d[nla12_rel_risk_response_plain]; })).values();

	/*arr_subpopl.sort(d3.ascending);
	arr_subpopl.splice(arr_subpopl.indexOf("National"),1);
	arr_subpopl = ["National"].concat(arr_subpopl);*/

	arr_response.sort(d3.ascending);

	// populate the dropdown menu
	d3.select("#dropdown-ul-aggregation-risk").selectAll("li")
		.data(arr_subpopl)
	  .enter().append("li")
		.attr("role","presentation")
	  .insert("a")
		.attr("role","menuitem")
		.attr("tabindex","-1")
		.attr("href","#")
		.html(function(d){ return d; });

	d3.select("#dropdown-ul-response-risk").selectAll("li")
	  .data(arr_response)
	  .enter().append("li")
	  .attr("role","presentation")
	  .insert("a")
		.attr("role","menuitem")
		.attr("tabindex","-1")
		.attr("href","#")
		.html(function(d){ return d; });
})
    
/************
*************
HIGHEST CONCERN (ANY REGION) CONTROLLERS
*************
************/
function updateHighestConcern(filter_category, filter_subpop) {

    currentView = "condition";

    toggleChartViewStart("container-hc-2012-ar");
	d3.selectAll('svg').remove();
	d3.selectAll('.d3-tip').remove();
	$("#map-container").removeClass("hidden")
	d3.select("#chart-header-text").style("width","615px")
    // Show relevant filters / Hide others
    $("#filters-condition").addClass("in");
	$("#filters-condition-si").removeClass("in");
    $("#filters-sizemap").removeClass("in");
    $("#filters-risk").removeClass("in");
	// Show relevant additional info
	$("#notes").attr("style","height:530px");
	$("#notes #container-additional-info").html(condinfo);

	d3.csv(NLA12_Condition_Estimates, function(error, data) {  //NLA12_Condition_Estimates = "data/NLA12_Condition_Estimates_20141209_KC.csv",

        cond_est_data = data,
            duration = 250;

        /*************
        FILTER DATA
        *************/
        // split the passed argument filter_subpop into separate parts
        // var type = filter_subpop.substring(0,filter_subpop.indexOf("--"));
        // var subpop = filter_subpop.substring(filter_subpop.indexOf("--")+2);
		var subpop = filter_subpop;
        currentAgg = filter_subpop;
        
        // filter the data to match the filter arguments
        /*cond_est_data = cond_est_data.filter(function(d) { 
            // create indicator_category by concatinating indicator and category (eg. 'Acidification_Good')
            var indicator_category = d[nla12_ce_indic] + "_" + d[nla12_ce_cat];
			console.log(indicator_category);
            // if the ind_cat is in the condition category (eg. 'Acidification_Good' is in 'Lowest Concern')
            // 
            if( $.inArray(indicator_category,cond_class_cats[conditionCat]) > -1 ) {  

                return ( type == d[nla12_ce_type] && subpop == d[nla12_ce_subpop] ); 
            }
        });
		console.log(cond_class_cats);*/
        
        cond_est_data = cond_est_data.filter(function(d) {     
            if( d[nla12_ce_cat] == conditionCat ) {  
                // return ( type == d[nla12_ce_type] && subpop == d[nla12_ce_subpop] );
				return ( subpop == d[nla12_ce_subpopl] );
            }
        });

        national_hc = data.filter(function(d) { 
            return ( d[nla12_ce_subpopl] == "National" ); 
        });

        if (currentAgg == "National") {
			$("#map-container img, #modal-map-container img").attr("style","opacity:0");
		} else {
			$("#map-container img, #modal-map-container img").attr("style","")
				// .attr("src","img/" + cond_est_data[0].Type + "_" + cond_est_data[0].Subpopulation + ".png");
				.attr("src","img/" + cond_est_data[0][nla12_ce_type].replace(/ /g,"_") + "_" + cond_est_data[0][nla12_ce_subpop].replace(".","") + ".png");
		}


        /*************
        ADD CHANGE ESTIMATE DATA
        *************/
        // create global to store change estimate data
        var ce_data;
        var final_data;

        // pull in change estimate data
        d3.csv(NLA0712_Change_Estimates, function(error, data) {  
            // assign locally to global variable
            change_est_data = data;

            cond_est_data.forEach(function(d,i){
                cond_d = d;
                // console.log(cond_d)
                // set variable to match
                var cond_type    = d[nla12_ce_type],
                    cond_subpop  = d[nla12_ce_subpop],
                    cond_indic   = d[nla12_ce_indic],
                    cond_cat     = d[nla12_ce_cat];

                // for each of the change element data object
                change_est_data.forEach(function(d,k){
                    ce_d = d;
                    // console.log(ce_d.Type, cond_type)

                    if (ce_d[nla0712_ce_type] == cond_type && ce_d[nla12_ce_subpop] == cond_subpop && 
					    ce_d[nla12_ce_indic] == cond_indic && ce_d[nla12_ce_cat] == cond_cat) {
                        // console.log(ce_d)
                        var estp1           = ce_d[nla0712_ce_estp1],
                            estp2           = ce_d[nla0712_ce_estp2],
                            difestp         = ce_d[nla0712_ce_diffestp],
                            difestpL        = ce_d[nla0712_ce_difflcb95pctp],
                            difestpU        = ce_d[nla0712_ce_diffucb95pctp],
                            difcilenp       = ce_d[nla0712_ce_diffcilenp],
                            // ucb95pctp2      = ce_d[nla0712_ce_ucb95pctp2],
                            // ucb95pctp1      = ce_d[nla0712_ce_ucb95pctp1],
                            // lcb95pctp2      = ce_d[nla0712_ce_lcb95pctp2],
                            // lcb95pctp1      = ce_d[nla0712_ce_lcb95pctp1],
                            significance    = ce_d[nla0712_ce_sig];

                            cond_d[nla0712_ce_estp1]         = estp1;
                            cond_d[nla0712_ce_estp2]         = estp2;
                            cond_d[nla0712_ce_diffestp]      = difestp;
                            cond_d[nla0712_ce_difflcb95pctp] = difestpL;
                            cond_d[nla0712_ce_diffucb95pctp] = difestpU;
                            cond_d[nla0712_ce_diffcilenp]    = difcilenp;
                            // cond_d[nla0712_ce_ucb95pctp2]   = ucb95pctp2;
                            // cond_d[nla0712_ce_ucb95pctp1]   = ucb95pctp1;
                            // cond_d[nla0712_ce_lcb95pctp2]   = lcb95pctp2;
                            // cond_d[nla0712_ce_lcb95pctp1]   = lcb95pctp1;
                            cond_d[nla0712_ce_sig]           = significance;
/*
                        // variables for determine statistical significance
                        var barend       = (+cond_d[nla0712_ce_ucb95pctp2] - +cond_d[nla0712_ce_ucb95pctp1]),
                            barstart     = (+cond_d[nla0712_ce_lcb95pctp2] - +cond_d[nla0712_ce_lcb95pctp1]),
                            barwidth     = Math.abs(barstart - barend); 

                        if (cond_d[nla0712_ce_estp1] != "YES") {
                                cond_d["Significance"] = "No";
                        } else {
                                cond_d["Significance"] = "Yes";
                        }
*/
                    } 
                })
            }) // End cond_est_data.forEach
            // console.log("Change Estimate:",cond_est_data);

            /*************
            CREATE NESTED DATA STRUCTURE
            *************/
            var final_data = d3.nest()
                  .key(function(d) { return d[nla12_ce_metcat];})
                  .sortKeys(d3.ascending)
                  // .sortValues(d3.ascending)
                  .sortValues(function(a,b) { return ((a[nla12_ce_indic_plain] > b[nla12_ce_indic_plain]) ? 1 : -1); } )
                  .entries(cond_est_data);
                // console.log(JSON.stringify(final_data,null,2));

            main_data = cond_est_data; // Prepare json data for export function
			nested_data = final_data;
/*
            var indicator_data = d3.nest()
                  .key(function(d) {return d[nla12_ce_indic];})
                  .sortKeys(d3.ascending)
                  .sortValues(function(a,b) { return ((a.nla12_ce_indic > b.nla12_ce_indic) ? 1 : -1); } )
                  .entries(cond_est_data);
*/

            /*************
            BEGIN TO BULID SVG FRAMEWORK
            *************/
            // Draw the bullet chart containers
            var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
                    .data(final_data)
                .enter().append("svg")
                    .attr("class","bullet")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", bulletwidth + bulletmargin.left + bulletmargin.right)
                    .attr("height", function(d){ return ( (d.values.length) * (bulletheight + bulletmargin.top + bulletmargin.bottom) ) + bordercushion; })

            var svgborder = bulletsvg.append("rect")
					.attr("width", bulletwidth + bulletmargin.left + bulletmargin.right)
					.attr("height", function(d){ return ( (d.values.length) * (bulletheight + bulletmargin.top + bulletmargin.bottom) ) + bordercushion; })
					.style("fill","none")
					.style("stroke","#ddd")
					.style("stroke-width","2.5px")
					
            var bulletg = bulletsvg.append("g")
                    .attr("class","bullet-container")
                    .attr("transform", "translate(" + (bulletmargin.left - 8) + "," + bulletmargin.top + ")")
                    .call(chart);

            var bullettitletype = bulletg.append("g")
                    .style("text-anchor", "start")
                    .attr("transform", "translate(-228," + bulletheight / 1.5 + ")")

            bullettitletype.append("text")
                    .attr("class", "title metric")
                    .text(function(d,i) { return d.values[i][nla12_ce_metcat].split(" ")[0]; });

            bullettitletype.append("text")
                    .attr("class", "title metric")
					.attr("x", 0)
					.attr("dy", 15)
                    .text(function(d,i) { return d.values[i][nla12_ce_metcat].split(" ")[1]; });

			//$("text.title.metric").eq(2).html("<tspan x=0 y=0 tspan>Human</tspan><tspan x=0 dy=15>Use</tspan>");

            // Draw the slope chart containers
            var slopesvg = d3.select("#d3-slope").selectAll("svg")
                    .data(final_data)
                .enter().append("svg")
                    .attr("class", "slope")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", slopecontainer)
                    .attr("height", function(d){ return ( (d.values.length) * (slopeheight + slopemargin.top + slopemargin.bottom) ) + bordercushion; })
            var svgborder = slopesvg.append("rect")
					.attr("width", slopecontainer)
					.attr("height", function(d){ return ( (d.values.length) * (slopeheight + slopemargin.top + slopemargin.bottom) ) + bordercushion; })
					.style("fill","none")
					.style("stroke","#ddd")
					.style("stroke-width","2.5px")

            var slopeG = slopesvg.append("g")
                    .attr("transform", "translate(" + slopemargin.left + "," + slopemargin.top + ")")
                    .call(slope); 

            var rangesvg = d3.select("#d3-range").selectAll("svg")
                    .data(final_data)
                  .enter().append("svg")
                    .attr("class", "range")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", rangecontainer-4)
                    .attr("height", function(d){ return ( (d.values.length) * (rangeheight + rangemargin.top + rangemargin.bottom) ) + bordercushion; })
            var svgborder = rangesvg.append("rect")
					.attr("width", rangecontainer-1)
					.attr("height", function(d){ return ( (d.values.length) * (rangeheight + rangemargin.top + rangemargin.bottom) ) + bordercushion; })
					.style("fill","none")
					.style("stroke","#ddd")
					.style("stroke-width","2.5px")
            /*var rangeborder = rangesvg.append("rect",":last-child")
                    .attr("class", "border")
                    .attr("width",rangecontainer)
                    .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)*/
                  
            var rangeG = rangesvg.append("g")
                    .attr("transform", "translate(" + (rangemargin.left + rangemargin.right) + ",0)")
                    .call(range); 

        }) // End d3.csv(NLA0712_Change_Estimates, function(error, data)

        toggleChartViewEnd("container-hc-2012-ar");
    
    });
}

function updateHighestConcernSI(filter_type,filter_indic) {
	toggleChartViewStart("container-hc-2012-si")
	d3.selectAll('svg').remove();
	d3.selectAll('.d3-tip').remove();
	$("#map-container").addClass("hidden")
	d3.select("#chart-header-text").style("width","745px")

	// Show relevant filters / Hide others
	$("#filters-condition-si").addClass("in");
    $("#filters-condition").removeClass("in");

	$("#hc-ar-agg").text(filter_type + " | " + filter_indic);	
	$("#map-container img, #modal-map-container img").attr("style","opacity:0");
	// Show relevant additional info
	$("#notes").attr("style","height:530px");
	$("#notes #container-additional-info").html(condinfo);

	d3.csv(NLA12_Condition_Estimates, function(error, data) {

		/*************
		PREPARE DATA
		*************/
        var cond_est_data = data,
			duration = 250;

        /*************
        FILTER DATA
        *************/
        cond_est_data = cond_est_data.filter(function(d) {     
            if( d[nla12_ce_cat] == conditionCat ) {  
				return ( d[nla12_ce_type] == filter_type && d[nla12_ce_indic_plain] == filter_indic);
            }
        });

        /*************
        ADD CHANGE ESTIMATE DATA
        *************/
        // create global to store change estimate data
        var ce_data;
        var final_data;

        // pull in change estimate data
        d3.csv(NLA0712_Change_Estimates, function(error, data) {
            // assign locally to global variable
            change_est_data = data;

            cond_est_data.forEach(function(cond_d,i){
                // set variable to match
                var cond_type    = cond_d[nla12_ce_type],
                    cond_subpopl = cond_d[nla12_ce_subpopl],
                    cond_indic   = cond_d[nla12_ce_indic],
                    cond_cat     = cond_d[nla12_ce_cat];

                // for each of the change element data object
                change_est_data.forEach(function(ce_d,k){
                    if (ce_d[nla0712_ce_type] == cond_type && ce_d[nla12_ce_subpopl] == cond_subpopl && 
					    ce_d[nla12_ce_indic] == cond_indic && ce_d[nla12_ce_cat] == cond_cat) {

                        var estp1           = ce_d[nla0712_ce_estp1],
                            estp2           = ce_d[nla0712_ce_estp2],
                            difestp         = ce_d[nla0712_ce_diffestp],
                            difestpL        = ce_d[nla0712_ce_difflcb95pctp],
                            difestpU        = ce_d[nla0712_ce_diffucb95pctp],
                            difcilenp       = ce_d[nla0712_ce_diffcilenp],
                            significance    = ce_d[nla0712_ce_sig];

                            cond_d[nla0712_ce_estp1]         = estp1;
                            cond_d[nla0712_ce_estp2]         = estp2;
                            cond_d[nla0712_ce_diffestp]      = difestp;
                            cond_d[nla0712_ce_difflcb95pctp] = difestpL;
                            cond_d[nla0712_ce_diffucb95pctp] = difestpU;
                            cond_d[nla0712_ce_diffcilenp]    = difcilenp;
                            cond_d[nla0712_ce_sig]           = significance;
                      } 
                });
            }); // End cond_est_data.forEach

            /*************
            CREATE NESTED DATA STRUCTURE
            *************/
            var final_data = d3.nest()
                  .key(function(d) { return d[nla12_ce_indic_plain];})
                  .sortValues(function(a,b) { 
						if (a[nla12_ce_type]=="EPA Regions") return a[nla12_ce_subpop] - b[nla12_ce_subpop];
						else return a[nla12_ce_subpopl] > b[nla12_ce_subpopl] ? 1 : -1; 
				  })
                  .entries(cond_est_data);
                // console.log(JSON.stringify(final_data,null,2));

            main_data = cond_est_data; // Prepare json data for export function
			nested_data = final_data;

            /*************
            BEGIN TO BULID SVG FRAMEWORK
            *************/
            // Draw the bullet chart containers
            var bulletsvg = d3.select("#d3-bullet-si").selectAll("svg")
                    .data(final_data)
                .enter().append("svg")
                    .attr("class","bullet")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", bulletwidthSI + bulletmarginSI.left + bulletmarginSI.right)
                    .attr("height", function(d){ return (d.values.length) * (bulletheightSI + bulletmarginSI.top + bulletmarginSI.bottom); })
            var bulletg = bulletsvg.append("g")
                    .attr("class","bullet-container")
                    .attr("transform", "translate(" + bulletmarginSI.left + "," + bulletmarginSI.top + ")")
                    .call(bulletSI);

            /*var bullettitletype = bulletg.append("g")
                    .style("text-anchor", "start")
                    .attr("transform", "translate(-235," + bulletheight / 1.5 + ")")

            bullettitletype.append("text")
                    .attr("class", "title indicator")
                    .text(function(d,i) { return d["key"]; });*/

            // Draw the slope chart containers
            var slopesvg = d3.select("#d3-slope-si").selectAll("svg")
                    .data(final_data)
                .enter().append("svg")
                    .attr("class", "slope")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", slopecontainer)
                    .attr("height", function(d){ return (d.values.length) * (slopeheight + slopemargin.top + slopemargin.bottom); })
            var slopeG = slopesvg.append("g")
                    .attr("transform", "translate(" + slopemargin.left + "," + slopemargin.top + ")")
                    .call(slopeSI); 

            var rangesvg = d3.select("#d3-range-si").selectAll("svg")
                    .data(final_data)
                  .enter().append("svg")
                    .attr("class", "range")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", rangecontainerSI - 3)
                    .attr("height", function(d){ return (d.values.length) * (rangeheightSI + rangemarginSI.top + rangemarginSI.bottom); })
                  
            var rangeG = rangesvg.append("g")
                    .attr("transform", "translate(" + (rangemarginSI.left + rangemarginSI.right) + ",0)")
                    .call(rangeSI); 

        }) // End d3.csv(NLA0712_Change_Estimates, function(error, data)


	});

	toggleChartViewEnd("container-hc-2012-si");
}
/************
*************
SIZE MAP
*************
************/
function updateSizeMap(sizemap_filter_category, sizemap_filter_subpop) {

    currentView = "size";

    toggleChartViewStart("container-hc-2012-sm");
	
	d3.selectAll('svg').remove();
	d3.selectAll('.d3-tip').remove();
	$("#map-container").removeClass("hidden")
	d3.select("#chart-header-text").style("width","615px")

    // Show relevant filters / Hide others
    $("#filters-sizemap").addClass("in");
    $("#filters-condition").removeClass("in");
	$("#filters-condition-si").removeClass("in");
    $("#filters-risk").removeClass("in");
	// Hide map container
	$("#map-container img, #modal-map-container img").attr("style","opacity:0");
	// Show relevant additional info
	$("#notes").attr("style","height:530px");
	$("#notes #container-additional-info").html(sizeinfo);

    d3.csv(NLA12_Condition_Estimates, function(error, data) {  

        var cond_est_data = data,
            duration = 250;


        /*************
        **************
        DATA FILTER
        **************
        *************/

         // split the passed argument filter_subpop into separate parts
        // var type    = sizemap_filter_subpop.substring(0,sizemap_filter_subpop.indexOf("--")),
        var subpop = sizemap_filter_subpop;

        // filter the data to match the filter arguments
        /*cond_est_data = cond_est_data.filter(function(d) { 
            // create indicator_category by concatinating indicator and category (eg. 'Acidification_Good')
            var indicator_category = d[nla12_ce_indic] + "_" + d[nla12_ce_cat];

            // if the ind_cat is in the condition category (eg. 'Acidification_Good' is in 'Lowest Concern')
            if( $.inArray(indicator_category,cond_class_cats[conditionCat]) > -1 ) {  
                    return sizemap_filter_subpop == d[nla12_ce_type]; //  && sizemap_filter_indic == d[nla12_ce_indic] ; 
                // }
            }
        });*/
        cond_est_data = cond_est_data.filter(function(d) {   
            if( d[nla12_ce_cat] == conditionCat ) {  
                return sizemap_filter_subpop == d[nla12_ce_type];
            }
        });

       /* // split the passed argument filter_subpop into separate parts
        var type    = sizemap_filter_subpop.substring(0,sizemap_filter_subpop.indexOf("--")),
            subpop  = sizemap_filter_subpop.substring(sizemap_filter_subpop.indexOf("--")+2);

console.log("type:",type," || subpop:",subpop);


        // filter the data to match the filter arguments
        cond_est_data = cond_est_data.filter(function(d) { 
            // create indicator_category by concatinating indicator and category (eg. 'Acidification_Good')
            var indicator_category = d[nla12_ce_indic] + "_" + d[nla12_ce_cat];
console.log(indicator_category);

            // if the ind_cat is in the condition category (eg. 'Acidification_Good' is in 'Lowest Concern')
            if( $.inArray(indicator_category,cond_class_cats[conditionCat]) > -1 ) {  
                // console.log(d[nla12_ce_type]);
                return ( type == d[nla12_ce_type] && subpop == d[nla12_ce_subpop] ); 
                // return sizemap_filter_subpop == d[nla12_ce_type]; 
            }
        });
        console.log(cond_est_data);*/

        // Nest the data
        var final_data = d3.nest()
                  .key(function(d) {return d[nla12_ce_metcat];})
                  .sortKeys(d3.ascending)
                  .key(function(d) {return d[nla12_ce_indic_plain];})
				  .sortKeys(d3.ascending)
				  .sortValues( function(a,b) {
					  if (a[nla12_ce_type]=="EPA Regions") return a[nla12_ce_subpop] - b[nla12_ce_subpop]; 
					  else return a[nla12_ce_subpop] > b[nla12_ce_subpop] ? 1 : -1;
				  })
                  .entries(cond_est_data);
                // console.log(JSON.stringify(final_data,null,2));
                // console.log("Final Data:",final_data);

        main_data = cond_est_data;
		
        var arr_subpop_unique = [],
            arr_indic_unique = [];

        final_data.map(function(d) {
            d.values.forEach(function(d,i){
                d.values.forEach(function(d,i){
                    if($.inArray(d[nla12_ce_subpop], arr_subpop_unique) === -1) arr_subpop_unique.push(d[nla12_ce_subpop])
                })
            })
        })

        arr_subpop_unique = arr_subpop_unique.sort(function(a, b){
			if (a == +a) return a - b;
			else return a > b ? 1 : -1;
			});
        /*************
        **************
        START SIZE MAPS 
        **************
        *************/
        var sizemapHeader = d3.select("#d3-sizemap-hr").selectAll("div")
          .data(arr_subpop_unique)

        sizemapHeader
            .enter()
          .append("div")
            .attr("class", "sizemap-hr-title ellipsis scroll_on_hover")

        sizemapHeader
            .html(function(d,i) {return d} );

        sizemapHeader
            .exit().remove();

        var sizemapsvg = d3.select("#d3-sizemap").selectAll("svg")
                .data(final_data)
            
        sizemapsvg.enter().append("svg")
            .attr("class", "sizemap")
            .attr("data-loc",function(d,i){ return i; })

        sizemapsvg
            .attr("width", sizemapcontainer)
            .attr("height", function(d,i){ return ( sizemapheight * (d.values.length) ) + bordercushion; })

		var svgborder = sizemapsvg.append("rect")
			.attr("width", sizemapcontainer)
			.attr("height", function(d,i){ return ( sizemapheight * (d.values.length) ) + bordercushion; })
			.style("fill","none")
			.style("stroke","#ddd")
			.style("stroke-width","2.5px");

        sizemapg = sizemapsvg.append("g")
              .attr("transform", function(d,i) { return "translate(200,0)"; })
              .attr("class","sizemap-row")
              .call(sizemap);

        sizemapsvg.exit().remove();

        var sizemaptitle = sizemapg.append("g")
                .style("text-anchor", "start")
                .attr("transform", "translate(-195," + sizemapheight / 1.5 + ")")
                .attr("class","sizemap-title")

        sizemaptitle.append("text")
                .attr("class", "title metric")
                .text(function(d,i) { return d["key"]; } );
        })

    toggleChartViewEnd("container-hc-2012-sm");
};

/************
*************
RISK ESTIMATES
*************
************/
function updateRiskView(risk_filter_category, risk_filter_subpop, risk_filter_response) {
    currentView = "risk";

    toggleChartViewStart("container-risk");

	d3.selectAll('svg').remove();
	d3.selectAll('.d3-tip').remove();
	$("#map-container").removeClass("hidden")
	d3.select("#chart-header-text").style("width","615px")

    // Show relevant filters / Hide others
    $("#filters-risk").addClass("in");
    $("#filters-condition").removeClass("in");
	$("#filters-condition-si").removeClass("in");
    $("#filters-sizemap").removeClass("in");
	
	$("#hc-ar-subtext").text("In Relation to: " + risk_filter_response + " | ");
	// Show relevant additional info
	$("#notes").attr("style","height:530px");
	$("#notes #container-additional-info").html(riskinfo);

	// split the passed argument filter_subpop into separate parts
	var type = risk_filter_subpop.substring(0,risk_filter_subpop.indexOf("--"));
	// var subpop = risk_filter_subpop.substring(risk_filter_subpop.indexOf("--")+2);
	var subpop = risk_filter_subpop;

	d3.csv(NLA12_Condition_Estimates, function(error, data) {

		rel_ext_data = data,
		duration = 250;

		/*************
		FILTER DATA
		*************/

		// filter the data to match the filter arguments
		rel_ext_data = rel_ext_data.filter(function(d) {

			if( d[nla12_ce_cat] == conditionCat && (d[nla12_ce_metcat] == "Chemical" || d[nla12_ce_metcat] == "Physical" || d[nla12_ce_metcat] == "Human Use") 
				&& d[nla12_ce_indic_plain] != "Atrazine (Exceeds 4ppb)" && d[nla12_ce_indic_plain] != "Chlorophyll a (Risk)" && d[nla12_ce_indic_plain] != "Cyanobacteria (Risk)") { 
				return (subpop == d[nla12_ce_subpopl]);
			}
		});

		if (currentAgg == "National") {
			$("#map-container img, #modal-map-container img").attr("style","opacity:0");
		} else {
			$("#map-container img, #modal-map-container img").attr("style","")
				.attr("src","img/" + rel_ext_data[0][nla12_ce_type].replace(/ /g,"_") + "_" + rel_ext_data[0][nla12_ce_subpop].replace(".","") + ".png");
		}

		/*************
		CREATE NESTED DATA STRUCTURE
		*************/

		var final_data = d3.nest()
			  .key(function(d) { return d[nla12_ce_metcat];})
			  .sortKeys(d3.ascending)
			  .sortValues(function(a,b) { return ((a[nla12_ce_indic_plain] > b[nla12_ce_indic_plain]) ? 1 : -1); } )
			  .entries(rel_ext_data);

		/*************
		BEGIN TO BUILD SVG FRAMEWORK
		*************/
		// Draw the relative extent chart containers
		var bulletsvg = d3.select("#d3-bullet-rel-extent").selectAll("svg")
				.data(final_data)
		bulletsvg.enter().append("svg")
				.attr("class","bullet")
				.attr("data-loc",function(d,i){ return i; })
				.attr("width", relextentwidth + relextentmargin.left + relextentmargin.right)
				.attr("height", function(d){ return (d.values.length) * (relextentheight + relextentmargin.top + relextentmargin.bottom); })
		var svgborder = bulletsvg.append("rect")
				.attr("width", relextentwidth + relextentmargin.left + relextentmargin.right - 3)
				.attr("height", function(d){ return (d.values.length) * (relextentheight + relextentmargin.top + relextentmargin.bottom); })
				.style("fill","none")
				.style("stroke","#ddd")
				.style("stroke-width","2.5px")

		var bulletg = bulletsvg.append("g")
				.attr("class","bullet-container")
				.attr("transform", "translate(" + relextentmargin.left + "," + relextentmargin.top + ")")
				.call(bulletRelExtent);

		bulletsvg.exit().remove();

		var bullettitletype = bulletg.append("g")
				.style("text-anchor", "start")
				.attr("transform", "translate(-210," + relextentheight / 1.5 + ")")

		bullettitletype.append("text")
				.attr("class", "title metric")
				.text(function(d,i) { return d.values[i][nla12_ce_metcat].split(" ")[0]; });

		bullettitletype.append("text")
				.attr("class", "title metric")
				.attr("x", 0)
				.attr("dy", 15)
				.text(function(d,i) { return d.values[i][nla12_ce_metcat].split(" ")[1]; });

		var relextsvg = d3.select("#d3-bullet-rel-extent-ext").selectAll("svg")
				.data(final_data)
		relextsvg.enter().append("svg")
				.attr("width", 25)
				.attr("height", function(d){ return (d.values.length) * (relriskheight + relriskmargin.top + relriskmargin.bottom); })
		var relextg = relextsvg.append("g")
				.attr("transform", "translate(0,0)")
				//.call(bulletrelext);

		relextsvg.exit().remove();
	}); // Ends d3.csv(NLA12_Condition_Estimates, ...

	// var rel_risk_data;
	d3.csv(NLA12_Risk_Estimates, function(error, data) {  //NLA12_Condition_Estimates = "data/NLA12_Condition_Estimates_20141209_KC.csv",

		risk_data = data.filter(function(d) {     
			if( d[nla12_rel_risk_response_plain] == risk_filter_response ) {  
				// console.log(type, subpop);
				return ( subpop == d[nla12_rel_risk_subpop_plain] );
			}
		});

		var final_data = d3.nest()
				  .key(function(d) { return d[nla12_attr_risk_metric_category];})
				  .sortKeys(d3.ascending)
				  .sortValues(function(a,b) { return ((a[nla12_attr_risk_stressor_plain] > b[nla12_attr_risk_stressor_plain]) ? 1 : -1); } )
				  .entries(risk_data);

		main_data = risk_data;

		// Draw the relative risk chart containers
		var relrisksvg = d3.select("#d3-bullet-rel-risk").selectAll("svg")
				.data(final_data)
		relrisksvg.enter().append("svg")
				.attr("class", "bullet")
				.attr("data-loc",function(d,i){ return i; })
				.attr("width", relriskcontainer)
				.attr("height", function(d){ return (d.values.length) * (relriskheight + relriskmargin.top + relriskmargin.bottom); })
		var svgborder = relrisksvg.append("rect")
				.attr("width", relriskcontainer - 3)
				.attr("height", function(d){ return (d.values.length) * (relriskheight + relriskmargin.top + relriskmargin.bottom); })
				.style("fill","none")
				.style("stroke","#ddd")
				.style("stroke-width","2.5px")

		var relriskG = relrisksvg.append("g")
				.attr("transform", "translate(" + relriskmargin.left + "," + relriskmargin.top + ")")
				.call(bulletRelRisk); 
		
		relrisksvg.exit().remove();

		var relextsvg = d3.select("#d3-bullet-rel-risk-ext").selectAll("svg")
				.data(final_data)
		relextsvg.enter().append("svg")
				.attr("width", 25)
				.attr("height", function(d){ return (d.values.length) * (relriskheight + relriskmargin.top + relriskmargin.bottom); })
		var relextg = relextsvg.append("g")
				.attr("transform", "translate(0,0)")
				.call(bulletrelext);

		relextsvg.exit().remove();

		var attrrisksvg = d3.select("#d3-bullet-attr-risk").selectAll("svg")
				.data(final_data)
		attrrisksvg.enter().append("svg")
				.attr("class", "bullet")
				.attr("data-loc",function(d,i){ return i; })
				.attr("width", attrriskcontainer)
				.attr("height", function(d){ return (d.values.length) * (attrriskheight + attrriskmargin.top + attrriskmargin.bottom); })
		var svgborder = attrrisksvg.append("rect")
				.attr("width", attrriskcontainer - 3)
				.attr("height", function(d){ return (d.values.length) * (attrriskheight + attrriskmargin.top + attrriskmargin.bottom); })
				.style("fill","none")
				.style("stroke","#ddd")
				.style("stroke-width","2.5px")
		var attrriskG = attrrisksvg.append("g")
				.attr("transform", "translate(" + (attrriskmargin.left + attrriskmargin.right) + ",0)")
				.call(bulletAttrRisk); 
				
		attrrisksvg.exit().remove();

		var attrextsvg = d3.select("#d3-bullet-attr-risk-ext").selectAll("svg")
				.data(final_data)
		attrextsvg.enter().append("svg")
				.attr("width", 25)
				.attr("height", function(d){ return (d.values.length) * (attrriskheight + attrriskmargin.top + attrriskmargin.bottom); })

		var attrextg = attrextsvg.append("g")
				.attr("transform", "translate(0,0)")
				.call(bulletattrext);
				
		attrextsvg.exit().remove()

	});

	// Footer Legend
	var risksvg = d3.select("#footer-risk-estimate").insert("svg",":first-child")
			.attr("height", 100)
			.attr("width", 765)
	var riskcite = risksvg.append("g")
		.attr("id","risk-ref")
		.attr("transform","translate(0,35)")
	var risktext = riskcite.append("text")
	risktext.append("tspan")
			.attr("x",0)
			.attr("dy",10)
			.text("U.S. Environmental Protection Agency (USEPA). 2016.")
	risktext.append("tspan")
			.attr("x",0)
			.attr("dy",10)
			.attr("font-style","italic")
			.text("National Lakes Assessment 2012: A Collaborative Survey ")
	risktext.append("tspan")
			.attr("x",0)
			.attr("dy",10)
			.attr("font-style","italic")
			.text("of Lakes in the United States. ")
	risktext.append("tspan")
			.attr("x",113)
			.attr("dy",0)
			.text("EPA 841-R-16-004.")
			
	// Arrow and Text
	var svgdefs = risksvg.append("defs")
	svgdefs.append("marker")
			.attr("id","markerArrow")
			.attr("markerWidth",10)
			.attr("markerHeight",10)
			.attr("refX",2)
			.attr("refY",6)
			.attr("orient","auto")
			.append("path")
				.attr("d","M2,3 L2,9 L8,6 L2,3")
				.attr("fill","#000")
			
	var riskg = risksvg.append("g")
			.attr("fill","none")
			.attr("stroke","#000")
			.attr("stroke-width","1")
			.attr("transform","translate(423,0)")
	riskg.append("path")
			.attr("d","M0,0 L0,6 40,6")
			.attr("marker-end","url(#markerArrow)")
	riskg = risksvg.append("g")
			.attr("fill","#000")
			.attr("font-size","11px")
			.attr("font-family","Helvetica, Arial, sans-serif")
			.attr("transform","translate(480,0)")
	riskg.append("text")
			.attr("x",0)
			.attr("y",10)
			.text("Increased risk")
	riskg.append("text")
			.attr("x",110)
			.attr("y",10)
			.text("Values below zero not shown")

	// Legend Box
	var risklegend = risksvg.append("g")
			.attr("fill","none")
			.attr("stroke","#000")
			.attr("transform","translate(396,35)")
	risklegend.append("rect")
			.attr("width",342)
			.attr("height", 50)
			.attr("stroke-width",0.5)
	var riskg = risklegend.append("g")
			.attr("transform", "translate(5,10)")
			.attr("stroke-dasharray","2,1")
	riskg.append("line")
			.attr("x1",0)
			.attr("y1",5)
			.attr("x2",16)
			.attr("y2",5)
	riskg.append("line")
			.attr("x1",16)
			.attr("y1",2)
			.attr("x2",16)
			.attr("y2",8)
			.attr("stroke-dasharray","0")
	riskg.append("line")
			.attr("x1",0)
			.attr("y1",25)
			.attr("x2",16)
			.attr("y2",25)
	riskg.append("line")
			.attr("x1",16)
			.attr("y1",22)
			.attr("x2",16)
			.attr("y2",28)
			.attr("stroke-dasharray","0")
	riskg.append("path")
			.attr("d","M0,20 L10,20 10,30 0,30")
			.attr("stroke","#999")
	var riskg = risklegend.append("g")
			.attr("fill","#000")
			.attr("font-size","10px")
			.attr("stroke-width","0")
			.attr("transform", "translate(35,18)")
	riskg.append("text")
			.attr("y",0)
			.text("Confidence interval extends past axis range.")
	riskg.append("text")
			.attr("y",20)
			.text("Point estimate and confidence interval extend past axis range.")
	

	toggleChartViewEnd("container-risk");
}
/************
*************
BREAKOUT CHART
*************
************/

function updateBreakOut() {

    d3.select("#modal-breakout").selectAll("svg").remove();
	d3.select("#modal-breakout").selectAll('.d3-tip').remove();
    d3.csv(NLA12_Condition_Estimates, function(error, data) {

        national_data = data.filter(function(d) { 
                return ( d[nla12_ce_subpop] == "National" && d[nla12_ce_indic_plain] == currentIndicator && d[nla12_ce_cat] != "Total"); 
        });

        fcond_data = data.filter(function(d) {
            if (d[nla12_ce_subpopl] == currentAgg && d[nla12_ce_indic_plain] == currentIndicator && d[nla12_ce_cat] != "Total") {
                return d;
            }; 
        });

        d3.csv(NLA0712_Change_Estimates, function(error, data) {  
            // assign locally to global variable
            fchange_data = data.filter(function(d) {
                if (d[nla0712_ce_subpopl] == currentAgg && d[nla0712_ce_indic_plain] == currentIndicator && d[nla0712_ce_cat] != "Total") {
                    return d;
                };
            });

            fcond_data.forEach(function(d,i){
                fcond_d = d;
                // console.log(cond_d)
                // set variable to match
                var fcond_type    = d[nla12_ce_type],
                    fcond_subpop  = d[nla12_ce_subpop],
                    fcond_indic   = d[nla12_ce_indic],
                    fcond_cat     = d[nla12_ce_cat];

                // for each of the change element data object
                fchange_data.forEach(function(d,k){
                    fce_d = d;
                    // console.log(ce_d.Type, cond_type)

                    if (fce_d[nla0712_ce_type] == fcond_type && fce_d[nla0712_ce_subpop] == fcond_subpop &&
                        fce_d[nla0712_ce_indic] == fcond_indic && fce_d[nla0712_ce_cat] == fcond_cat) {

                        var estp1           = fce_d[nla0712_ce_estp1],
                            estp2           = fce_d[nla0712_ce_estp2],
                            difestp         = fce_d[nla0712_ce_diffestp],
                            difestpL        = fce_d[nla0712_ce_difflcb95pctp],
                            difestpU        = fce_d[nla0712_ce_diffucb95pctp],
                            difcilenp       = fce_d[nla0712_ce_diffcilenp],
                            significance    = fce_d[nla0712_ce_sig];

                            fcond_d[nla0712_ce_estp1]         = estp1;
                            fcond_d[nla0712_ce_estp2]         = estp2;
                            fcond_d[nla0712_ce_diffestp]      = difestp;
                            fcond_d[nla0712_ce_difflcb95pctp] = difestpL;
                            fcond_d[nla0712_ce_diffucb95pctp] = difestpU;
                            fcond_d[nla0712_ce_diffcilenp]    = difcilenp;
                            fcond_d[nla0712_ce_sig]           = significance;

                    } 
                }) // End of fchange_data.ForEach 
            }) // End fcond_data.forEach // --- Add END

			fcond_data.forEach(function(d) {
				if ( d[nla12_ce_cat] == "Most Disturbed" ) d["SortID"] = 0;
				else if ( d[nla12_ce_cat] == "Moderately Disturbed" ) d["SortID"] = 1;
				else if ( d[nla12_ce_cat] == "Least Disturbed" ) d["SortID"] = 2;
				else if ( d[nla12_ce_cat] == "Not Assessed" ) d["SortID"] = 4;
				else d["SortID"] = 3;
			});

        /*************
        CREATE NESTED DATA STRUCTURE
        *************/
        var final_data = d3.nest()
            .key(function(d) {return d[nla12_ce_indic];})
            .sortKeys(d3.ascending)
            .sortValues(function(a,b) { return a["SortID"] - b["SortID"]; })
            .entries(fcond_data);

        breakout_data = fcond_data;
          
        /*************
        BEGIN TO BULID SVG FRAMEWORK
        *************/
        // Draw the bullet chart containers
        var bulletsvg = d3.select("#d3-bulletB").selectAll("svg")
            .data(final_data)
                .enter().append("svg")
                .attr("class","bullet")
                .attr("data-loc",function(d,i){ return i; })
                .attr("width", bulletwidthB + bulletmarginB.left + bulletmarginB.right)
                .attr("height", function(d){ return (d.values.length) * (bulletheightB + bulletmarginB.top + bulletmarginB.bottom); })

        var bulletg = bulletsvg.append("g")
                .attr("class","bullet-container")
                .attr("transform", "translate(" + bulletmarginB.left + "," + bulletmarginB.top + ")")
                .call(bulletB);

        var bullettitletype = bulletg.append("g")
                .style("text-anchor", "start")
                .attr("transform", "translate(-225," + bulletheightB / 1.5 + ")")

        /*bullettitletype.append("text")
                .attr("class", "title metric")
                .text(function(d,i) { return d.values[i][nla12_ce_indic].replace(/_/g," "); });  */
        //})

        var modaltitleB = d3.select("h3.modal-title:last-child");
        modaltitleB.text(currentIndicator.replace(/_/g," ") + " | " + currentAgg.replace(/_/g," "))

        // Draw the slope chart containers
        var slopesvg = d3.select("#d3-slopeB").selectAll("svg")
            .data(final_data)
                .enter().append("svg")
                    .attr("class", "slope")
                    .attr("data-loc", function(d,i){ return i; })
                    .attr("width", slopecontainerB)
                    .attr("height", function(d){ return (d.values.length) * (slopeheightB + slopemarginB.top + slopemarginB.bottom); })
              
        var slopeG = slopesvg.append("g")
                .attr("transform", "translate(" + slopemarginB.left + "," + slopemarginB.top + ")")
                .call(slopeB); 

        var rangesvg = d3.select("#d3-rangeB").selectAll("svg")
            .data(final_data)
                .enter().append("svg")
                    .attr("class", "range")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", rangecontainerB)
                    .attr("height", function(d){ return (d.values.length) * (rangeheightB + rangemarginB.top + rangemarginB.bottom); })
                  
        var rangeborder = rangesvg.append("rect",":last-child")
                .attr("class", "border")
                .attr("width", rangecontainerB)
                .attr("height", rangeheightB + rangemarginB.top + rangemarginB.bottom)
                  
        var rangeG = rangesvg.append("g")
                .attr("transform", "translate(" + (rangemarginB.left + rangemarginB.right) + ",0)")
                .call(rangeB); 


            
        });

    }); // End d3.csv(NLA12_Condition_Estimates, function(error, data)
};

updateHighestConcern(conditionCat,arr_type_subpop);
// updateSizeMap(sizemap_filter_category, sizemap_filter_subpop);
