function slope(d) {

    var duration = 500,
    tickFormat = d3.format(".0%"),
    radius = 3,
    slopeG = d3.selectAll("#d3-slope g"),
    rowCount = 0,
    axisFlag = 0;

    slopeG.each(function(d,i) { 
    // console.log("slopedata",d)
        var g = d3.select(this);

        var slopesub = g.selectAll("g .slope-sub")
                .data(d.values)
            .enter()
                  .append("g")
                  .attr("class","slope-sub")
                  .attr("data-loc",function(){  
                    i = rowCount; 
                    rowCount++; 
                    return "chart-loc-" + i; 
                  })
                  .attr("height", function(d){ return slopeheight + slopemargin.top + slopemargin.bottom; })
                  .attr("transform", function(d,i) { return "translate(0," + ((slopeheight + slopemargin.top + slopemargin.bottom)*i) + ")"; })          

        slopesub.each(function(d,j) {

            var slopesvg = d3.select(this.parentNode.parentNode);

            var slopeborder = slopesvg.insert("rect",":first-child")
                    .attr("class", "border")
                    // .attr("data-loc",j)
                    .attr("width",slopecontainer)
                    .attr("height", slopeheight + slopemargin.top + slopemargin.bottom)
                    .attr("transform",function(d){ return "translate(0," + ( (slopeheight + slopemargin.top + slopemargin.bottom) * j )  + ")"; })

			// If axisFlag == 0, add the axis to the axis container
			if(axisFlag==0) {

				var yScale = d3.scale.linear()
                  .domain([100,0])
                  .range([0,slopeheight]);

				var xAxis = d3.svg.axis()
				  .scale(yScale)
				  .orient("top")
				  .tickSize(0)
				  .ticks(0)
				  .tickFormat(tickFormat);

				//Add the x-axis
				var xAxissvg = d3.select("#d3-slope-axis")
				  .append("svg")
				  .attr("class","axis-container")              
				  .attr("width", slopewidth + slopemargin.left + slopemargin.right )

				var xAxisAppend = xAxissvg.append("g")
				  .attr("transform", "translate(" + slopemargin.left + ",20)")
				  .call(xAxis);
				  
				axisFlag++;

			}
			
			var gsub = d3.select(this);

            //Check for Change Estimate Measure. 
            //If no measures exist, return "N/A" instead of chart.
			if ( d[nla0712_ce_estp1] == "NA" || d[nla0712_ce_estp2] == "NA") {
				var addNAtext = gsub.append("g")
						.style("text-anchor", "start")
						.attr("transform", "translate(7,17)")

					addNAtext.append("text")
						.attr("class", "no-data")
						.text(function(d,i) { return "N/A"; });
			} else {

                var startSlope  = +d[nla0712_ce_estp1],
                    endSlope    = +d[nla0712_ce_estp2];
                    /*barend      = (+d[nla0712_ce_ucb95pctp2] - +d[nla0712_ce_ucb95pctp1]),
                    barstart    = (+d[nla0712_ce_lcb95pctp2] - +d[nla0712_ce_lcb95pctp1]),
                    barwidth    = Math.abs(barstart - barend);*/

                    // console.log("startSlope",startSlope);
                    // console.log("endSlope",endSlope);

                var tip = d3.tip()
                        .attr('class', 'd3-tip')
						.direction(function(d){
						  var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
							  win = $(window);
						  if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/30) ) return "s";
						  else return "n";
						})
                        .html(function(d) { 
							var d = this.data()[0],
								change = +d[nla0712_ce_estp1] > +d[nla0712_ce_estp2] ? "decreased" : "increased",
								sig = d[nla0712_ce_sig] == "No" ? "is not" : "is";

							return '<div class="tooltip-table"><table>' +
							'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
							'<tr><td>2007 point estimate: <b>' + r1(d[nla0712_ce_estp1]) + '%</b></td></tr>' +
							'<tr><td>2012 point estimate: <b>' + r1(d[nla0712_ce_estp2]) + '%</b></td></tr>' +
							'<tr><td>Statistical significance: <b>' + d[nla0712_ce_sig] + '</b></td></tr>' +
							'<tr class="blank-row"><td> </td></tr>' +
							'<tr><td>Explanation: For '+d[nla12_ce_subpopl]+' lakes 4 hectares and larger, the percentage designated as '+d[nla12_ce_cat]+' '+change+' from '+r1(d[nla0712_ce_estp1])+'% in 2007 to '+r1(d[nla0712_ce_estp2])+'% in 2012. This '+sig+' a statistically significant change. </td></tr>' +
							'</div></table>'
			            })
				.offset([0, 0]);

                var slopesvg = d3.select("#d3-slope").selectAll("svg");
                
                slopesvg.call(tip);

                // function for the y grid lines
                function make_y_axis() {
                  return d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(3)
                }

                // Compute the new slope y-scale.
                var yScale = d3.scale.linear()
                  .domain([100,0])
                  .range([0,slopeheight]);

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(3)
                    .tickSize(0)
                    .tickFormat(tickFormat);
           
                // Draw lines
                var lines = gsub.selectAll("line")
                    .data([d]);

			var slope = lines.enter()
				.append("line")
				  .attr("x1", radius + slopemargin.left - radius)
				  .attr("x2", radius + slopemargin.left)
				  .attr("y1", yScale(startSlope))
				  .attr("y2", yScale(startSlope))
				.on('mouseover', function(d) {
				  d3.select(this)
					.classed('opacity-hover',true)
					.classed('stroke-hover',true)
					.call(tip.show)
				})
				.on('mouseout', function(d) {
				  d3.select(this)
					.classed('opacity-hover',false)
					.classed('stroke-hover',false)
					.call(tip.hide)
				})
				.transition()
					.duration(duration)
					.attr("x2", slopewidth-slopemargin.right)
					.attr("y2", yScale(endSlope))
					// .attr("class","measure")
					.attr("class",function(d){ 
						if ( d[nla0712_ce_sig] != "Yes" ) {
						  return "measure significant-No"; 
						} else {
						  return "measure significant-Yes"; 
						}
					 });

                //Append y-axis
                /*if(i==0) {
                    var yAxisAppend = gsub.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
                        .call(yAxis);
                }*/

                //Draw the y grid lines
                gsub.append("g")            
                    .attr("class", "grid")
                    .attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
                    .call(make_y_axis()
                        .tickSize(-slopewidth + slopemargin.left - radius)
                        .tickFormat("")
                        .tickPadding(150)
                    );
            // console.log(axisFlag);
            // axisFlag++;

        } 

        }); // end of subslope.each
    }) //End of slopeG.each

};

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

