window.URL = window.URL || window.webkitURL;

var fileSelect = document.getElementById("fileSelect"),
  fileElem = document.getElementById("fileElem"),
  fileList = document.getElementById("fileList");

/*
fileSelect.addEventListener("click", function (e) {
  if (fileElem) {
    fileElem.click();
  }
  e.preventDefault(); // prevent navigation to "#"
}, false);
*/


var data1 = [["State","DISTRICT_ID"],["AL",3],["AK",5],["AZ",5],["AR",3],["CA",5],["CO",4],["CT",1],["DE",1],["DC",1],["FL",3],["GA",3],["GU",5],["HI",5],["ID",5],["IL",2],["IN",2],["IA",2],["KS",4],["KY",2],["LA",3],["ME",1],["MD",1],["MA",1],["MI",2],["MN",2],["MS",3],["MO",2],["MP",5],["MT",5],["NE",4],["NV",5],["NH",1],["NJ",1],["NM",4],["NY",1],["NC",3],["ND",4],["OH",2],["OK",4],["OR",5],["PA",1],["PR",1],["RI",1],["SC",3],["SD",4],["TN",3],["TX",4],["UT",5],["VT",1],["VA",3],["VI",3],["WA",5],["WV",3],["WI",2],["WY",4]]

google.charts.load('current', {
  'packages': ['table','geochart']
});

function placeMarker(dataTable) {
  label = document.createElement("div")
  label.className = "label"
  // TO DO: Implement data label in Google GeoChart
  //
  //
  label.textContent = dataTable.getValue(4, 1)
  document.getElementById("viz").appendChild(label)
};

function drawChart(dataTable){
  var chart_div = document.getElementById('viz'),
      chart = new google.visualization.GeoChart(chart_div),
      startColor = "#"+document.querySelectorAll("form input")[0].value || "#EFEFFF",
      endColor = "#"+document.querySelectorAll("form input")[1].value || "#02386F",
      // Define Charting Options for Google GeoChart Here
      options = {
      region: 'US',
      displayMode: 'region',
      resolution: "provinces",
      colorAxis: {colors: [startColor, endColor]},
      //backgroundColor: {fill:'#eeeeee'},
      //datalessRegionColor: '#f8bbd0',
      //defaultColor: '#f5f5f5',
      //width: 800
    };

  google.visualization.events.addListener(chart, 'ready', function () {
    var png = '<a href="' + chart.getImageURI() + '">Get PNG (To Save, right click and choose "Save As" )</a>';
    document.getElementById('print_div').innerHTML = png;
    // placeMarker.bind(chart, dataTable);
  });
  chart.draw(dataTable, options)
};

