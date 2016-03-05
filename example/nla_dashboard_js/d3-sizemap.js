function sizemap(d) {

// console.log("Size Data before sG each:",d)

  var duration = 500,
  tickFormat = d3.format(".0%"),
  radius = 3,
  sizemapG = d3.selectAll("#d3-sizemap g.sizemap-row"),
  rowCount = 0;

  sizemapG.each(function(d, i) {  
 
  	var g = d3.select(this);
// console.log("g:",g);
// console.log("g data:",d);

    var sizemapsub = g.selectAll("g .sizemap-sub")
        .data(d.values)
      .enter().append("g")
        .attr("class","sizemap-sub")
        
    sizemapsub.attr("data-loc",function(){  
          i = rowCount; 
          rowCount++; 
          return "chart-loc-" + i; 
        })
        .attr("height", function(d){ return sizemapheight + sizemapmargin.top + sizemapmargin.bottom; })
        .attr("transform", function(d,i) { return "translate(40," + ((sizemapheight + sizemapmargin.top + sizemapmargin.bottom)*i) + ")"; })          

    sizemapsub.each(function(d, j) {

      var sizemapsvg = d3.select(this.parentNode.parentNode);
      
      var sizemapborder = sizemapsvg.insert("rect",":first-child")
            .attr("class", "border")
            .attr("width", 680)
            .attr("height", sizemapheight + sizemapmargin.top + sizemapmargin.bottom)
            .attr("transform",function(d){ return "translate(85," + ( (sizemapheight + sizemapmargin.top + sizemapmargin.bottom) * j )  + ")"; })
			//.attr("fill","#FFF");

      var subg = d3.select(this);
      // console.log("subg",subg);
      // console.log("subg d",d);

      // Append indicator titles
      var sizemaptitle = subg.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate(-150," + sizemapheight / 1.5 + ")")

        sizemaptitle.append("text")
            .attr("class", "title indicator")
            .text(function(d,i) { return d["key"].replace(/_/g," "); });

          	// Define the tooltip

      var tip = d3.tip(d)
  	      .attr('class', 'd3-tip')
		  .direction(function(d){
			  var loc = $(d.node().parentNode).attr("data-loc").substr(10,2),
			      win = $(window);
			  if ( loc-5 < Math.round(((win.scrollTop() > 150 ? win.scrollTop() : 150) - 150)/30) ) return "s";
			  else return "n";
		  })
  	      .html(function(d) { 
  	      	var d = this.data()[0],
			sizemapstr = d[nla12_ce_estp] > 0 ? '<tr><td>2012 point estimate: <b>' + r1(d[nla12_ce_estp]) + '%</b></td></tr>' +
				'<tr><td>95% confidence interval for 2012: <b>' + r1(d[nla12_ce_lcb95pctp]) + '%</b> to <b>' +  r1(d[nla12_ce_ucb95pctp]) + '%</b></td></tr>' +
				'<tr class="blank-row"><td>&nbsp;</td></tr>' +
				'<tr><td>Explanation: In 2012, EPA found that '+r1(d[nla12_ce_estp])+'% ('+r0(d[nla12_ce_estu])+') of all '+d[nla12_ce_subpopl]+' lakes are designated as Most Disturbed for '+d[nla12_ce_indic_plain]+'. The confidence interval for this estimate is '+r1(d[nla12_ce_lcb95pctp])+'% to '+r1(d[nla12_ce_ucb95pctp])+'% ('+r0(d[nla12_ce_lcb95pctu])+' to '+r0(d[nla12_ce_ucb95pctu])+' lakes).</td></tr>' : '<tr><td>No observed lakes.</td></tr>'

  	        return '<div id="tooltip-table" style="width:650px"><div class="tooltip-img-container">' + 
			'<img id="tooltip-img" src="img/' + d[nla12_ce_type].replace(/ /g,"_") + '_' + d[nla12_ce_subpop].replace(".","") + '.svg" width="230px" height="140px"/></div><table>' +
			'<tr><td>'+d[nla12_ce_subpopl]+' | '+d[nla12_ce_indic_plain]+' | '+d[nla12_ce_cat]+'</td></tr>' +
				sizemapstr +
            '</table></div>'})
  	      .offset(function(d){ return $(d.node()).attr("x") < 160 ? [0,100] : [0,0]; });

      var sizemapsvg = d3.select("#d3-sizemap").selectAll("svg");
      sizemapsvg.call(tip);
    	
    	/************
    	*************
    	DEFINE CHART MULTIPLES
    	*************
    	************/

        // Compute the new slope y-scale.
        var x = d3.scale.linear()
          .domain([0,100])
          .range([3,Math.pow(sizemapheight-5,2)]);
	
		var sizemap = subg.selectAll(".estimate")
  			.data(d.values);

    	sizemap.enter().append("rect")
          .attr("class","estimate")
          .attr("x",function(d,i){ return ( ( ( (sizemapheight + sizemapmargin.top + sizemapmargin.bottom) - Math.sqrt(x(d[nla12_ce_estp]))||10 ) / 2 ) + (( sizemapheight + 10) *i) ) ; })
          .attr("y",function(d){ return ( (sizemapheight + sizemapmargin.top + sizemapmargin.bottom) / 2 ) ; })
          .attr("height",0)
          .attr("width",0)
/*
var selection = d3.select("#chart")
  .selectAll(".bar").data(numbers);

selection.enter().append("div").attr("class", "bar")
  .style("height", function(d){ 
    return d; 
  })

selection.exit().remove();
*/
      sizemap
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
        .transition().duration(duration)            	
            .attr("y",function(d){ return ( ((sizemapheight + sizemapmargin.top + sizemapmargin.bottom - Math.sqrt(x(d[nla12_ce_estp]))||10) / 2 )) ; })
          	.attr("height", function(d){ return Math.sqrt(x(d[nla12_ce_estp]))||20; } )
  		    .attr("width",function(d){ return Math.sqrt(x(d[nla12_ce_estp]))||20; } )
			.style("opacity", function(d){ return d[nla12_ce_estp] > 0 ? 1 : 0 })

      sizemap.exit().remove();
              
              // gsub.append("g").attr("transform","translate(350,20)").style("text-anchor","middle").append("text").text(function(d,i){ if(i==0){return d[nla12_ce_indic]};});
})
  })
}