/**************
***************
** BREAKOUT SLOPE
***************
**************/

function slopeB(d) {

    var duration = 500,
    tickFormat = d3.format(".0%"),
    radius = 3,
    slopeG = d3.selectAll("#d3-slopeB g"),
    rowCount = 0,
    axisFlag = 0;

    slopeG.each(function(d,i) { 
// console.log("slopedata",d)

        var g = d3.select(this);

        var slopesub = g.selectAll("g .slope-sub")
                .data(d.values)
            .enter()
                  .append("g")
                  .attr("class","slope-sub")
                  .attr("data-loc",function(){  
                    i = rowCount; 
                    rowCount++; 
                    return "chart-loc-" + i; 
                  })
                  .attr("height", function(d){ return slopeheightB + slopemarginB.top + slopemarginB.bottom; })
                  .attr("transform", function(d,i) { return "translate(0," + ((slopeheightB + slopemarginB.top + slopemarginB.bottom)*i) + ")"; })          

        slopesub.each(function(d,j) {

            var slopesvg = d3.select(this.parentNode.parentNode);

            var slopeborder = slopesvg.insert("rect",":first-child")
                    .attr("class", "border")
                    // .attr("data-loc",j)
                    .attr("width",slopecontainerB)
                    .attr("height", slopeheightB + slopemarginB.top + slopemarginB.bottom)
                    .attr("transform",function(d){ return "translate(0," + ( (slopeheightB + slopemarginB.top + slopemarginB.bottom) * j )  + ")"; })
            var gsub = d3.select(this);

            if ( d[nla0712_ce_estp1] == "NA" || d[nla0712_ce_estp2] == "NA") {
            var addNAtext = gsub.append("g")
                        .style("text-anchor", "start")
                        .attr("transform", "translate(10,17)")

                addNAtext.append("text")
                        .attr("class", "no-data")
                        .text(function(d,i) { return "N/A"; });
			} else {
                
                data = gsub.data();

                var startSlope  = +d[nla0712_ce_estp1],
                    endSlope    = +d[nla0712_ce_estp2];
                    /*barend      = (+d[nla0712_ce_ucb95pctp2] - +d[nla0712_ce_ucb95pctp1]),
                    barstart    = (+d[nla0712_ce_lcb95pctp2] - +d[nla0712_ce_lcb95pctp1]),
                    barwidth    = Math.abs(barstart - barend);*/

                // console.log("startSlope",startSlope);
                // console.log("endSlope",endSlope);

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                        .html(function(d) { 
							var d = this.data()[0],
								change = +d[nla0712_ce_estp1] > +d[nla0712_ce_estp2] ? "decreased" : "increased",
								sig = d[nla0712_ce_sig] == "No" ? "is not" : "is";

							return '<div class="tooltip-table"><table>' +
							'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
							'<tr><td>2007 point estimate: <b>' + r1(d[nla0712_ce_estp1]) + '%</b></td></tr>' +
							'<tr><td>2012 point estimate: <b>' + r1(d[nla0712_ce_estp2]) + '%</b></td></tr>' +
							'<tr><td>Statistical significance: <b>' + d[nla0712_ce_sig] + '</b></td></tr>' +
							'<tr class="blank-row"><td> </td></tr>' +
							'<tr><td>Explanation: For '+d[nla12_ce_subpopl]+' lakes 4 hectares and larger, the percentage designated as '+d[nla12_ce_cat]+' '+change+' from '+r1(d[nla0712_ce_estp1])+'% in 2007 to '+r1(d[nla0712_ce_estp2])+'% in 2012. This '+sig+' a statistically significant change.</td></tr> ' +
							'</div></table>'
			            })
                    .offset([0, 0]);

                var slopesvg = d3.select("#d3-slopeB").selectAll("svg");
                slopesvg.call(tip);

                // function for the y grid lines
                function make_y_axis() {
                    return d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(3)
                }

            // Compute the new slope y-scale.
                var yScale = d3.scale.linear()
                    .domain([100,0])
                    .range([0,slopeheightB]);

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(3)
                    .tickSize(0)
                    .tickFormat(tickFormat);
       
                // Draw lines
                var lines = gsub.selectAll("line")
                    .data([d]);

				var slope = lines.enter()
					.append("line")
						.attr("x1", radius + slopemarginB.left)
						.attr("x2", radius + slopemarginB.left)
						.attr("y1", yScale(startSlope))
						.attr("y2", yScale(startSlope))
						/*.attr("class",function(d) { 
							if (d[nla12_ce_cat] == "Most Disturbed") return "measure hc"; 
							else if ( d[nla12_ce_cat] == "Moderately Disturbed" ) return "measure mc"
							else if ( d[nla12_ce_cat] == "Least Disturbed" ) return "measure lc"
							else if ( d[nla12_ce_cat] == "Not Assessed" ) return "measure na"
							else return "measure other"
						})*/

					.on('mouseover', function(d) {
						d3.select(this)
							.classed('opacity-hover',true)
							.classed('stroke-hover',true)
							.call(tip.show)
					})
					.on('mouseout', function(d) {
						d3.select(this)
							.classed('opacity-hover',false)
							.classed('stroke-hover',false)
							.call(tip.hide)
					})
					.transition()
						.duration(duration)
						.attr("x2", slopewidthB-slopemarginB.right)
						.attr("y2", yScale(endSlope))
						// .attr("class","measure")
						.attr("class",function(d){ 
							if (d[nla12_ce_cat] == "Most Disturbed") {
								if (d[nla0712_ce_sig] == "Yes") return "measure significant-Yes hc";
								else return "measure significant-No hc";
							}
							else if ( d[nla12_ce_cat] == "Moderately Disturbed" ) {
								if (d[nla0712_ce_sig] == "Yes") return "measure significant-Yes mc";
								else return "measure significant-No mc";
							}
							else if ( d[nla12_ce_cat] == "Least Disturbed" ) {
								if (d[nla0712_ce_sig] == "Yes") return "measure significant-Yes lc";
								else return "measure significant-No lc";
							}
							else if ( d[nla12_ce_cat] == "Not Assessed" ) {
								if (d[nla0712_ce_sig] == "Yes") return "measure significant-Yes na";
								else return "measure significant-No na";
							}
							else {
								if (d[nla0712_ce_sig] == "Yes") return "measure significant-Yes other";
								else return "measure significant-No other";
							}
						});

				// Draw nodes
				/*var nodes = gsub.selectAll("circle")
					.data([d])

				var startNode = nodes.enter()
					.append("circle")
					  .attr("r",radius)
					  .attr("cx", radius + slopemargin.left)
					  .attr("cy",yScale(startSlope))
					  .attr("class","measure-start")
					.on('mouseover', function(d) {
					  d3.select(this)
						.classed('opacity-hover',true)
						.classed('stroke-hover',true)
						.call(tip.show)
					})
					.on('mouseout', function(d) {
					  d3.select(this)
						.classed('opacity-hover',false)
						.classed('stroke-hover',false)
						.call(tip.hide)
					});

				var endNode = nodes.enter()
					.append("circle")
					  .attr("r",radius)
					  .attr("cx",radius + slopemargin.left)
					  .attr("cy",yScale(startSlope))
					.on('mouseover', function(d) {
					  d3.select(this)
						.classed('opacity-hover',true)
						.classed('stroke-hover',true)
						.call(tip.show)
					})
					.on('mouseout', function(d) {
					  d3.select(this)
						.classed('opacity-hover',false)
						.classed('stroke-hover',false)
						.call(tip.hide)
					})
					.transition()
					  .duration(duration)
					  .attr("cx",slopewidth-slopemargin.right)
					  .attr("cy",yScale(endSlope))
					  .attr("class","measure-end");*/

                // If axisFlag == 0, add the axis to the axis container
                if(axisFlag==0) {

                    var xAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("top")
                        .tickSize(0)
                        .ticks(0)
                        .tickFormat(tickFormat);

                  //Add the x-axis
                    var xAxissvg = d3.select("#d3-slopeB-axis")
                        .append("svg")
                        .attr("class","axis-container")              
                        .attr("width", slopewidthB + slopemarginB.left + slopemarginB.right )

                    var xAxisAppend = xAxissvg.append("g")
                        .attr("transform", "translate(" + slopemarginB.left + ",20)")
                        .call(xAxis);

                }
            //Append y-axis
            /*if(i==0) {
                var yAxisAppend = gsub.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
                    .call(yAxis);
            }*/

            //Draw the y grid lines
                gsub.append("g")            
                    .attr("class", "grid")
                    .attr("transform", "translate(" + (slopemarginB.left  - 5) + ",0)")
                    .call(make_y_axis()
                        .tickSize(-slopewidthB + slopemarginB.left - radius)
                        .tickFormat("")
                        .tickPadding(150)
                    );
                // console.log(axisFlag);
                axisFlag++;

            }
        }); // end of subslope.each
    }) //End of slopeG.each

};