function drawDatamap(series){
  // Datamaps expect data in format:
  // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
  //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
  series = series.slice(1); 
  dataset = {};
  stateLabels = {};
  valueLabels = {};
  // We need to colorize every country based on "numberOfWhatever"
  // colors should be uniq for every value.
  // For this purpose we create palette(using min/max series-value)
  var onlyValues = series.map(function(obj){ return obj[1]; }),
      uniqueValues = Array.from(new Set(onlyValues))
      minValue = Math.min.apply(null, onlyValues),
      maxValue = Math.max.apply(null, onlyValues),
      startColor = "#"+document.querySelectorAll("form input")[0].value || "#EFEFFF",
      endColor = "#"+document.querySelectorAll("form input")[1].value || "#02386F";
  // create color palette function
  var d3palette,
      selectedValue = document.querySelectorAll("div select")[0].value;

  switch(selectedValue)
  {
    case "category10": d3palette = d3.scale.category10().domain(uniqueValues);
    break;
    case "category20": d3palette = d3.scale.category20().domain(uniqueValues);
    break;
    case "category20b": d3palette = d3.scale.category20b().domain(uniqueValues);
    break;
    case "category20c": d3palette = d3.scale.category20c().domain(uniqueValues);
    break;
  }

  
  function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
  d3palette.range(shuffle(d3palette.range()));
  


  // color can be whatever you wish
  var paletteScale = d3.scale.linear()
  .domain([minValue,maxValue])
  .range([startColor,endColor]); // blue color
  // fill dataset in appropriate format

  series.forEach(function(item){ //
    // item example value ["USA", 70]
    var iso = item[0],
        value = item[1];

    dataset[iso] = {
      numberOfThings: value, 
      fillColor: document.getElementById('option1').className.split(" ").indexOf("active") > -1 ? paletteScale(value) : d3palette(value)
    };
    stateLabels[iso] = iso + ":" + value;
    valueLabels[iso] = value;

  });
  // render map
  document.getElementById('viz').innerHTML = "";
  d3map = new Datamap({
    scope:'cb_2015_us_state_5m',
    element: document.getElementById('viz'),
  setProjection: function(element, options) {
    var projection, path;
    projection = albersUsaPr()//d3.geo.albersUsa()
      //.center([long, lat])
      .scale(element.offsetWidth)
      .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    
    path = d3.geo.path()
      .projection( projection );

        return {path: path, projection: projection};
  },
    //projection: 'equirectangular', 
  responsive:true,
  done: function(object){
    if (document.getElementById('option1').className.split(" ").indexOf("active") > -1) {
      // Add legend gradient
      var width = object.options.element.offsetWidth,
          height = object.options.element.offsetHeight,
          legendWrapper = d3.select("svg.datamap").append("g"),
          legendScale = d3.scale.linear().domain([minValue,maxValue]).range([0,250]),
          xAxis = d3.svg.axis()
                        .scale(legendScale)
                        .orient("top")
                        .ticks(4);
      // Axis
      legendWrapper.append("g").attr("class","axis").attr("transform","translate("+width/2+","+height/1.1+")").call(xAxis);
      d3.select(".axis").selectAll("path").attr("fill","none")
      // Legend Bar
      legendWrapper.append("defs")
        .append("linearGradient")
            .attr("id","legend")
            .attr("x1","0%")
            .attr("x2","100%")
            .attr("y1","0%")
            .attr("y2","0%"); 
      legendWrapper.append("rect")
        .attr("fill","url(#legend)")
        .attr("x",width / 2)
        .attr("y",height / 1.1)
        .attr("width",250)
        .attr("height",20)
        //.attr("rx",20)  //rounded corners, of course!
        //.attr("ry",20);
      legendWrapper.select("#legend").selectAll("stop") 
        .data( paletteScale.range() )                  
        .enter().append("stop")
        .attr("offset", function(d,i) { return i/(paletteScale.range().length-1); })
        .attr("stop-color", function(d) { return d; });
      
    }
    // Add labels
    drawLabels(d3map,"states");
    // Generate a static image after rendering the svg
    getImg();

  },
    // countries don't listed in dataset will be painted with this color
    fills: { defaultFill: '#F5F5F5' },
    data: dataset,
    geographyConfig: {
    dataUrl: '/cb_2015_us_state_5m.json',
      borderColor: '#DEDEDE',
      highlightBorderWidth: 2,
      // don't change color on mouse hover
      highlightFillColor: function(geo) {
        return geo['fillColor'] || '#F5F5F5';
      },
      // only change border
      highlightBorderColor: '#000',
      // show desired information in tooltip
      popupTemplate: function(geo, data) {
        // don't show tooltip if country don't present in dataset
        if (!data) { return ; }
        // tooltip content
        return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Value: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');
      }
    }
  });

  window.addEventListener('resize', function(event){
  d3map.resize();
  });
  
};

function drawLabels(object,options = "states") {
  $(".datamap .labels text").remove();
  $(".datamap .labels line").remove();
  if (options === "states") {
    object.labels({
    labelColor: '#FFF',
    fontSize: 12
  });
} else if (options === "values") {
  object.labels({
    customLabelText: valueLabels,
    labelColor: '#FFF',
    fontSize: 12
  });
} else if (options === "all") {
    object.labels({
    customLabelText: stateLabels,
    labelColor: '#FFF',
    fontSize: 12
  });
  } else {
    $(".datamap .labels text").remove();
    $(".datamap .labels line").remove();
  }

  // Adjust label position
  var displaylabels = document.querySelectorAll(".labels text");
      displaylines = document.querySelectorAll(".labels line");
  displaylabels.forEach(function(node){
    var nx = node.getAttribute("x"),
        strlen = node.textContent.length,
        fontSize = parseInt(node.style.fontSize),
        vizWidth = parseInt(d3.select("#viz").style("width"));
    if (nx < vizWidth*0.85 && strlen > 2) node.setAttribute("x", nx - strlen*fontSize/4);
    node.style.color = "#FFF"
    node.style.textShadow = "0 0 6px #000000, 0 0 3px #000000";
  });
  displaylines.forEach(function(node){
    node.style.stroke = "#000"
  });

  // Update the static image
  getImg();
}

function getImg(){
  html2canvas([document.getElementById("viz")], {
      useCORS: true
    })
  .then(function(canvas) {
    var serializer = new XMLSerializer(),
        // svgInfo = btoa(serializer.serializeToString(d3.select('svg').node())),
        //imgData = '<a href="data:image/svg+xml;base64,' + btoa(xmlString) + '" class="btn btn-default">Get SVG</a>',
        svgInfo = preprocess(d3.select('svg').node()).source,
        blob = new Blob(svgInfo, {type: 'text/xml'}),
        url = window.URL.createObjectURL(blob);

        imgData = '<a href="' + url + '" class="btn btn-default" download="map.svg">Get SVG</a>',
        png = '<a href="' + canvas.toDataURL("image/png") + '" class="btn btn-default" data-toggle="tooltip" title="To Save, right click and choose &quot;Save As&quot;">Get PNG</a>';
    document.getElementById('print_div').innerHTML = png+imgData;
  });
}

