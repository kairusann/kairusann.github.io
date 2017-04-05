function range(d) {

	var duration = 500,
	tickFormat = d3.format(".0%"),
	radius = 3,
	rangeG = d3.selectAll("#d3-range g"),
	rowCount = 0,
	axisFlag = 0;

	rangeG.each(function(d) {   

		g = d3.select(this);

		var rangesub = g.selectAll("g .range-sub")
				.data(d.values)
			.enter().append("g")
				.attr("class","range-sub")
				.attr("data-loc",function(){  
					i = rowCount; 
					rowCount++; 
					return "chart-loc-" + i; 
				})
				.attr("height", function(d){ return rangeheight + rangemargin.top + rangemargin.bottom; })
				.attr("transform", function(d,i) { return "translate(0," + ((rangeheight + rangemargin.top + rangemargin.bottom)*i) + ")"; })         

		rangesub.each(function(d,j) {

			var gsub = d3.select(this);
		  
			var xScale = d3.scale.linear()
				.domain([-40,80])
				.range([0, rangecontainer - 50]);

			// function for the y grid lines
			function make_gridlines() {
				return d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(6)
			}

			var xGrid = gsub.append("g")            
				.attr("class", "grid")
				.attr("transform", "translate(0,0)")
				.call(make_gridlines()
					.tickSize(rangeheight)
					.tickFormat("")
					.tickPadding(10)
				);

			//Add the x-axis
			if (axisFlag==0) {

				var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("top")
					.tickSize(5)
					.ticks(5)
					.tickFormat(function(d) { return d + "%"; });

			  //Add the x-axis
				var xAxissvg = d3.select("#d3-range-axis")
					.append("svg")
					.attr("class","axis-container")
					.attr("width", rangewidth + rangemargin.left + rangemargin.right )
					.attr("height",20)

				var xAxisAppend = xAxissvg.append("g")
					.attr("transform", "translate(" + (rangemargin.left + rangemargin.right + 2) + ",20)")
					.style("font-family","Arial,sans-serif")
					.call(xAxis);
			}

			axisFlag++;

			// Compute the new slope y-scale.
			var xScale = d3.scale.linear()
				.domain([-40,80])
				.range([0, rangecontainer - 50]);

			var symbol = d3.svg.symbol().type('diamond')
				.size(5);

          //Check for Change Estimate Measure. 
          //If no measures exist, return "N/A" instead of chart.
          if ( d[nla0712_ce_estp1] == "NA" || d[nla0712_ce_estp2] == "NA") {
                var addNAtext = gsub.append("g")
                            .style("text-anchor", "start")
                            .attr("transform", "translate(80,21)")

                    addNAtext.append("text")
                            .attr("class", "no-data")
                            .text(function(d,i) { return "N/A"; });

    		  } else {
					var triangle    = +d[nla0712_ce_diffestp],
						barend      = +d[nla0712_ce_diffucb95pctp],
						barstart    = +d[nla0712_ce_difflcb95pctp],
						barwidth    = +d[nla0712_ce_diffcilenp];

						// console.log("barend", barend);
						// console.log("barstart", barstart);
						// console.log("barwidth", barwidth);
                
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

							return '<div class="tooltip-table" style="width:480px"><table>' +
							'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
							'<tr><td>Change from 2007 to 2012: <b>' + r1(d[nla0712_ce_diffestp]) + '</b> pct. points</td></tr>' +
							'<tr><td>95% confidence interval for the change: <b>'+r1(d[nla0712_ce_difflcb95pctp])+'</b> to <b>'+r1(d[nla0712_ce_diffucb95pctp])+'</b> pct. points</td></tr>' +
							'<tr><td>Statistical significance: <b>' + d[nla0712_ce_sig] + '</b></td></tr>' +
							'<tr class="blank-row"><td> </td></tr>' +
							'<tr><td>Explanation: For '+d[nla12_ce_subpopl]+' lakes 4 hectares and larger, the percentage designated as '+d[nla12_ce_cat]+' '+change+' by '+r1(Math.abs(d[nla0712_ce_diffestp]))+' percentage points from 2007 to 2012. The confidence interval associated with this estimate is '+r1(d[nla0712_ce_difflcb95pctp])+' to '+r1(d[nla0712_ce_diffucb95pctp])+' percentage points. This '+sig+' a statistically significant change.</td></tr>' +
							'</div></table>'
						})
					.offset(function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()+win.width()-1020];
					});

				var rangesvg = d3.select("#d3-range").selectAll("svg")
				rangesvg.call(tip);


			// if (barwidth !== 0) {

				//Draw the symbols
				var triangle = gsub.selectAll('path.diamond')
					.data([d])
					.enter()
					.append('path')
					.attr("class",function(d){ 
					  if ( d[nla0712_ce_sig] != "Yes" ) { 
						return "significant-No"; 
					  } else {
						return "significant-Yes"; 
					  }
					})
					.attr('d',symbol)
					.attr('stroke','#666')
					.attr('stroke-width',0)
					.attr('transform',function(d,i){ return "translate("+ (xScale(triangle)) + "," + (rangeheight/2) + ")"; })
				  .on('mouseover', function(d) {
					  d3.select(this)
						// .classed('opacity-hover',true)
						// .classed('stroke-hover',true)
						.call(tip.show)
					})
					.on('mouseout', function() {
					  d3.select(this)
						// .classed('opacity-hover',false)
						// .classed('stroke-hover',false)
						.call(tip.hide)
					})
					.transition()
						.duration(duration)
						.attr('stroke-width',5);

			// } // end if(barwidth !== 0)

				var confidence = gsub.selectAll("rect").data([d]).enter().append("rect")
					.attr("class",function(d){ 
					  if ( d[nla0712_ce_sig] != "Yes" ) { 
						return "significant-No"; 
					  } else {
						return "significant-Yes"; 
					  }
					})
					.attr("width", 0)
					.attr("height", rangeheight / 12)
					.attr("y", (( rangeheight / 2 ) - ( (rangeheight / 12)/2 )) )
					.attr("x", xScale( barstart ))
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
					.attr("x", xScale(Math.min(barstart,barend)))
					.attr("width", Math.abs(xScale(barwidth)-69));

			}

		  var rangesvg = d3.select(this.parentNode.parentNode);

		  var rangeborder = rangesvg.insert("rect",":first-child")
			  .attr("class", "border")
			  // .attr("data-loc",j)
			  .attr("width",rangecontainer)
			  .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)
			  .attr("transform",function(d){ return "translate(0," + ( (rangeheight + rangemargin.top + rangemargin.bottom) * j )  + ")"; })

      }) // End rangesub.each
  }) //End of rangeG.each
};

