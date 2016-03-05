(function() {

d3.charts = { 
  chart: function(d) {
  
	var orient = "left", // TODO top & bottom
		reverse = false,
		duration = 500,
		width = bulletwidth + 5,
		height = bulletheight,
		tickFormat = d3.format(".0%"),
		metric_width = 65,
		newData = [];

  /************
  *************
  BULLET FUNCTION
  *************
  ************/
  function drawChart(g) {
  // console.log(g);

    var bulletG = d3.selectAll("#d3-bullet g"),
        axisFlag = 0, // Determine whether to add axis or gridlines
        rowCount = 0; // Used to apply data attribute which controls highlighting

    bulletG.each(function(d, i) {
      var g = d3.select(this);

      var bulletsub = g.selectAll("g .bullet-sub")
          .data(d.values)
        .enter().append("g")
          .attr("class","bullet-sub")
          .attr("data-loc",function(){  
            i = rowCount; 
            rowCount++; 
            return "chart-loc-" + i; 
          })
          .attr("height", function(d){ return bulletheight + bulletmargin.top + bulletmargin.bottom; })
          .attr("transform", function(d,i) { return "translate(0," + ((bulletheight + bulletmargin.top + bulletmargin.bottom)*i) + ")"; })          

      bulletsub.each(function(d, j) {

        // Select parent nodes to add borders
        var bulletsvg = d3.select(this.parentNode.parentNode);

        // Add borders
        var bulletborder = bulletsvg.insert("rect",":first-child")
                .attr("class", "border")
                // .attr("data-loc",j)
                .attr("width",bulletcontainer - metric_width)
                .attr("height", bulletheight + bulletmargin.top + bulletmargin.bottom)
                .attr("transform",function(d,i){ return "translate(" + metric_width + "," + ( ( bulletheight + bulletmargin.top + bulletmargin.bottom) * j )  + ")"; })

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)


        var bullettitle = gsub.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate(-160," + bulletheight / 1.5 + ")")

        bullettitle.append("svg:image")
          .attr('x',148)
          .attr('y',-10.5)
          .attr('width', 11)
          .attr('height', 11)
          .attr("class","icon-breakout")
          .attr("xlink:href","img/icon-breakout-inactive.png")
        .on('mouseover', function(d) {
              d3.select(this)
              .attr("xlink:href","img/icon-breakout-hover.png")   
          })
          .on('mouseout',  function() {
              d3.select(this)
              .attr("xlink:href","img/icon-breakout-inactive.png")
          })

        bullettitle.append("text")
            .attr("class", "title indicator")
            .text(function(d) { 
      				if (d[nla0712_ce_sig] === "Yes") {
						return d[nla12_ce_indic_plain] + "*";
      				} else {
						return d[nla12_ce_indic_plain];
      				}
      			});

		var startrange      = +d[nla12_ce_lcb95pctp]/100,
			endrange        = +d[nla12_ce_ucb95pctp]/100,
			proportion      = +d[nla12_ce_estp]/100,
			confinv         = +d[nla12_ce_confinv]/100;

			// Compute the new x-scale.
			var x1 = d3.scale.linear()
				.domain([0,1])
				.range(reverse ? [width, 0] : [0, width]);

			// function for the y grid lines
			function make_gridlines() {
			  return d3.svg.axis()
				  .scale(x1)
				  .orient("bottom")
				  .ticks(5)
			}

			// Add the gridlines
			var xGrid = gsub.append("g")            
				.attr("class", "grid")
				.attr("transform", "translate(0,0)")
				.call(make_gridlines()
					.tickSize(bulletheight)
					.tickFormat("")
					.tickPadding(10)
				);

			// Retrieve the old x-scale, if this is an update.
			var x0 = this.__chart__ || d3.scale.linear()
				.domain([0, Infinity])
				.range(x1.range());

			// Stash the new scale.
			this.__chart__ = x1;

			// Derive width-scales from the x-scales.
			var w0 = bulletWidth(x0),
				w1 = bulletWidth(x1);


        if ( d[nla12_ce_estp] == "NA" ) {
			var addNAtext = gsub.append("g")
						.style("text-anchor", "start")
						.attr("transform", "translate(5,21)")

				addNAtext.append("text")
						.attr("class", "no-data")
						.text(function(d,i) { return "No Observed Lakes"; });

		} else { 

			currentHover = "";  // initialize currentHover

			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.direction(function(d){
				  var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
					  win = $(window);
				  if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/30) ) return "s";
				  else return "n";
				})
				.html(function(d) {
					var d = this.data()[0];
					if (currentHover == "national") {
						return '<div class="tooltip-table" style="width:480px"><table>' +
						'<tr><td> National | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_nlb]) + '%</b> to <b>' +  r1(d[nla12_ce_nub]) + '%</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: This gray band displays the national confidence interval as context for understanding sub-national results. In this case, the national confidence interval for this estimate is ' + r1(d[nla12_ce_nlb]) + '% to ' + r1(d[nla12_ce_nub]) + '% ('+r0(d[nla12_ce_nlbu])+' to '+r0(d[nla12_ce_nubu])+').</td></tr>' +
						'</div></table>'
					} else {
						return '<div class="tooltip-table" style="width:480px"><table>' +
						'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>2012 point estimate: <b>' + r1(d[nla12_ce_estp]) + '%</b></td></tr>' +
						'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_lcb95pctp]) + '%</b> to <b>' +  r1(d[nla12_ce_ucb95pctp]) + '%</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: In 2012, EPA found that '+r1(d[nla12_ce_estp])+'% ('+r0(d[nla12_ce_estu])+') of all '+d[nla12_ce_subpopl]+' lakes are designated as '+d[nla12_ce_cat]+' for '+d[nla12_ce_indic_plain]+'. The confidence interval for this estimate is '+r1(d[nla12_ce_lcb95pctp])+'% to '+r1(d[nla12_ce_ucb95pctp])+'% ('+r0(d[nla12_ce_lcb95pctu])+' to '+r0(d[nla12_ce_ucb95pctu])+' lakes).</td></tr>' +
						'</div></table>' }
						})
				.offset([0,100])
						/*function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()-win.width()*1.1+1020];
						})*/

			var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
			bulletsvg.call(tip);

			// console.log(axisFlag);
			// If axisFlag == 0, add the axis to the axis container
			if(axisFlag==0) {

			  var xAxis = d3.svg.axis()
				  .scale(x1)
				  .orient("top")
				  .tickSize(5)
				  .ticks(5)
				  .tickFormat(tickFormat);

			  //Add the x-axis
			  var xAxissvg = d3.select("#d3-bullet-axis")
				  .append("svg")
				  .attr("class","axis-container")              
				  .attr("width", bulletwidth + bulletmargin.left + bulletmargin.right )
				  .attr("height",20)

			  var xAxisAppend = xAxissvg.append("g")
				  .attr("transform", "translate(" + (bulletmargin.left - 6) + ",20)")
				  .style("font-family","Arial,sans-serif")
				  .call(xAxis);
			
				axisFlag++; // Increment the axis flag
			}

			// Update the confidence rects.
			/*var confidence = gsub.selectAll("rect.confidence")
				//.data(startconfidence);
				.data([d]);

			confidence.enter().append("rect")
				.attr("class", function(d,i) { return "confidence"; })
				.attr("width", 0)
				.attr("height", (bulletheight - 10))
				.attr("y", 5)
				.attr("x", 0 )
			  .transition()
				.duration(duration)
				.attr("x", function(d) { 
				  if ( x1( startconfidence ) < 0 ) { sc = 0; } else { sc = x1( startconfidence ); }  return sc; })
				.attr("width", x1( endconfidence-startconfidence ) );*/

			// Update the national range rects.
			var range = gsub.selectAll("rect.range")
				.data([d]);

			if ( d[nla12_ce_type] != "National" ) {

				var startref      = +d[nla12_ce_nlb]/100 || 0,
					endref        = +d[nla12_ce_nub]/100 || 0;
			  
				range.enter().append("rect")
					.attr("class","national")
					.attr("width", x1( endref - startref ))
					.attr("height", bulletheight / 1.1)
					.attr("y", (( bulletheight / 2 ) - ( (bulletheight / 1.1 )/2 )) )
					.attr("x", x1( startref ))
					.on('mouseover', function() {
						// tip.show;
						currentHover = "national"
						d3.select(this)
							.classed('opacity-hover',true)
							.classed('stroke-hover',true)
							.call(tip.show)
					})
					.on('mouseout',  function() {
						// tip.hide;
						currentHover = ""
						d3.select(this)
							.classed('opacity-hover',false)
							.classed('stroke-hover',false)
							.call(tip.hide)
				  })

			}

			// Update the measure rects.
			var measure = gsub.selectAll("rect.measure")
				.data([d]);

			measure.enter().append("rect")
				.attr("class", function(d, i) { return "measure"; })
				.attr("width", 0)
				.attr("height", bulletheight / 3)
				.attr("x", reverse ? x0 : 0)
				.attr("y", (( bulletheight / 2 ) - ( (bulletheight / 3)/2 )) )
			  .on('mouseover', function(d) {
				  d3.select(this)
					  .classed('opacity-hover',true)
					  .classed('stroke-hover',true)
					  .call(tip.show)
			  })
			  .on('mouseout',  function() {
				  d3.select(this)
					  .classed('opacity-hover',false)
					  .classed('stroke-hover',false)
					  .call(tip.hide)
			  })
			  .transition()
				  .duration(duration)
				  .attr("width", x1(proportion))
				  .attr("x", 0);

			// Update the national range rects.
			range.enter().append("rect")
				.attr("class","range")
				.attr("width", 0)
				.attr("height", bulletheight / 12)
				.attr("y", (( bulletheight / 2 ) - ( (bulletheight / 12)/2 )) )
				.attr("x", 0 )
			  .on('mouseover', function() {
				  tip.show;
				  d3.select(this)
					  .classed('opacity-hover',true)
					  .classed('stroke-hover',true)
					  .call(tip.show)
			  })
			  .on('mouseout',  function() {
				  tip.hide;
				  d3.select(this)
					  .classed('opacity-hover',false)
					  .classed('stroke-hover',false)
					  .call(tip.hide)
			  })
			  .transition()
				  .duration(duration)
				  .attr("x", x1( startrange ))
				  .attr("width", x1( confinv ));

			// add the toggle labels
			var label = gsub.append("g")
				.style("text-anchor", "start")
				.attr("class", "label-ul-bounds")
				.attr("transform", function(d,i) { return "translate(" + (x1(startrange) + x1(confinv) + 3)  + ",18)"; })
				//.attr("transform", function(d,i) { return "translate(195,20)"; })
			
			label.append("text")
				.attr("class", function(d){ 
				  // if($("#button-toggle-labels").hasClass("toggle-on")) { 
				  if ($("#dropdown-label").text().trim() == "Confidence Intervals") {
					  return "active";
				  } else {
					  return "inactive";
				  }
				})
				.text(function(d) { return d3.round(startrange*100,0) + "%-" + d3.round(endrange*100,0) + '%'; });

			label.append("text")
				.attr("class", function(d){
					if ($("#dropdown-label").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text(function(d){ return d3.round(proportion*100,0) + '%'; });

		}
      }); // end bulletsub.each
    }); //end bulletG.each
  }  // end of function drawChart(g)
  return drawChart;
  }
}

  function bulletRanges(d) {
    range = {"range":[]}
    console.log(range)
    startrange = d["Lower Bound 2007"];
    endrange = d["Upper Bound 2007"];
    return d.ranges;
  }

  function bulletMarkers(d) {
    return d.markers;
  }

  function bulletMeasures(d) {
    return d.measures;
  }

  function bulletTranslate(x) {
    return function(d) {
      return "translate(" + x(d) + ",0)";
    };
  }

  function bulletWidth(x) {
    var x0 = x(0);
    //console.log("x0",x0);
    return function(d) {
      //console.log(Math.abs(x(d) - x0));
      return Math.abs(x(d) - x0);
    };
  }

  function slopetranslate(x) {
    return function(d) {
      console.log(x(d));
      return "translate(" + "10," + x(d) + ")";
    };
  }

  function tickFormat(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return tickFormat;
  };

})();

