
d3.tsv("assets/data/acledea20164.csv", function(data) {
  drawMarkerSelect(data);
  drawMarkerArea(data);
});


				
				
function drawMarkerSelect(data) {
  var xf = crossfilter(data);
  var groupname = "marker-select";
	var facilities = xf.dimension(function(d) { return d.latlong; });
	var fatalities = xf.dimension(function(d) { return d.FATALITIES; });
	var location = xf.dimension(function (d){return d.ADM_LEVEL1; });
	//var source = xf.dimension(function(d) { return d.SOURCE; });
	//var sourceGroup = source.group().reduceCount(function(d) { return d.SOURCE; });
	var facilitiesGroup = facilities.group().reduceCount(function(d) { return d.ADM_LEVEL_1; });
	var types = xf.dimension(function(d) { return d.EVENT_TYPE; });
	var typesGroup = types.group().reduceCount();
	var allOccurences = xf.groupAll();
	var allFatalities = xf.groupAll().reduceSum(function(d) {return d.FATALITIES;});
	var allInteraction = xf.groupAll().reduceSum(function(d) { return d.INTERACTION;})
	var parseDate = d3.time.format("%d/%m/%Y").parse;
				data.forEach(function(d) {
					d.date = parseDate(d.date);
					d.month = d3.time.month(d.date);
					
				});
				
				
				var dateDim = xf.dimension(function(d) {return d.month;});
				

				var minDate = dateDim.bottom(1)[0].date;
				var maxDate = dateDim.top(1)[0].date;
				console.log('maxDate');
				//var fatalitiesByTime = dateDim.group().reduceSum(function(d) { return d.FATALITIES;});
				var fatalitiesByTime = location.group().reduceSum(function(d) { return d.FATALITIES;});
				var maxFatalities = fatalitiesByTime.top(1)[0];
				var interactionByTime = location.group().reduceSum(function(d) { return d.INTERACTION;});
				console.log(maxFatalities);
			var occurencesByTime = dateDim.group().reduceCount(function(d) { return d.ADM_LEVEL_1;});
			
	

  dc.leafletMarkerChart("#demo1 .map",groupname)
      .dimension(facilities)
	  //.locationAccessor(facilities)
      .group(facilitiesGroup)
      .width(400)
	    .height(600)
      .center([-3.3,30])
      .zoom(8)
	  .brushOn(true)
	  .filterByArea(true)
      .cluster(true);  

	

  dc.pieChart(".pie",groupname)
	//.margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(types)
      .group(typesGroup)
      .width(210)
	    .height(300)
		.radius(100)
		.innerRadius(20)
		.colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#658BC7","#96ADD9","#CDD5ED","#555555"]))
	    .renderLabel(true)
	    .renderTitle(true)
		.data(function(group) {
								return group.top(4);
								}) 
		//.elasticX(true)
      .ordering(function (p) {
        return -p.value;
      });
	  
	  
	 /*  dc.rowChart(".row2",groupname)
      .dimension(source)
      .group(sourceGroup)
      .width(250)
	  .height(300)
	   .renderLabel(true)
	    .renderTitle(true)
		.elasticX(true)
		.title(function (d) { return d.value; })
		.colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#076DB6","#076DB6","#658BC7","#658BC7","#96ADD9","#96ADD9","#CDD5ED","#555555"]))
                                       //.gap(4)
                    .title(function (d) { return d.value; })
					.data(function(group) {
								return group.top(10);
								})
                    //.elasticX(true)
      .ordering(function (p) {
        return -p.value;
      }); */
	  
	dc.lineChart(".row1",groupname)
						.width(950).height(200)
						.transitionDuration(750)
						.dimension(dateDim)
						.group(occurencesByTime)
						.brushOn(true)
						.elasticX(true)
						.x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2015, 8, 31)]))
						.round(d3.time.month.round)
						.xUnits(d3.time.months);

							

									
				dc.dataCount("#occurences",groupname).dimension(xf).group(allOccurences);
				dc.dataCount("#fatalities",groupname).dimension(xf).group(allFatalities);
				dc.dataCount("#interaction",groupname).dimension(xf).group(allInteraction);
				
	dc.renderAll(groupname);
}