function preprocess(svg) {
  var prefix = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/'
  };

  svg.setAttribute('version', '1.1');

  // removing attributes so they aren't doubled up
  svg.removeAttribute('xmlns');
  svg.removeAttribute('xlink');

  // These are needed for the svg
  if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns')) {
    svg.setAttributeNS(prefix.xmlns, 'xmlns', prefix.svg);
  }

  if (!svg.hasAttributeNS(prefix.xmlns, 'xmlns:xlink')) {
    svg.setAttributeNS(prefix.xmlns, 'xmlns:xlink', prefix.xlink);
  }

  var xmls = new XMLSerializer();
  var source = xmls.serializeToString(svg);
  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
  var rect = svg.getBoundingClientRect();
  var svgInfo = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    class: svg.getAttribute('class'),
    id: svg.getAttribute('id'),
    childElementCount: svg.childElementCount,
    source: [doctype + source],
  };

  return svgInfo;
}

function getSVG(svgInfo, filename) {
  window.URL = (window.URL || window.webkitURL);
  var blob = new Blob(svgInfo.source, {type: 'text\/xml'});
  var url = window.URL.createObjectURL(blob);
  var body = document.body;
  var a = document.createElement('a');

  body.appendChild(a);
  a.setAttribute('download', filename + '.svg');
  a.setAttribute('href', url);
  a.style.display = 'none';
  a.click();
  a.parentNode.removeChild(a);

  setTimeout(function() {
    window.URL.revokeObjectURL(url);
  }, 10);
}

function handleFiles(files) {
  if (!files.length) {
    fileList.innerHTML = "<div class=\"alert alert-warning\"><span class=\"glyphicon glyphicon-warning-sign\"></span> No file selected</div>";
  } else {
    fileList.innerHTML = "";
  var cross = "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>"
    for (var i = 0; i < files.length; i++) {
      var info = document.createElement("div");
    info.className = "alert alert-info";
      info.innerHTML = cross + "<span class=\"glyphicon glyphicon-info-sign\"></span> Received \"" + files[i].name + "\" with the size of " + files[i].size + " bytes.";
      fileList.appendChild(info);
      var file = files[i];
    }

    var reader = new FileReader();
    reader.onload = (function() {
      data1 = d3.csv.parseRows(reader.result, function(row, index) {
        if (index < 1) return row;
        else {
          // This assumes all columns are numeric except the first one
          for (i = 1; i < row.length; i++) row[i] = +row[i];        
          return row;
        };
      });
      data2 = google.visualization.arrayToDataTable(data1.slice(0,6));
      data3 = d3.csv.parse(reader.result);
      // data2.setColumnProperty(2,'role','annotation')
      // Alternative method 
      /*
      data2 = new google.visualization.DataTable();
      data2.addColumn('string', 'Country');
      data2.addColumn('number', 'Population');
      data2.addRows(data1.slice(1));
      */
      var tab_div = document.getElementById('tab');
      var tableview = new google.visualization.Table(tab_div);
      tableview.draw(data2);
    });
    reader.readAsText(file);
  } // This bracket ends the else statement
} // Ends the function handleFiles()