/************
*************
BULLETB FUNCTION
*************
************/

function bulletB(d) {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
      width = bulletwidthB*0.90,
      height = bulletheightB,
      tickFormat = d3.format(".0%"),
      newData = [],
      rowCount = 0; // Used to apply data attribute which cotrols highlighting

  // function drawChart(g) {


    var bulletG = d3.selectAll("#d3-bulletB g"),
        axisFlag = 0; // Determine whether to add axis or gridlines
    

    bulletG.each(function(d, i) {
      var g = d3.select(this);

      var bulletsub = g.selectAll("g .bullet-sub")
          .data(d.values) // d.values --> d
        .enter()
          .append("g")
          .attr("class","bullet-sub")
          .attr("data-loc",function(){  
            i = rowCount; 
            rowCount++; 
            return "chart-loc-" + i; 
          })
          .attr("height", function(d){ return bulletheightB + bulletmarginB.top + bulletmarginB.bottom; })
          .attr("transform", function(d,i) { return "translate(0," + ((bulletheightB + bulletmarginB.top + bulletmarginB.bottom)*i) + ")"; })          

      bulletsub.each(function(d, j) {

        // Select parent nodes to add borders
        var bulletsvg = d3.select(this.parentNode.parentNode);

        // Add borders
        var bulletborder = bulletsvg.insert("rect",":first-child")
                .attr("class", "border")
                // .attr("data-loc",j)
                .attr("width",bulletcontainerB)
                .attr("height", bulletheightB + bulletmarginB.top + bulletmarginB.bottom)
                .attr("transform",function(d,i){ return "translate(0," + ( ( bulletheightB + bulletmarginB.top + bulletmarginB.bottom) * j )  + ")"; })

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)
          
        var startrange      = +d[nla12_ce_lcb95pctp]/100,
            endrange        = +d[nla12_ce_ucb95pctp]/100,
            proportion      = +d[nla12_ce_estp]/100,
            confinv         = +d[nla12_ce_confinv]/100;
            // startconfidence = +startrange - .05,
            // endconfidence   = +startconfidence + .15;

        var bullettitle = gsub.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate("+ (-bulletmarginB.left + 5) + ", " + bulletheightB / 1.5 + ")")

        bullettitle.append("text")
            .attr("class", "title indicator")
            .text(function(d) { 
				if (d[nla0712_ce_sig] === "Yes") {
					return d[nla12_ce_cat].replace(/_/g," ") + "*"; 
				} else {
					return d[nla12_ce_cat].replace(/_/g," "); 
				}
			});

        if ( d[nla12_ce_estp] == "NA" ) {
			var addNAtext = gsub.append("g")
                                .style("text-anchor", "start")
                                .attr("transform", "translate(5,21)")

                addNAtext.append("text")
                        .attr("class", "no-data")
                        .text(function(d,i) { return "No Observed Lakes"; });

			var x1 = d3.scale.linear()
				.domain([0,1])
				.range(reverse ? [width, 0] : [0, width]);

			// function for the y grid lines
			function make_gridlines() {
			  return d3.svg.axis()
				  .scale(x1)
				  .orient("bottom")
				  .ticks(5)
			}

			// Add the gridlines
			var xGrid = gsub.append("g")            
				.attr("class", "grid")
				.attr("transform", "translate(0,0)")
				.call(make_gridlines()
					.tickSize(bulletheightB)
					.tickFormat("")
					.tickPadding(10)
				);

		} else {
			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.html(function(d) {
					var d = this.data()[0];
					if (currentHover == "national") {
						return '<div class="tooltip-table" style="width:480px"><table>' +
						'<tr><td> National | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_nlb]) + '%</b> to <b>' +  r1(d[nla12_ce_nub]) + '%</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: This gray band displays the national confidence interval as context for understanding sub-national results. In this case, the national confidence interval for this estimate is ' + r1(d[nla12_ce_nlb]) + '% to ' + r1(d[nla12_ce_nub]) + '% ('+r0(d[nla12_ce_nlbu])+' to '+r0(d[nla12_ce_nubu])+').</td></tr>' +
						'</div></table>'
					} else {
						return '<div class="tooltip-table" style="width:480px"><table>' +
						'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>2012 point estimate: <b>' + r1(d[nla12_ce_estp]) + '%</b></td></tr>' +
						'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_lcb95pctp]) + '%</b> to <b>' +  r1(d[nla12_ce_ucb95pctp]) + '%</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: In 2012, EPA found that '+r1(d[nla12_ce_estp])+'% ('+r0(d[nla12_ce_estu])+') of all '+d[nla12_ce_subpopl]+' lakes are designated as '+d[nla12_ce_cat]+' for '+d[nla12_ce_indic_plain]+'. The confidence interval for this estimate is '+r1(d[nla12_ce_lcb95pctp])+'% to '+r1(d[nla12_ce_ucb95pctp])+'% ('+r0(d[nla12_ce_lcb95pctu])+' to '+r0(d[nla12_ce_ucb95pctu])+' lakes).</td></tr>' +
						'</div></table>' }
						})
				.offset([0,100])
				/*function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()-win.width()*1.1+1020];
					});*/

			var bulletsvg = d3.select("#d3-bulletB").selectAll("svg")
			bulletsvg.call(tip);

			// function for the y grid lines
			function make_gridlines() {
			  return d3.svg.axis()
				  .scale(x1)
				  .orient("bottom")
				  .ticks(5)
			}

			// Compute the new x-scale.
			var x1 = d3.scale.linear()
				.domain([0,1])
				.range(reverse ? [width, 0] : [0, width]);

			// Retrieve the old x-scale, if this is an update.
			var x0 = this.__chart__ || d3.scale.linear()
				.domain([0, Infinity])
				.range(x1.range());

			// Stash the new scale.
			this.__chart__ = x1;


			// Derive width-scales from the x-scales.
			var w0 = bulletWidth(x0),
				w1 = bulletWidth(x1);

			// console.log(axisFlag);
			// If axisFlag == 0, add the axis to the axis container
			if(axisFlag==0) {

			  var xAxis = d3.svg.axis()
				  .scale(x1)
				  .orient("top")
				  .tickSize(5)
				  .ticks(5)
				  .tickFormat(tickFormat);

			  //Add the x-axis
			  var xAxissvg = d3.select("#d3-bulletB-axis")
				  .append("svg")
				  .attr("class","axis-container")              
				  .attr("width", bulletwidthB + bulletmarginB.left + bulletmarginB.right )
				  .attr("height",20)

			  var xAxisAppend = xAxissvg.append("g")
				  .attr("transform", "translate(" + (bulletmarginB.left + 2) + ",20)")
				  .style("font-family","Arial,sans-serif")
				  .call(xAxis);

			}

			// Add the gridlines
			var xGrid = gsub.append("g")            
				.attr("class", "grid")
				.attr("transform", "translate(0,0)")
				.call(make_gridlines()
					.tickSize(bulletheightB)
					.tickFormat("")
					.tickPadding(10)
				);


			// Update the confidence rects.
			/*var confidence = gsub.selectAll("rect.confidence")
				//.data(startconfidence);
				.data([d]);

			confidence.enter().append("rect")
				.attr("class", function(d,i) { return "confidence"; })
				.attr("width", 0)
				.attr("height", (bulletheight - 10))
				.attr("y", 5)
				.attr("x", 0 )
			  .transition()
				.duration(duration)
				.attr("x", function(d) { 
				  if ( x1( startconfidence ) < 0 ) { sc = 0; } else { sc = x1( startconfidence ); }  return sc; })
				.attr("width", x1( endconfidence-startconfidence ) );*/

			// Update the national range rects.
			var range = gsub.selectAll("rect.range")
				.data([d]);

			if ( d[nla12_ce_type] != "National" ) {

				var startref      = +d[nla12_ce_nlb]/100 || 0,
					endref        = +d[nla12_ce_nub]/100 || 0;
			  
				range.enter().append("rect")
					.attr("class","national")
					.attr("width", x1( endref - startref ))
					.attr("height", bulletheightB / 1.1)
					.attr("y", (( bulletheightB / 2 ) - ( (bulletheightB / 1.1 )/2 )) )
					.attr("x", x1( startref ))
					.on('mouseover', function() {
						currentHover = "national";
						d3.select(this)
							.classed('opacity-hover',true)
							.classed('stroke-hover',true)
							.call(tip.show)
					})
					.on('mouseout',  function() {
						currentHover = "";
						d3.select(this)
							.classed('opacity-hover',false)
							.classed('stroke-hover',false)
							.call(tip.hide)
				  })

			  }

			// Update the measure rects.
			var measure = gsub.selectAll("rect.measure")
				.data([d]);

			measure.enter().append("rect")
				.attr("class", function(d, i) { 
				  if (d[nla12_ce_cat] == "Most Disturbed") return "measure hc"; 
				  else if ( d[nla12_ce_cat] == "Moderately Disturbed" ) return "measure mc"
				  else if ( d[nla12_ce_cat] == "Least Disturbed" ) return "measure lc"
				  else if ( d[nla12_ce_cat] == "Not Assessed" ) return "measure na"
				  else return "measure other"
				})
				.attr("width", 0)
				.attr("height", bulletheightB / 3)
				.attr("x", reverse ? x0 : 0)
				.attr("y", (( bulletheightB / 2 ) - ( (bulletheightB / 3) / 2 )) )
				.on('mouseover', function(d) {
				  d3.select(this)
					  .classed('opacity-hover',true)
					  .classed('stroke-hover',true)
					  .call(tip.show)
			  })
				.on('mouseout',  function() {
				  d3.select(this)
					  .classed('opacity-hover',false)
					  .classed('stroke-hover',false)
					  .call(tip.hide)
			  })
			  .transition()
				  .duration(duration)
				  .attr("width", x1(proportion))
				  .attr("x", 0);


			// Update the range rects.
			range.enter().append("rect")
				.attr("class",function(d,i) {
				  if (d[nla12_ce_cat] == "Most Disturbed") {
					return "range hc"; 
				  } else if ( d[nla12_ce_cat] == "Moderately Disturbed" ) { 
					return "range mc";
				  } else if ( d[nla12_ce_cat] == "Least Disturbed" ) { 
					return "range lc";
				  } else if ( d[nla12_ce_cat] == "Not Assessed" ) {
					return "range na";
				  } else {
					return "range other";
				  }
				})
				.attr("width", 0)
				.attr("height", bulletheightB / 12)
				.attr("y", (( bulletheightB / 2 ) - ( (bulletheightB / 12)/2 )) )
				.attr("x", 0 )
				.on('mouseover', function() {
				  tip.show;
				  d3.select(this)
					  .classed('opacity-hover',true)
					  .classed('stroke-hover',true)
					  .call(tip.show)
			  })
			  .on('mouseout',  function() {
				  tip.hide;
				  d3.select(this)
					  .classed('opacity-hover',false)
					  .classed('stroke-hover',false)
					  .call(tip.hide)
			  })
			  .transition()
				  .duration(duration)
				  .attr("x", x1( startrange ))
				  .attr("width", x1( confinv ));

			// add the toggle labels
			var label = gsub.append("g")
				.style("text-anchor", "start")
				.attr("class", "label-ul-bounds")
				.attr("transform", function(d,i) { return "translate(" + (x1(startrange) + x1(confinv) + 2)  + ",18)"; })
			
			label.append("text")
				.attr("class", function(d){ 
				  // if($("#button-toggle-labels").hasClass("toggle-on")) { 
				  if ($("#dropdown-label").text().trim() == "Confidence Intervals") {
					  return "active";
				  } else {
					  return "inactive";
				  }
				})
				.text(function(d) { return d3.round(startrange*100,0) + "%-" + d3.round(endrange*100,0) + '%'; });

			label.append("text")
				.attr("class", function(d){
					if ($("#dropdown-label").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text(function(d){ return d3.round(proportion*100,0) + '%'; });

			axisFlag++; // Increment the axis flag
		}
      }); // end bulletsub.each
    }); //end bulletG.each
//  }  // end of function drawChart(g)
//  return drawChart;
}

function bulletSI(d) {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
      width = bulletwidthSI + 5,
      height = bulletheightSI,
      tickFormat = d3.format(".0%"),
      newData = [],
      rowCount = 0; // Used to apply data attribute which cotrols highlighting

  // function drawChart(g) {


    var bulletG = d3.selectAll("#d3-bullet-si g"),
        axisFlag = 0; // Determine whether to add axis or gridlines
    

    bulletG.each(function(d, i) {
      var g = d3.select(this);

      var bulletsub = g.selectAll("g .bullet-sub")
          .data(d.values) // d.values --> d
        .enter()
          .append("g")
          .attr("class","bullet-sub")
          .attr("data-loc",function(){  
            i = rowCount; 
            rowCount++; 
            return "chart-loc-" + i; 
          })
          .attr("height", function(d){ return bulletheightSI + bulletmarginSI.top + bulletmarginSI.bottom; })
          .attr("transform", function(d,i) { return "translate(0," + ((bulletheightSI + bulletmarginSI.top + bulletmarginSI.bottom)*i) + ")"; })          

      bulletsub.each(function(d, j) {

        // Select parent nodes to add borders
        var bulletsvg = d3.select(this.parentNode.parentNode);

        // Add borders
        var bulletborder = bulletsvg.insert("rect",":first-child")
                .attr("class", "border")
                // .attr("data-loc",j)
                .attr("width",bulletwidthSI + bulletmarginSI.left + bulletmarginSI.right)
                .attr("height", bulletheightSI + bulletmarginSI.top + bulletmarginSI.bottom)
                .attr("transform",function(d,i){ return "translate(0," + ( ( bulletheightSI + bulletmarginSI.top + bulletmarginSI.bottom) * j )  + ")"; })

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)
          
        var startrange      = +d[nla12_ce_lcb95pctp]/100,
            endrange        = +d[nla12_ce_ucb95pctp]/100,
            proportion      = +d[nla12_ce_estp]/100,
            confinv         = +d[nla12_ce_confinv]/100;
            // startconfidence = +startrange - .05,
            // endconfidence   = +startconfidence + .15;

        var bullettitle = gsub.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate(-210," + bulletheightSI / 1.5 + ")")

        bullettitle.append("text")
            .attr("class", "title indicator")
            .text(function(d) { 
				if (d[nla0712_ce_sig] === "Yes") {
					return d[nla12_ce_subpopl].replace(/_/g," ") + "*"; 
				} else {
					return d[nla12_ce_subpopl].replace(/_/g," "); 
				}
			});

        if ( d[nla12_ce_estp] == "NA" ) {
			var addNAtext = gsub.append("g")
                                .style("text-anchor", "start")
                                .attr("transform", "translate(5,21)")

                addNAtext.append("text")
                        .attr("class", "no-data")
                        .text(function(d,i) { return "No Observed Lakes"; });

			var x1 = d3.scale.linear()
				.domain([0,1])
				.range(reverse ? [width, 0] : [0, width]);

			// function for the y grid lines
			function make_gridlines() {
			  return d3.svg.axis()
				  .scale(x1)
				  .orient("bottom")
				  .ticks(5)
			}

			// Add the gridlines
			var xGrid = gsub.append("g")            
				.attr("class", "grid")
				.attr("transform", "translate(0,0)")
				.call(make_gridlines()
					.tickSize(bulletheightSI)
					.tickFormat("")
					.tickPadding(10)
				);

		} else {
			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.direction(function(d){
				  var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
					  win = $(window);
				  if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/30) ) return "s";
				  else return "n";
				})
				.html(function(d) {
					var d = this.data()[0];
					if (currentHover == "national") {
						return '<div class="tooltip-table" style="width:480px"><table>' +
						'<tr><td> National | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_nlb]) + '%</b> to <b>' +  r1(d[nla12_ce_nub]) + '%</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: This gray band displays the national confidence interval as context for understanding sub-national results. In this case, the national confidence interval for this estimate is ' + r1(d[nla12_ce_nlb]) + '% to ' + r1(d[nla12_ce_nub]) + '% ('+r0(d[nla12_ce_nlbu])+' to '+r0(d[nla12_ce_nubu])+').</td></tr>' +
						'</div></table>'
					} else {
						return '<div class="tooltip-table" style="width:480px"><table>' +
						'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>2012 point estimate: <b>' + r1(d[nla12_ce_estp]) + '%</b></td></tr>' +
						'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_lcb95pctp]) + '%</b> to <b>' +  r1(d[nla12_ce_ucb95pctp]) + '%</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: In 2012, EPA found that '+r1(d[nla12_ce_estp])+'% ('+r0(d[nla12_ce_estu])+') of all '+d[nla12_ce_subpopl]+' lakes are designated as '+d[nla12_ce_cat]+' for '+d[nla12_ce_indic_plain]+'. The confidence interval for this estimate is '+r1(d[nla12_ce_lcb95pctp])+'% to '+r1(d[nla12_ce_ucb95pctp])+'% ('+r0(d[nla12_ce_lcb95pctu])+' to '+r0(d[nla12_ce_ucb95pctu])+' lakes).</td></tr>' +
						'</div></table>' }
						})
				.offset([0,100])
					/*function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()-win.width()*1.1+1020];
					});*/

			var bulletsvg = d3.select("#d3-bullet-si").selectAll("svg")
			bulletsvg.call(tip);

			// function for the y grid lines
			function make_gridlines() {
			  return d3.svg.axis()
				  .scale(x1)
				  .orient("bottom")
				  .ticks(5)
			}

			// Compute the new x-scale.
			var x1 = d3.scale.linear()
				.domain([0,1])
				.range(reverse ? [width, 0] : [0, width]);

			// Retrieve the old x-scale, if this is an update.
			var x0 = this.__chart__ || d3.scale.linear()
				.domain([0, Infinity])
				.range(x1.range());

			// Stash the new scale.
			this.__chart__ = x1;


			// Derive width-scales from the x-scales.
			var w0 = bulletWidth(x0),
				w1 = bulletWidth(x1);

			// console.log(axisFlag);
			// If axisFlag == 0, add the axis to the axis container
			if(axisFlag==0) {

			  var xAxis = d3.svg.axis()
				  .scale(x1)
				  .orient("top")
				  .tickSize(5)
				  .ticks(5)
				  .tickFormat(tickFormat);

			  //Add the x-axis
			  var xAxissvg = d3.select("#d3-bulletSI-axis")
				  .append("svg")
				  .attr("class","axis-container")              
				  .attr("width", bulletwidthSI + bulletmarginSI.left + bulletmarginSI.right )
				  .attr("height",20)

			  var xAxisAppend = xAxissvg.append("g")
				  .attr("transform", "translate(" + (bulletmarginSI.left + 2) + ",20)")
				  .style("font-family","Arial,sans-serif")
				  .call(xAxis);

			}

			// Add the gridlines
			var xGrid = gsub.append("g")            
				.attr("class", "grid")
				.attr("transform", "translate(0,0)")
				.call(make_gridlines()
					.tickSize(bulletheightSI)
					.tickFormat("")
					.tickPadding(10)
				);

			// Update the national range rects.
			var range = gsub.selectAll("rect.range")
				.data([d]);

			if ( d[nla12_ce_type] != "National" ) {

				var startref      = +d[nla12_ce_nlb]/100 || 0,
					endref        = +d[nla12_ce_nub]/100 || 0;
			  
				range.enter().append("rect")
					.attr("class","national")
					.attr("width", x1( endref - startref ))
					.attr("height", bulletheightSI / 1.1)
					.attr("y", (( bulletheightSI / 2 ) - ( (bulletheightSI / 1.1 )/2 )) )
					.attr("x", x1( startref ))
					.on('mouseover', function() {
						currentHover = "national";
						d3.select(this)
							.classed('opacity-hover',true)
							.classed('stroke-hover',true)
							.call(tip.show)
					})
					.on('mouseout',  function() {
						currentHover = "";
						d3.select(this)
							.classed('opacity-hover',false)
							.classed('stroke-hover',false)
							.call(tip.hide)
				  })

			  }

			// Update the measure rects.
			var measure = gsub.selectAll("rect.measure")
				.data([d]);

			measure.enter().append("rect")
				.attr("class", "measure")
				.attr("width", 0)
				.attr("height", bulletheightSI / 3)
				.attr("x", reverse ? x0 : 0)
				.attr("y", (( bulletheightSI / 2 ) - ( (bulletheightSI / 3)/2 )) )
				.on('mouseover', function(d) {
				  d3.select(this)
					  .classed('opacity-hover',true)
					  .classed('stroke-hover',true)
					  .call(tip.show)
			  })
				.on('mouseout',  function() {
				  d3.select(this)
					  .classed('opacity-hover',false)
					  .classed('stroke-hover',false)
					  .call(tip.hide)
			  })
			  .transition()
				  .duration(duration)
				  .attr("width", x1(proportion))
				  .attr("x", 0);


			// Update the range rects.
			range.enter().append("rect")
				.attr("class", "range")
				.attr("width", 0)
				.attr("height", bulletheightSI / 12)
				.attr("y", (( bulletheightSI / 2 ) - ( (bulletheightSI / 12)/2 )) )
				.attr("x", 0)
				.on('mouseover', function() {
				  tip.show;
				  d3.select(this)
					  .classed('opacity-hover',true)
					  .classed('stroke-hover',true)
					  .call(tip.show)
			  })
			  .on('mouseout',  function() {
				  tip.hide;
				  d3.select(this)
					  .classed('opacity-hover',false)
					  .classed('stroke-hover',false)
					  .call(tip.hide)
			  })
			  .transition()
				  .duration(duration)
				  .attr("x", x1( startrange ))
				  .attr("width", x1( confinv ));

			// add the toggle labels
			var label = gsub.append("g")
				.style("text-anchor", "start")
				.attr("class", "label-ul-bounds")
				.attr("transform", function(d,i) { return "translate(" + (x1(startrange) + x1(confinv) + 5)  + ",20)"; })
			
			label.append("text")
				.attr("class", function(d){ 
				  // if($("#button-toggle-labels").hasClass("toggle-on")) { 
				  if ($("#dropdown-label-si").text().trim() == "Confidence Intervals") {
					  return "active";
				  } else {
					  return "inactive";
				  }
				})
				.text(function(d) { return d3.round(startrange*100,0) + "%-" + d3.round(endrange*100,0) + '%'; });

			label.append("text")
				.attr("class", function(d){
					if ($("#dropdown-label-si").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text(function(d){ return d3.round(proportion*100,0) + '%'; });

			axisFlag++; // Increment the axis flag
		}
      }); // end bulletsub.each
    }); //end bulletG.each
//  }  // end of function drawChart(g)
//  return drawChart;
}

  function bulletRanges(d) {
    range = {"range":[]}
    console.log(range)
    startrange = d["Lower Bound 2007"];
    endrange = d["Upper Bound 2007"];
    return d.ranges;
  }

  function bulletMarkers(d) {
    return d.markers;
  }

  function bulletMeasures(d) {
    return d.measures;
  }

  function bulletTranslate(x) {
    return function(d) {
      return "translate(" + x(d) + ",0)";
    };
  }

  function bulletWidth(x) {
    var x0 = x(0);
    //console.log("x0",x0);
    return function(d) {
      //console.log(Math.abs(x(d) - x0));
      return Math.abs(x(d) - x0);
    };
  }

  function slopetranslate(x) {
    return function(d) {
      console.log(x(d));
      return "translate(" + "10," + x(d) + ")";
    };
  }

  function tickFormat(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return tickFormat;
  };