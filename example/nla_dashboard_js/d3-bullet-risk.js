var r0 = d3.format(",.0f"),
	r1 = d3.format(",.1f");

function bulletRelExtent(d) {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
      width = relextentwidth,
      height = relextentheight,
      tickFormat = d3.format(".0%"),
      newData = [],
      rowCount = 0; // Used to apply data attribute which cotrols highlighting

  /************
  *************
  BULLET FUNCTION
  *************
  ************/
  // function drawChart(g) {


    var bulletG = d3.selectAll("#d3-bullet-rel-extent g"),
        axisFlag = 0; // Determine whether to add axis or gridlines
    

    bulletG.each(function(d, i) {
      var g = d3.select(this);

      var bulletsub = g.selectAll("g .bullet-sub")
          .data(d.values) // d.values --> d
      bulletsub.enter()
          .append("g")
          .attr("class","bullet-sub")
          .attr("data-loc",function(){  
            i = rowCount; 
            rowCount++; 
            return "chart-loc-" + i; 
          })
          .attr("height", function(d){ return relextentheight + relextentmargin.top + relextentmargin.bottom; })
          .attr("transform", function(d,i) { return "translate(0," + ((relextentheight + relextentmargin.top + relextentmargin.bottom)*i) + ")"; })

      bulletsub.each(function(d, j) {

        // Select parent nodes to add borders
        var bulletsvg = d3.select(this.parentNode.parentNode);

        // Add borders
        var bulletborder = bulletsvg.insert("rect",":first-child")
                .attr("class", "border")
                // .attr("data-loc",j)
                .attr("width", relextentcontainer - 65)
                .attr("height", relextentheight + relextentmargin.top + relextentmargin.bottom)
                .attr("transform",function(d,i){ return "translate(62," + ( ( relextentheight + relextentmargin.top + relextentmargin.bottom) * j )  + ")"; })

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)
          
        var startrange      = +d[nla12_ce_lcb95pctp]/100 || 0,
            endrange        = +d[nla12_ce_ucb95pctp]/100 || 0,
            proportion      = +d[nla12_ce_estp]/100 || 0;

        var bullettitle = gsub.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate(-145," + relextentheight / 1.5 + ")")

        bullettitle.append("text")
            .attr("class", "title indicator")
            .text(function(d) { 
				return d[nla12_ce_indic_plain]; 
			});

        var tip = d3.tip()
			.attr('class', 'd3-tip')
			.direction(function(d){
				var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
					win = $(window);
				if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/relextentheight) ) return "s";
				else return "n";
			})
			.html(function(d) {
				var d = this.data()[0];
				return '<div class="tooltip-table"><table>' +
				'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + '</td></tr>' +
				'<tr><td>2012 point estimate: <b>' + r1(d[nla12_ce_estp]) + '%</b></td></tr>' +
				'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_lcb95pctp]) + '%</b> to <b>' +  r1(d[nla12_ce_ucb95pctp]) + '%</b></td></tr>' +
				'<tr class="blank-row"><td> </td></tr>' +
				'<tr><td>Explanation: In 2012, EPA found that approximately '+ r1(d[nla12_ce_estp]) +'% ('+ r0(d[nla12_ce_estu]) +') of all ' + d[nla12_ce_subpopl] +' lakes are designated as '+ d[nla12_ce_cat] +' for '+ d[nla12_ce_indic_plain] +'. The confidence interval for this estimate is ' + r1(d[nla12_ce_lcb95pctp]) + '% to '+ r1(d[nla12_ce_ucb95pctp]) +'% ('+ r0(d[nla12_ce_lcb95pctu]) + ' to ' + r0(d[nla12_ce_ucb95pctu]) + ' lakes).</td></tr>' +
				'</div></table>' })
			.offset([0,100])
				/*function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()-win.width()*1.1+1020];
					});*/

        var bulletsvg = d3.select("#d3-bullet-rel-extent").selectAll("svg")
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
            .domain([0,0.8])
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
          var xAxissvg = d3.select("#d3-bullet-rel-extent-axis")
              .append("svg")
              .attr("class","axis-container")              
              .attr("width", relextentwidth + relextentmargin.left + relextentmargin.right )
			  .attr("height",20)
			  
			d3.select("#d3-bullet-rel-extent-axis").attr("style","width:393px");

          var xAxisAppend = xAxissvg.append("g")
              .attr("transform", "translate(" + (relextentmargin.left + 2) + ",20)")
			  .style("font-family","Arial,sans-serif")
              .call(xAxis);

			axisFlag++; // Increment the axis flag

        }

        // Add the gridlines
        var xGrid = gsub.append("g")            
            .attr("class", "grid")
            .attr("transform", "translate(0,0)")
            .call(make_gridlines()
                .tickSize(relextentheight)
                .tickFormat("")
                .tickPadding(10)
            );

		if ( proportion == 0 ) {
			var addNAtext = gsub.append("g")
						.style("text-anchor", "start")
						.attr("transform", relextentheight > 30 ? "translate(5,27)" : "translate(5,21)")

				addNAtext.append("text")
						.attr("class", "no-data")
						.text(function(d,i) { return "No Observed Lakes"; });
		} else {
			// Update the national range rects.
			var range = gsub.selectAll("rect.range")
				.data([d]);


			// Update the measure rects.
			var measure = gsub.selectAll("rect.measure")
				.data([d]);

			measure.enter().append("rect")
				.attr("class", "measure relextent")
				.attr("width", 0)
				.attr("height", relextentheight >= 30 ? 10 : relextentheight / 3)
				.attr("x", reverse ? x0 : 0)
				.attr("y", relextentheight >= 30 ? 10 : (( relextentheight / 2 ) - ( (relextentheight / 3)/2 )) )
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
				  .attr("width", x1(proportion) || 0)
				  .attr("x", 0);

			measure.exit().remove();

			// Update the range rects.
			range.enter().append("rect")
				.attr("class", "range relextent")
				.attr("width", 0)
				.attr("height", relextentheight >= 30 ? 2.5 : relextentheight / 12)
				.attr("y", relextentheight >= 30 ? 13.75 : (( relextentheight / 2 ) - ( (relextentheight / 12)/2 )) )
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
				  .attr("x", x1( startrange ) || 0)
				  .attr("width", x1( endrange-startrange ) || 0);

			range.exit().remove();

			// add the toggle labels
			var label = gsub.append("g")
				.style("text-anchor", "start")
				.attr("class", "label-ul-bounds")
				.attr("transform", function(d,i) { return "translate(3,35)"; })
			
			label.append("text")
				.attr("class", function(d){ 
				  if ($("#dropdown-label-risk").text().trim() == "Confidence Intervals") {
					  return "active";
				  } else {
					  return "inactive";
				  }
				})
				.text(function(d) { return d3.round(startrange*100,0) + "% - " + d3.round(endrange*100,0) + '%'; });

			label.append("text")
				.attr("class", function(d){
					if ($("#dropdown-label-risk").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text(function(d){ return d3.round(proportion*100,0) + '%'; });

			label.append("text")
				.attr("x", 52)
				.attr("class", function(d){
					if ($("#dropdown-label-risk").text().trim() == "Confidence Intervals") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text("(Conf. Interval)");

			label.append("text")
				.attr("x", 25)
				.attr("class", function(d){
					if ($("#dropdown-label-risk").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text("(Point Estimate)");			

		}; // end if/else
      }); // end bulletsub.each
    }); //end bulletG.each
//  }  // end of function drawChart(g)
//  return drawChart;
}

function bulletRelRisk(d) {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
      width = relriskwidth,
      height = relriskheight,
      tickFormat = d3.format(".0"),
      newData = [],
      rowCount = 0; // Used to apply data attribute which cotrols highlighting

  /************
  *************
  BULLET FUNCTION
  *************
  ************/
  // function drawChart(g) {


    var bulletG = d3.selectAll("#d3-bullet-rel-risk g"),
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
          .attr("height", function(d){ return relriskheight + relriskmargin.top + relriskmargin.bottom; })
          .attr("transform", function(d,i) { return "translate(0," + ((relriskheight + relriskmargin.top + relriskmargin.bottom)*i) + ")"; })          

      bulletsub.each(function(d, j) {

        // Select parent nodes to add borders
        var bulletsvg = d3.select(this.parentNode.parentNode);

        // Add borders
        var bulletborder = bulletsvg.insert("rect",":first-child")
                .attr("class", "border")
                // .attr("data-loc",j)
                .attr("width",relriskcontainer - 3)
                .attr("height", relriskheight + relriskmargin.top + relriskmargin.bottom)
                .attr("transform",function(d,i){ return "translate(0," + ( ( relriskheight + relriskmargin.top + relriskmargin.bottom) * j )  + ")"; })

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)
          
        var startrange      = +d[nla12_rel_risk_lcb95pct] || 0,
            endrange        = +d[nla12_rel_risk_ucb95pct] || 0,
            proportion      = +d[nla12_rel_risk_estimate] || 0;

        var tip = d3.tip()
			.attr('class', 'd3-tip')
			.direction(function(d){
				var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
					win = $(window);
				if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/relriskheight) ) return "s";
				else return "n";
			})

			.html(function(d) {
				var d = this.data()[0],
					relriskstr = r1(proportion) > 1 ? 'EPA found that when '+ d[nla12_rel_risk_stressor_plain] +' is present at Most Disturbed levels, '+ d[nla12_rel_risk_response_plain] +' are '+ r1(d[nla12_rel_risk_estimate]) +' times more likely to be in a Most Disturbed condition.' : 'no clear association was found between a Most Disturbed condition for '+ d[nla12_rel_risk_response_plain] +' and a Most Disturbed condition for '+ d[nla12_rel_risk_stressor_plain] +'.'
              return '<div class="tooltip-table"><table>' +
				'<tr><td>' + d[nla12_rel_risk_subpop_plain] +' | '+ d[nla12_rel_risk_stressor_plain] +' | '+ d[nla12_rel_risk_response_plain] +'</td></tr>' +
				'<tr><td>2012 point estimate: <b>' + r1(d[nla12_rel_risk_estimate]) + '</b></td></tr>' +
				'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_rel_risk_lcb95pct]) + '</b> to <b>' +  r1(d[nla12_rel_risk_ucb95pct]) + '</b></td></tr>' +
				'<tr class="blank-row"><td> </td></tr>' +
				'<tr><td>Explanation: In 2012, '+ relriskstr +' The confidence interval for this estimate is ' + r1(d[nla12_rel_risk_lcb95pct]) + ' to '+ r1(d[nla12_rel_risk_ucb95pct]) +'.</td></tr>' +
				'</div></table>' })
            .offset([0, 0]);

        var bulletsvg = d3.select("#d3-bullet-rel-risk").selectAll("svg")
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
            .domain([0,5])
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
          var xAxissvg = d3.select("#d3-bullet-rel-risk-axis")
              .append("svg")
              .attr("class","axis-container")              
              .attr("width", relriskcontainer)
			  .attr("height",20);
			  
			d3.select("#d3-bullet-rel-risk-axis").attr("style","width:175px");

          var xAxisAppend = xAxissvg.append("g")
              .attr("transform", "translate(" + (relriskmargin.left + 4) + ",20)")
			  .style("font-family","Arial,sans-serif")
              .call(xAxis);

			axisFlag++; // Increment the axis flag
        }

        // Add the gridlines
        var xGrid = gsub.append("g")            
            .attr("class", "grid")
            .attr("transform", "translate(0,0)")
            .call(make_gridlines()
                .tickSize(relriskheight)
                .tickFormat("")
                .tickPadding(10)
            );

		if (d[nla12_rel_risk_estimate] == "NA" || d[nla12_rel_risk_lcb95pct] == "NA" || d[nla12_rel_risk_lcb95pct] == "NA") {
			var addNAtext = gsub.append("g")
					.style("text-anchor", "start")
					.attr("transform", relriskheight > 30 ? "translate(65,27)" : "translate(65,21)")

			addNAtext.append("text")
					.attr("class", "no-data")
					.text(function(d,i) { return "N/A"; });
		} else {
			// Update the national range rects.
			var range = gsub.selectAll("rect.range")
				.data([d]);

			// Update the measure rects.
			var measure = gsub.selectAll("rect.measure")
				.data([d]);

			measure.enter().append("rect")
				.attr("class", "measure relrisk")
				.attr("width", 0)
				.attr("height", relriskheight >= 30 ? 10 : relriskheight / 3)
				.attr("x", reverse ? x0 : 0)
				.attr("y", relriskheight >= 30 ? 10 : (( relriskheight / 2 ) - ( (relriskheight / 3)/2 )) )
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
				  .attr("width", x1(proportion) < (relriskcontainer - 3) ? x1(proportion) : (relriskcontainer - 3))
				  .attr("x", 0);

			measure.exit().remove();
			
			// Update the range rects.
			range.enter().append("rect")
				.attr("class", "range relrisk")
				.attr("width", 0)
				.attr("height", relriskheight >= 30 ? 2.5 : relriskheight / 12)
				.attr("y", relriskheight >= 30 ? 13.75 : (( relriskheight / 2 ) - ( (relriskheight / 12)/2 )) )
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
				  .attr("width", x1( startrange ) + x1( endrange-startrange ) < (relriskcontainer - 3) ? x1( endrange-startrange ) : (relriskcontainer - 3) - x1( startrange ) > 0 ? (relriskcontainer - 3) - x1( startrange ) : 0 );

				range.exit().remove();

			// add the toggle labels
			var label = gsub.append("g")
				.style("text-anchor", "start")
				.attr("class", "label-ul-bounds")
				.attr("transform", "translate(3,35)")

			label.append("rect")
				.attr("fill", "rgba(255,255,255,0.8)")
				.attr("x", 15)
				.attr("y", -10)
				.attr("height", 12)
				.attr("width", 12)
				.attr("class", function(d){
				  if ($("#dropdown-label-risk").text().trim() != "None") {
					  return "active";
				  } else {
					  return "inactive";
				  }
				});

			label.append("text")
				.attr("class", function(d){ 
				  // if($("#button-toggle-labels").hasClass("toggle-on")) { 
				  if ($("#dropdown-label-risk").text().trim() == "Confidence Intervals") {
					  return "active";
				  } else {
					  return "inactive";
				  }
				})
				.text(function(d) { return startrange.toFixed(1) + " - " + endrange.toFixed(1); });

			label.append("text")
				.attr("class", function(d){
					if ($("#dropdown-label-risk").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text(function(d){ return proportion.toFixed(1); });

			label.append("text")
				.attr("x", 55)
				.attr("class", function(d){
					if ($("#dropdown-label-risk").text().trim() == "Confidence Intervals") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text("(Conf. Interval)");

			label.append("text")
				.attr("x", 27)
				.attr("class", function(d){
					if ($("#dropdown-label-risk").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text("(Point Estimate)");

		};// end if/else
      }); // end bulletsub.each
    }); //end bulletG.each
//  }  // end of function drawChart(g)
//  return drawChart;
}

function bulletAttrRisk(d) {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
      width = attrriskwidth - 30,
      height = attrriskheight,
      tickFormat = d3.format(".0%"),
      newData = [],
      rowCount = 0; // Used to apply data attribute which cotrols highlighting

  /************
  *************
  BULLET FUNCTION
  *************
  ************/
  // function drawChart(g) {


    var bulletG = d3.selectAll("#d3-bullet-attr-risk g"),
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
          .attr("height", function(d){ return attrriskheight + attrriskmargin.top + attrriskmargin.bottom; })
          .attr("transform", function(d,i) { return "translate(0," + ((attrriskheight + attrriskmargin.top + attrriskmargin.bottom)*i) + ")"; })          

      bulletsub.each(function(d, j) {

        // Select parent nodes to add borders
        var bulletsvg = d3.select(this.parentNode.parentNode);

        // Add borders
        var bulletborder = bulletsvg.insert("rect",":first-child")
                .attr("class", "border")
                // .attr("data-loc",j)
                .attr("width",attrriskcontainer - 3)
                .attr("height", attrriskheight + attrriskmargin.top + attrriskmargin.bottom)
                .attr("transform",function(d,i){ return "translate(0," + ( ( attrriskheight + attrriskmargin.top + attrriskmargin.bottom) * j )  + ")"; })

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)
          
        var startrange      = +d[nla12_attr_risk_lcb95pct] || 0,
            endrange        = +d[nla12_attr_risk_ucb95pct] || 0,
            proportion      = +d[nla12_attr_risk_estimate] || 0;

        var tip = d3.tip()
			.attr('class', 'd3-tip')
			.direction(function(d){
				var loc = $(d.node().parentNode).attr("data-loc").substr(10,2) ,
					win = $(window);
				if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/attrriskheight) ) return "s";
				else return "n";
			})

			.html(function(d) {
				var d = this.data()[0],
					attrriskstr = r1(proportion*100) > 0 ? 'EPA found that the number of lakes in most disturbed conditions for '+d[nla12_attr_risk_response_plain]+' could be reduced by approximately '+r1(d[nla12_attr_risk_estimate]*100)+'% if lakes with '+d[nla12_attr_risk_stressor_plain]+' were improved to moderate or least disturbed conditions. The confidence interval associated with this estimate is '+r1(d[nla12_attr_risk_lcb95pct]*100)+'% to '+r1(d[nla12_attr_risk_ucb95pct]*100)+'%.' : 'the attributable risk point estimate is '+r1(d[nla12_attr_risk_estimate]*100)+'% with a confidence interval of '+r1(d[nla12_attr_risk_lcb95pct]*100)+'% to '+r1(d[nla12_attr_risk_ucb95pct]*100)+'%. No clear association was found between a Most Disturbed condition for '+d[nla12_attr_risk_response_plain]+' and '+d[nla12_attr_risk_stressor_plain]+'.'
              return '<div class="tooltip-table"><table>' +
				'<tr><td>' + d[nla12_attr_risk_subpop_plain] +' | '+ d[nla12_attr_risk_stressor_plain] +' | '+ d[nla12_attr_risk_response_plain] +'</td></tr>' +
				'<tr><td>2012 point estimate: <b>' + r1(d[nla12_attr_risk_estimate]*100) + '%</b></td></tr>' +
				'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_attr_risk_lcb95pct]*100) + '%</b> to <b>' +  r1(d[nla12_attr_risk_ucb95pct]*100) + '%</b></td></tr>' +
				'<tr class="blank-row"><td> </td></tr>' +
				'<tr><td>Explanation: In 2012, '+ attrriskstr +'</td></tr>' +
				'</div></table>' })
            .offset(function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()+win.width()-1020];
					});

        var bulletsvg = d3.select("#d3-bullet-attr-risk").selectAll("svg")
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
            .domain([0,0.8])
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
          var xAxissvg = d3.select("#d3-bullet-attr-risk-axis")
              .append("svg")
              .attr("class","axis-container")              
              .attr("width", attrriskcontainer + 10 )
			  .attr("height",20)

          var xAxisAppend = xAxissvg.append("g")
              .attr("transform", "translate(" + (attrriskmargin.left + 14) + ",20)")
			  .style("font-family","Arial,sans-serif")
              .call(xAxis);

		  axisFlag++; // Increment the axis flag

        }

        // Add the gridlines
        var xGrid = gsub.append("g")            
            .attr("class", "grid")
            .attr("transform", "translate(0,0)")
            .call(make_gridlines()
                .tickSize(attrriskheight)
                .tickFormat("")
                .tickPadding(10)
            );

		if ( proportion < 0 && startrange < 0 && endrange < 0 ) {
			var addNAtext = gsub.append("g")
						.style("text-anchor", "start")
						.attr("transform", attrriskheight > 30 ? "translate(5,27)" : "translate(5,21)")
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


				addNAtext.append("text")
						.attr("class", "no-data")
						.text(function(d,i) { return "All values below zero"; });



		} else {
			// Update the national range rects.
			var range = gsub.selectAll("rect.range")
				.data([d]);

			// Update the measure rects.
			var measure = gsub.selectAll("rect.measure")
				.data([d]);

			measure.enter().append("rect")
				.attr("class", "measure attrrisk")
				.attr("width", 0)
				.attr("height", attrriskheight >= 30 ? 10 : attrriskheight / 3)
				.attr("x", reverse ? x0 : 0)
				.attr("y", attrriskheight >= 30 ? 10 : (( attrriskheight / 2 ) - ( (attrriskheight / 3)/2 )) )
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
					.attr("width", proportion > 0 ? x1(proportion) > attrriskcontainer - 3 ? attrriskcontainer - 3 : x1(proportion) : 0)

			measure.exit().remove();

			// Update the range rects.
			range.enter().append("rect")
				.attr("class", "range attrrisk")
				.attr("width", 0)
				.attr("height", attrriskheight >= 30 ? 2.5 : attrriskheight / 12)
				.attr("y", attrriskheight >= 30 ? 13.75 : (( attrriskheight / 2 ) - ( (attrriskheight / 12)/2 )) )
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
				  .attr("x", x1( startrange ) > 0 ? x1( startrange ) : 0)
				  .attr("width", endrange-startrange > 0 ? x1( startrange ) > 0 ? x1( endrange-startrange ) : x1( endrange-startrange ) + x1( startrange ) < 0 ? 0 : x1( endrange-startrange ) + x1( startrange ) : 0);

			range.exit().remove();

			// add the toggle labels
			var label = gsub.append("g")
				.style("text-anchor", "start")
				.attr("class", "label-ul-bounds")
				.attr("transform", "translate(3,35)")
			
			label.append("text")
				.attr("class", function(d){ 
				  // if($("#button-toggle-labels").hasClass("toggle-on")) { 
				  if ($("#dropdown-label-risk").text().trim() == "Confidence Intervals") {
					  return "active";
				  } else {
					  return "inactive";
				  }
				})
				.text(function(d) { return d3.round(d[nla12_attr_risk_lcb95pct]*100,0) + "% - " + d3.round(d[nla12_attr_risk_ucb95pct]*100,0) + '%'; });

			label.append("text")
				.attr("class", function(d){
					if ($("#dropdown-label-risk").text().trim() == "Point Estimate") {
						return "active";
					} else {
						return "inactive";
					}
				})
				.text(function(d){ return d3.round(d[nla12_attr_risk_estimate]*100,0) + '%'; });

		label.append("text")
			.attr("x", 70)
			.attr("class", function(d){
				if ($("#dropdown-label-risk").text().trim() == "Confidence Intervals") {
					return "active";
				} else {
					return "inactive";
				}
			})
			.text("(Conf. Interval)");

		label.append("text")
			.attr("x", 25)
			.attr("class", function(d){
				if ($("#dropdown-label-risk").text().trim() == "Point Estimate") {
					return "active";
				} else {
					return "inactive";
				}
			})
			.text("(Point Estimate)");			

		  } // end if/else 
      }); // end bulletsub.each
    }); //end bulletG.each