// A modified d3.geo.albersUsa to include Puerto Rico.
function albersUsaPr() {
  var ε = 1e-6;

  var lower48 = d3.geo.albers();

  // EPSG:3338
  var alaska = d3.geo.conicEqualArea()
      .rotate([154, 0])
      .center([-2, 58.5])
      .parallels([55, 65]);

  // ESRI:102007
  var hawaii = d3.geo.conicEqualArea()
      .rotate([157, 0])
      .center([-3, 19.9])
      .parallels([8, 18]);

  // XXX? You should check that this is a standard PR projection!
  var puertoRico = d3.geo.conicEqualArea()
      .rotate([66, 0])
      .center([0, 18])
      .parallels([18.5, 18]);

  var guam = d3.geo.conicEqualArea()
      .rotate([-144.7, 0])
      .center([0, 13.5])
      .parallels([8, 13.5]);

  var samoa = d3.geo.conicEqualArea()
    .rotate([170.5, 0])
    .center([0, -14])
    .parallels([8, 18])

  var point,
      pointStream = {point: function(x, y) { point = [x, y]; }},
      lower48Point,
      alaskaPoint,
      hawaiiPoint,
      puertoRicoPoint,
      guamPoint,
      samoaPoint;

  function albersUsa(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    point = null;
    (lower48Point(x, y), point)
        || (alaskaPoint(x, y), point)
        || (hawaiiPoint(x, y), point)
        || (puertoRicoPoint(x, y), point)
        || (guamPoint(x, y), point)
        || (samoaPoint(x, y), point);
    return point;
  }

  albersUsa.invert = function(coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= .120 && y < .234 && x >= -.425 && x < -.214 ? alaska
        : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii
        : y >= .204 && y < .234 && x >= .320 && x < .380 ? puertoRico
        : y >= .090 && y < .131 && x >= .343 && x < .388 ? guam
        : y >= .025 && y < .060 && x >= -.418 && x < -.359 ? samoa
        : lower48).invert(coordinates);
  };

  // A naïve multi-projection stream.
  // The projections must have mutually exclusive clip regions on the sphere,
  // as this will avoid emitting interleaving lines and polygons.
  albersUsa.stream = function(stream) {
    var lower48Stream = lower48.stream(stream),
        alaskaStream = alaska.stream(stream),
        hawaiiStream = hawaii.stream(stream),
        puertoRicoStream = puertoRico.stream(stream),
        guamStream = guam.stream(stream),
        samoaStream = samoa.stream(stream);
    return {
      point: function(x, y) {
        lower48Stream.point(x, y);
        alaskaStream.point(x, y);
        hawaiiStream.point(x, y);
        puertoRicoStream.point(x, y);
        guamStream.point(x, y);
        samoaStream.point(x, y);
      },
      sphere: function() {
        lower48Stream.sphere();
        alaskaStream.sphere();
        hawaiiStream.sphere();
        puertoRicoStream.sphere();
        guamStream.sphere();
        samoaStream.sphere();
      },
      lineStart: function() {
        lower48Stream.lineStart();
        alaskaStream.lineStart();
        hawaiiStream.lineStart();
        puertoRicoStream.lineStart();
        guamStream.lineStart();
        samoaStream.lineStart();
      },
      lineEnd: function() {
        lower48Stream.lineEnd();
        alaskaStream.lineEnd();
        hawaiiStream.lineEnd();
        puertoRicoStream.lineEnd();
        guamStream.lineEnd();
        samoaStream.lineEnd();
      },
      polygonStart: function() {
        lower48Stream.polygonStart();
        alaskaStream.polygonStart();
        hawaiiStream.polygonStart();
        puertoRicoStream.polygonStart();
        guamStream.polygonStart();
        samoaStream.polygonStart();
      },
      polygonEnd: function() {
        lower48Stream.polygonEnd();
        alaskaStream.polygonEnd();
        hawaiiStream.polygonEnd();
        puertoRicoStream.polygonEnd();
        guamStream.polygonEnd();
        samoaStream.polygonEnd();
      }
    };
  };

  albersUsa.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_);
    alaska.precision(_);
    hawaii.precision(_);
    puertoRico.precision(_);
    guam.precision(_);
    samoa.precision(_);
    return albersUsa;
  };

  albersUsa.scale = function(_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_);
    alaska.scale(_ * .35);
    hawaii.scale(_);
    puertoRico.scale(_);
    guam.scale(_);
    samoa.scale(_);
    return albersUsa.translate(lower48.translate());
  };

  albersUsa.translate = function(_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];

    lower48Point = lower48
        .translate(_)
        .clipExtent([[x - .455 * k, y - .238 * k], [x + .455 * k, y + .238 * k]])
        .stream(pointStream).point;

    alaskaPoint = alaska
        .translate([x - .307 * k, y + .201 * k])
        .clipExtent([[x - .425 * k + ε, y + .120 * k + ε], [x - .214 * k - ε, y + .234 * k - ε]])
        .stream(pointStream).point;

    hawaiiPoint = hawaii
        .translate([x - .205 * k, y + .212 * k])
        .clipExtent([[x - .214 * k + ε, y + .166 * k + ε], [x - .115 * k - ε, y + .234 * k - ε]])
        .stream(pointStream).point;

    puertoRicoPoint = puertoRico
        .translate([x + .300 * k, y + .224 * k])
        .clipExtent([[x + .275 * k, y + .204 * k], [x + .325 * k, y + .234 * k]])
        .stream(pointStream).point;

    guamPoint = guam
        .translate([x + .364 * k, y + .114 * k])
        .clipExtent([[x + .343 * k, y + .090 * k], [x + .388 * k, y + .131 * k]])
        .stream(pointStream).point;

    samoaPoint = samoa
        .translate([x - .395 * k, y + .038 * k])
        .clipExtent([[x - .418 * k, y + .025 * k], [x - .359 * k, y + .060 * k]])
        .stream(pointStream).point;

    return albersUsa;
  };

  return albersUsa.scale(1070);
}