function slopeSI(d) {

    var duration = 500,
    tickFormat = d3.format(".0%"),
    radius = 3,
    slopeG = d3.selectAll("#d3-slope-si g"),
    rowCount = 0,
    axisFlag = 0;

    slopeG.each(function(d,i) { 

        var g = d3.select(this);

        var slopesub = g.selectAll("g .slope-sub")
                .data(d.values)
            .enter()
                  .append("g")
                  .attr("class","slope-sub")
                  .attr("data-loc",function(){  
                    i = rowCount; 
                    rowCount++; 
                    return "chart-loc-" + i; 
                  })
                  .attr("height", function(d){ return slopeheight + slopemargin.top + slopemargin.bottom; })
                  .attr("transform", function(d,i) { return "translate(0," + ((slopeheight + slopemargin.top + slopemargin.bottom)*i) + ")"; })          

        slopesub.each(function(d,j) {

            var slopesvg = d3.select(this.parentNode.parentNode);

            var slopeborder = slopesvg.insert("rect",":first-child")
                    .attr("class", "border")
                    // .attr("data-loc",j)
                    .attr("width",slopecontainer)
                    .attr("height", slopeheight + slopemargin.top + slopemargin.bottom)
                    .attr("transform",function(d){ return "translate(0," + ( (slopeheight + slopemargin.top + slopemargin.bottom) * j )  + ")"; })

			// If axisFlag == 0, add the axis to the axis container
			if(axisFlag==0) {
                var yScale = d3.scale.linear()
                    .domain([100,0])
                    .range([0,slopeheight]);

				var xAxis = d3.svg.axis()
					.scale(yScale)
					.orient("top")
					.tickSize(0)
					.ticks(0)
					.tickFormat(tickFormat);

			  //Add the x-axis
				var xAxissvg = d3.select("#d3-slopeSI-axis")
					.append("svg")
					.attr("class","axis-container")              
					.attr("width", slopewidth + slopemargin.left + slopemargin.right )

				var xAxisAppend = xAxissvg.append("g")
					.attr("transform", "translate(" + slopemargin.left + ",20)")
					.call(xAxis);
					
				axisFlag++;

			}

            var gsub = d3.select(this);

            if ( d[nla0712_ce_estp1] == "NA" || d[nla0712_ce_estp2] == "NA") {
				var addNAtext = gsub.append("g")
						.style("text-anchor", "start")
						.attr("transform", "translate(7,17)")

					addNAtext.append("text")
						.attr("class", "no-data")
						.text(function(d,i) { return "N/A"; });
			} else {
                
                data = gsub.data();

                var startSlope  = +d[nla0712_ce_estp1],
                    endSlope    = +d[nla0712_ce_estp2];

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
					.direction(function(d){
					  var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
						  win = $(window);
					  if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/30) ) return "s";
					  else return "n";
					})
					.html(function(d) { 
						var d = this.data()[0],
							change = +d[nla0712_ce_estp1] > +d[nla0712_ce_estp2] ? "decreased" : "increased",
							sig = d[nla0712_ce_sig] == "No" ? "is not" : "is";

						return '<div class="tooltip-table"><table>' +
						'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>2007 point estimate: <b>' + r1(d[nla0712_ce_estp1]) + '%</b></td></tr>' +
						'<tr><td>2012 point estimate: <b>' + r1(d[nla0712_ce_estp2]) + '%</b></td></tr>' +
						'<tr><td>Statistical significance: <b>' + d[nla0712_ce_sig] + '</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: For '+d[nla12_ce_subpopl]+' lakes 4 hectares and larger, the percentage designated as '+d[nla12_ce_cat]+' '+change+' from '+r1(d[nla0712_ce_estp1])+'% in 2007 to '+r1(d[nla0712_ce_estp2])+'% in 2012. This '+sig+' a statistically significant change.</td></tr>' +
						'</div></table>'
					})
					.offset([0, 0]);

                var slopesvg = d3.select("#d3-slope-si").selectAll("svg");
                slopesvg.call(tip);

                // function for the y grid lines
                function make_y_axis() {
                    return d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(3)
                }

            // Compute the new slope y-scale.
                var yScale = d3.scale.linear()
                    .domain([100,0])
                    .range([0,slopeheight]);

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(3)
                    .tickSize(0)
                    .tickFormat(tickFormat);
       
                // Draw lines
                var lines = gsub.selectAll("line")
                    .data([d]);

				var slope = lines.enter()
					.append("line")
						.attr("x1", radius + slopemargin.left - radius)
						.attr("x2", radius + slopemargin.left)
						.attr("y1", yScale(startSlope))
						.attr("y2", yScale(startSlope))
					.on('mouseover', function(d) {
						d3.select(this)
							.classed('opacity-hover',true)
							.classed('stroke-hover',true)
							.call(tip.show)
					})
					.on('mouseout', function(d) {
						d3.select(this)
							.classed('opacity-hover',false)
							.classed('stroke-hover',false)
							.call(tip.hide)
					})
					.transition()
						.duration(duration)
						.attr("x2", slopewidth-slopemargin.right)
						.attr("y2", yScale(endSlope))
						// .attr("class","measure")
						.attr("class",function(d){							
							if (d[nla0712_ce_sig] == "Yes") return "measure significant-Yes";
							else return "measure significant-No";
						});

            //Append y-axis
            /*if(i==0) {
                var yAxisAppend = gsub.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
                    .call(yAxis);
            }*/

            //Draw the y grid lines
                gsub.append("g")            
                    .attr("class", "grid")
                    .attr("transform", "translate(" + (slopemargin.left  - 5) + ",0)")
                    .call(make_y_axis()
                        .tickSize(-slopewidth + slopemargin.left - radius)
                        .tickFormat("")
                        .tickPadding(150)
                    );
                // console.log(axisFlag);
                // axisFlag++;

            }
        }); // end of subslope.each
    }) //End of slopeG.each

};