//  }  // end of function drawChart(g)
//  return drawChart;
}

function bulletrelext(d) {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
	  rowCount = 0,
	  width = relriskwidth,
      height = relriskheight;

  /************
  *************
  BULLET FUNCTION
  *************
  ************/
  // function drawChart(g) {

    var x1 = d3.scale.linear()
            .domain([0,5])
            .range(reverse ? [width, 0] : [0, width]);

    var bulletG = d3.selectAll("#d3-bullet-rel-risk-ext g");

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
          .attr("height", function(d){ return relriskheight + relriskmargin.top + relriskmargin.bottom; })
          .attr("transform", function(d,i) { return "translate(-1," + ((relriskheight + relriskmargin.top + relriskmargin.bottom)*i) + ")"; })

      bulletsub.each(function(d, j) {

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)
          
        var startrange      = +d[nla12_rel_risk_lcb95pct] || 0,
            endrange        = +d[nla12_rel_risk_ucb95pct] || 0,
            proportion      = +d[nla12_rel_risk_estimate] || 0;

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {
				  var d = this.data();
				  return 'Bello!' })
			.offset([0, 0]);

        var bulletsvg = d3.select("#d3-bullet-rel-risk-ext").selectAll("svg")
        bulletsvg.call(tip);

		// Update the national range rects.
		var range = gsub.selectAll("rect.range")
			.data([d]);

		// Update the measure rects.
		var measure = gsub.selectAll("rect.measure")
			.data([d]);

        measure.enter().append("rect")
			.attr("fill", "#fff")
			.attr("stroke","#999")
			.attr("stroke-dasharray","2,1")
            .attr("width", 0)
            .attr("height", relriskheight >= 30 ? 10 : relriskheight / 3)
            .attr("x", 0)
            .attr("y", 12)
			.transition()
				.duration(duration*2)
				.attr("width", x1(proportion) > (relriskcontainer - 3) ? 10 : 0)

		measure.exit().remove();

		range.enter().append("line")
			.attr("x1", 0)
			.attr("y1", relriskheight >= 30 ? 16.5 : relriskheight / 2 + 2)
			.attr("x2", 0)
			.attr("y2", relriskheight >= 30 ? 16.5 : relriskheight / 2 + 2)
			.attr("stroke", "#333")
			.attr("stroke-width", 1)
			.attr("stroke-dasharray","2,1")
			.transition()
				.duration(duration*2)
				.attr("x2", x1( startrange ) + x1( endrange-startrange ) > (relriskcontainer - 3) ? 16 : 0)
				
		range.enter().append("line")
			.attr("x1", 16)
			.attr("y1", relriskheight >= 30 ? 16.5 : relriskheight / 2 + 2)
			.attr("x2", 16)
			.attr("y2", relriskheight >= 30 ? 16.5 : relriskheight / 2 + 2)
			.attr("stroke", "#333")
			.attr("stroke-width", 1)
			.transition()
				.duration(duration*2)
				.attr("y1", x1( startrange ) + x1( endrange-startrange ) > (relriskcontainer - 3) ? relriskheight >= 30 ? 13.5 : relriskheight / 2 - 1 : 0)
				.attr("y2", x1( startrange ) + x1( endrange-startrange ) > (relriskcontainer - 3) ? relriskheight >= 30 ? 20 : relriskheight / 2 + 5 : 0)

		range.exit().remove();
		
      }); // end bulletsub.each
    }); //end bulletG.each
}