function rangeB(d) {

  var duration = 500,
  tickFormat = d3.format(".0%"),
  radius = 3,
  rangeG = d3.selectAll("#d3-rangeB g"),
  rowCount = 0,
  axisFlag = 0;

  rangeG.each(function(d) {   

      g = d3.select(this);

      var rangesub = g.selectAll("g .range-sub")
              .data(d.values)
          .enter()
              .append("g")
              .attr("class","range-sub")
              .attr("data-loc",function(){  
                i = rowCount; 
                rowCount++; 
                return "chart-loc-" + i; 
              })
              .attr("height", function(d){ return rangeheightB + rangemarginB.top + rangemarginB.bottom; })
              .attr("transform", function(d,i) { return "translate(0," + ((rangeheightB + rangemarginB.top + rangemarginB.bottom)*i) + ")"; })          

	  // Compute the new slope y-scale.
	  var xScale = d3.scale.linear()
		  .domain([-65,80])
		  .range([0, rangewidthB-rangemarginB.left-rangemarginB.right]);

	  // function for the y grid lines
	  function make_gridlines() {
		return d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.ticks(8)
	  }

      rangesub.each(function(d,j) {

	      var gsub = d3.select(this);

		  var xGrid = gsub.append("g")            
			  .attr("class", "grid")
			  .attr("transform", "translate(-2,0)")
			  .call(make_gridlines()
				  .tickSize(rangeheightB)
				  .tickFormat("")
				  .tickPadding(10)
			  );

          //Check for Change Estimate Measure. 
          //If no measures exist, return "N/A" instead of chart.
			if ( d[nla0712_ce_estp1] == "NA" || d[nla0712_ce_estp2] == "NA" ) {
				var addNAtext = gsub.append("g")
							.style("text-anchor", "start")
							.attr("transform", "translate(106,21)")

					addNAtext.append("text")
							.attr("class", "no-data")
							.text(function(d,i) { return "N/A"; });
			} else {

			var triangle    = +d[nla0712_ce_diffestp],
				barend      = +d[nla0712_ce_diffucb95pctp],
				barstart    = +d[nla0712_ce_difflcb95pctp],
				barwidth    = +d[nla0712_ce_diffcilenp];

			var tip = d3.tip()
			.attr('class', 'd3-tip')
			/*.direction(function(d){
				var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
					win = $(window);
				if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/30) ) return "s";
				else return "n";
			})*/
			.html(function(d) { 
				var d = this.data()[0],
					change = +d[nla0712_ce_estp1] > +d[nla0712_ce_estp2] ? "decreased" : "increased",
					sig = d[nla0712_ce_sig] == "No" ? "is not" : "is";

					return '<div class="tooltip-table" style="width:480px"><table>' +
					'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
					'<tr><td>Change from 2007 to 2012: <b>' + r1(d[nla0712_ce_diffestp]) + '</b> pct. points</td></tr>' +
					'<tr><td>95% confidence interval for the change: <b>'+r1(d[nla0712_ce_difflcb95pctp])+'</b> to <b>'+r1(d[nla0712_ce_diffucb95pctp])+'</b> pct. points</td></tr>' +
					'<tr><td>Statistical significance: <b>' + d[nla0712_ce_sig] + '</b></td></tr>' +
					'<tr class="blank-row"><td> </td></tr>' +
					'<tr><td>Explanation: For '+d[nla12_ce_subpopl]+' lakes 4 hectares and larger, the percentage designated as '+d[nla12_ce_cat]+' '+change+' by '+r1(Math.abs(d[nla0712_ce_diffestp]))+' percentage points from 2007 to 2012. The confidence interval associated with this estimate is '+r1(d[nla0712_ce_difflcb95pctp])+' to '+r1(d[nla0712_ce_diffucb95pctp])+' percentage points. This '+sig+' a statistically significant change.</td></tr>' +
					'</div></table>'
				})
			.offset(function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()+win.width()-1020];
					});

              var rangesvg = d3.select("#d3-rangeB").selectAll("svg")
              rangesvg.call(tip);

			  var symbol = d3.svg.symbol().type('diamond')
					.size(5);

              //Draw the symbols
              var triangle = gsub.selectAll('path.diamond')
                  .data([d])
                  .enter()
                  .append('path')
				  .attr("class",function(d){ 
					if (d[nla12_ce_cat] == "Most Disturbed") {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes hc";
						else return "range significant-No hc";
					}
					else if ( d[nla12_ce_cat] == "Moderately Disturbed" ) {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes mc";
						else return "range significant-No mc";
					}
					else if ( d[nla12_ce_cat] == "Least Disturbed" ) {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes lc";
						else return "range significant-No lc";
					}
					else if ( d[nla12_ce_cat] == "Not Assessed" ) {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes na";
						else return "range significant-No na";
					}
					else {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes other";
						else return "range significant-No other";
					}
				  })
                  .attr('d',symbol)
                  .attr('stroke','#666')
                  .attr('stroke-width',0)
                  .attr('transform',function(d,i){ return "translate("+ (xScale(triangle)-1) + "," + (rangeheightB/2) + ")"; })
                .on('mouseover', function(d) {
                    d3.select(this)
                      // .classed('opacity-hover',true)
                      // .classed('stroke-hover',true)
                      .call(tip.show)
                  })
                  .on('mouseout', function() {
                    d3.select(this)
                      // .classed('opacity-hover',false)
                      // .classed('stroke-hover',false)
                      .call(tip.hide)
                  })
                .transition()
                  .duration(duration)
                  .attr('stroke-width',5);

              var confidence = gsub.selectAll("rect").data([d]).enter().append("rect")
				  .attr("class",function(d){ 
					if (d[nla12_ce_cat] == "Most Disturbed") {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes hc";
						else return "range significant-No hc";
					}
					else if ( d[nla12_ce_cat] == "Moderately Disturbed" ) {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes mc";
						else return "range significant-No mc";
					}
					else if ( d[nla12_ce_cat] == "Least Disturbed" ) {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes lc";
						else return "range significant-No lc";
					}
					else if ( d[nla12_ce_cat] == "Not Assessed" ) {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes na";
						else return "range significant-No na";
					}
					else {
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes other";
						else return "range significant-No other";
					}
				  })
                  .attr("width", 0)
                  .attr("height", rangeheightB / 20)
                  .attr("y", (( rangeheightB / 2 ) - ( (rangeheightB / 12)/2 )) )
                  .attr("x", xScale( barstart ))
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
                  .attr("x", xScale( Math.min(barstart,barend) ))
                  .attr("width", Math.abs(xScale(barwidth)-108.5));

        } 
			var rangesvg = d3.select(this.parentNode.parentNode);

			var rangeborder = rangesvg.insert("rect",":first-child")
					.attr("class", "border")
					// .attr("data-loc",j)
					.attr("width",rangecontainerB)
					.attr("height", rangeheightB + rangemarginB.top + rangemarginB.bottom)
					.attr("transform",function(d){ return "translate(0," + ( (rangeheightB + rangemarginB.top + rangemarginB.bottom) * j )  + ")"; })

		  //Add the x-axis
		  if (axisFlag==0) {

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("top")
				.tickSize(5)
				.ticks(8)
				.tickFormat(function(d) { return d + "%"; });

			//Add the x-axis
			var xAxissvg = d3.select("#d3-rangeB-axis")
				.append("svg")
				.attr("class","axis-container")
				.attr("width", rangewidthB + rangemarginB.left + rangemarginB.right )
				.attr("height",20)

			var xAxisAppend = xAxissvg.append("g")
				.attr("transform", "translate(" + (rangemarginB.left + rangemarginB.right) + ",20)")
				.style("font-family","Arial,sans-serif")
				.call(xAxis);
		  }

		axisFlag++;


      }) // End rangesub.each
  }) //End of rangeG.each
};