function bulletattrext(d) {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 500,
	  rowCount = 0,
	  width = attrriskwidth,
      height = attrriskheight;

  /************
  *************
  BULLET FUNCTION
  *************
  ************/
  // function drawChart(g) {

    var x1 = d3.scale.linear()
            .domain([0,0.98])
            .range(reverse ? [width, 0] : [0, width]);

    var bulletG = d3.selectAll("#d3-bullet-attr-risk-ext g");

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
          .attr("height", function(d){ return attrriskheight + attrriskmargin.top + attrriskmargin.bottom; })
          .attr("transform", function(d,i) { return "translate(-1," + ((attrriskheight + attrriskmargin.top + attrriskmargin.bottom)*i) + ")"; })

      bulletsub.each(function(d, j) {

        // Select this element to add small multiple
        var gsub = d3.select(this);
        // console.log(gsub)
          
        var startrange      = +d[nla12_attr_risk_lcb95pct] || 0,
            endrange        = +d[nla12_attr_risk_ucb95pct] || 0,
            proportion      = +d[nla12_attr_risk_estimate] || 0;

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {
				  var d = this.data();
				  return 'Bello!' })
			.offset([0, 0]);

        var bulletsvg = d3.select("#d3-bullet-rel-risk-ext").selectAll("svg")
        bulletsvg.call(tip);

		// Update the national range rects.
		var range = gsub.selectAll("rect.range")
			.data([d]);

		// Update the measure rects.
		var measure = gsub.selectAll("rect.measure")
			.data([d]);

		measure.enter().append("rect")
			.attr("fill", "#fff")
			.attr("stroke","#999")
			.attr("stroke-dasharray","2,1")
			.attr("width", 0)
			.attr("height", attrriskheight >= 30 ? 10 : attrriskheight / 3)
			.attr("x", 0)
			.attr("y", 12)
			.transition()
				.duration(duration*2)
				.attr("width", x1(proportion) > (attrriskcontainer - 3) ? 10 : 0)

		measure.exit().remove();

		range.enter().append("line")
			.attr("x1", 0)
			.attr("y1", attrriskheight >= 30 ? 16.5 : attrriskheight / 2 + 2)
			.attr("x2", 0)
			.attr("y2", attrriskheight >= 30 ? 16.5 : attrriskheight / 2 + 2)
			.attr("stroke", "#333")
			.attr("stroke-width", 1)
			.attr("stroke-dasharray","2,1")
			.transition()
				.duration(duration*2)
				.attr("x2", x1( startrange ) + x1( endrange-startrange ) > (attrriskcontainer - 3) ? 16 : 0)

		range.enter().append("line")
			.attr("x1", 16)
			.attr("y1", attrriskheight >= 30 ? 16.5 : attrriskheight / 2 + 2)
			.attr("x2", 16)
			.attr("y2", attrriskheight >= 30 ? 16.5 : attrriskheight / 2 + 2)
			.attr("stroke", "#333")
			.attr("stroke-width", 1)
			.transition()
				.duration(duration*2)
				.attr("y1", x1( startrange ) + x1( endrange-startrange ) > (attrriskcontainer - 3) ? attrriskheight >= 30 ? 13.5 : attrriskheight / 2 - 1 : 0)
				.attr("y2", x1( startrange ) + x1( endrange-startrange ) > (attrriskcontainer - 3) ? attrriskheight >= 30 ? 20 : attrriskheight / 2 + 5 : 0)

		range.exit().remove();

      }); // end bulletsub.each
    }); //end bulletG.each
}