function rangeSI(d) {

  var duration = 500,
  tickFormat = d3.format(".0%"),
  radius = 3,
  rangeG = d3.selectAll("#d3-range-si g"),
  rowCount = 0,
  axisFlag = 0;

  rangeG.each(function(d) {   

      g = d3.select(this);

      var rangesub = g.selectAll("g .range-sub")
              .data(d.values)
          .enter()
              .append("g")
              .attr("class","range-sub")
              .attr("data-loc",function(){  
                i = rowCount; 
                rowCount++; 
                return "chart-loc-" + i; 
              })
              .attr("height", function(d){ return rangeheightSI + rangemarginSI.top + rangemarginSI.bottom; })
              .attr("transform", function(d,i) { return "translate(0," + ((rangeheightSI + rangemarginSI.top + rangemarginSI.bottom)*i) + ")"; })          

      rangesub.each(function(d,j) {

	      var gsub = d3.select(this);

		  // Compute the new slope y-scale.
		  var xScale = d3.scale.linear()
			  .domain([-40,80])
			  .range([0, rangecontainerSI - 50]);

		  // function for the y grid lines
		  function make_gridlines() {
			return d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(6)
		  }

		  var xGrid = gsub.append("g")            
			  .attr("class", "grid")
			  .attr("transform", "translate(0,0)")
			  .call(make_gridlines()
				  .tickSize(rangeheightSI)
				  .tickFormat("")
				  .tickPadding(10)
			  );

		  //Add the x-axis
		  if (axisFlag==0) {

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("top")
				.tickSize(5)
				.ticks(5)
				.tickFormat(function(d) { return d + "%"; });

			//Add the x-axis
			var xAxissvg = d3.select("#d3-rangeSI-axis")
				.append("svg")
				.attr("class","axis-container")
				.attr("width", rangewidthSI + rangemarginSI.left + rangemarginSI.right )
				.attr("height",20)

			var xAxisAppend = xAxissvg.append("g")
				.attr("transform", "translate(" + (rangemarginSI.left + rangemarginSI.right + 2) + ",20)")
				.style("font-family","Arial,sans-serif")
				.call(xAxis);
		  }

		axisFlag++;

          //Check for Change Estimate Measure. 
          //If no measures exist, return "N/A" instead of chart.
            if ( d[nla0712_ce_estp1] == "NA" || d[nla0712_ce_estp2] == "NA" ) {
				var addNAtext = gsub.append("g")
							.style("text-anchor", "start")
							.attr("transform", "translate(80,21)")

					addNAtext.append("text")
							.attr("class", "no-data")
							.text(function(d,i) { return "N/A"; });
			} else {

				var triangle    = +d[nla0712_ce_diffestp],
					barend      = +d[nla0712_ce_diffucb95pctp],
					barstart    = +d[nla0712_ce_difflcb95pctp],
					barwidth    = +d[nla0712_ce_diffcilenp];

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

						return '<div class="tooltip-table" style="width:480px"><table>' +
						'<tr><td>' + d[nla12_ce_subpopl] +' | ' + d[nla12_ce_indic_plain] + ' | ' + d[nla12_ce_cat] + '</td></tr>' +
						'<tr><td>Change from 2007 to 2012: <b>' + r1(d[nla0712_ce_diffestp]) + '</b> pct. points</td></tr>' +
						'<tr><td>95% confidence interval for the change: <b>'+r1(d[nla0712_ce_difflcb95pctp])+'</b> to <b>'+r1(d[nla0712_ce_diffucb95pctp])+'</b> pct. points</td></tr>' +
						'<tr><td>Statistical significance: <b>' + d[nla0712_ce_sig] + '</b></td></tr>' +
						'<tr class="blank-row"><td> </td></tr>' +
						'<tr><td>Explanation: For '+d[nla12_ce_subpopl]+' lakes 4 hectares and larger, the percentage designated as '+d[nla12_ce_cat]+' '+change+' by '+r1(Math.abs(d[nla0712_ce_diffestp]))+' percentage points from 2007 to 2012. The confidence interval associated with this estimate is '+r1(d[nla0712_ce_difflcb95pctp])+' to '+r1(d[nla0712_ce_diffucb95pctp])+' percentage points. This '+sig+' a statistically significant change.</td></tr>' +
						'</div></table>'
					})
					.offset(function(){
						var win = $(window);
						return [0,win.width()-1020 > 0 ? 0 : win.scrollLeft()+win.width()-1020];
					});

              var rangesvg = d3.select("#d3-range-si").selectAll("svg")
              rangesvg.call(tip);

              // Compute the new slope y-scale.
              var xScale = d3.scale.linear()
                  .domain([-40,80])
                  .range([0, rangecontainerSI - 50]);

			  var symbol = d3.svg.symbol().type('diamond')
					.size(5);

          // if (barwidth !== 0) {

              //Draw the symbols
              var triangle = gsub.selectAll('path.diamond')
                  .data([d])
                  .enter()
                  .append('path')
				  .attr("class",function(d){ 
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes";
						else return "range significant-No";
				  })
                  .attr('d',symbol)
                  .attr('stroke','#666')
                  .attr('stroke-width',0)
                  .attr('transform',function(d,i){ return "translate("+ (xScale(triangle)) + "," + (rangeheightSI/2) + ")"; })
                .on('mouseover', function(d) {
                    d3.select(this)
                      // .classed('opacity-hover',true)
                      // .classed('stroke-hover',true)
                      .call(tip.show)
                  })
                  .on('mouseout', function() {
                    d3.select(this)
                      // .classed('opacity-hover',false)
                      // .classed('stroke-hover',false)
                      .call(tip.hide)
                  })
                .transition()
                  .duration(duration)
                  .attr('stroke-width',5);

           // } // end if(barwidth !== 0)


              var confidence = gsub.selectAll("rect").data([d]).enter().append("rect")
				  .attr("class",function(d){ 
						if (d[nla0712_ce_sig] == "Yes") return "range significant-Yes";
						else return "range significant-No";
				  })
                  .attr("width", 0)
                  .attr("height", rangeheightSI / 12)
                  .attr("y", (( rangeheightSI / 2 ) - ( (rangeheightSI / 12)/2 )) )
                  .attr("x", xScale( barstart ))
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
                  .attr("x", xScale(Math.min(barstart,barend)))
                  .attr("width", Math.abs(xScale(barwidth)-72));

        } 
			var rangesvg = d3.select(this.parentNode.parentNode);

			var rangeborder = rangesvg.insert("rect",":first-child")
					.attr("class", "border")
					// .attr("data-loc",j)
					.attr("width",rangecontainerSI)
					.attr("height", rangeheightSI + rangemarginSI.top + rangemarginSI.bottom)
					.attr("transform",function(d){ return "translate(0," + ( (rangeheightSI + rangemarginSI.top + rangemarginSI.bottom) * j )  + ")"; })

      }) // End rangesub.each
  }) //End of rangeG.each
};

/*
  function rangetranslate(x) {
    return function(d) {
      console.log(x(d));
      return "translate(" + "10," + x(d) + ")";
    };
  }

  function tickFormat(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return tickFormat;
  }
  
*/