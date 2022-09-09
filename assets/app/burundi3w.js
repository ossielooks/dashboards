

//declare charts

var typeChart  = dc.pieChart("#type");
var who  = dc.rowChart("#who");
var what = dc.rowChart("#what");
var whereChart = dc.geoChoroplethChart("#where");

var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);


// load data from a csv file
d3.csv("assets/data/burundi3w.csv", function (data) {
            // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",3f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            

			
          
			var sector = ndx.dimension(function (d) {return d.Sector;});
			var organization = ndx.dimension(function (d) {return d.Organization;});
			var province = ndx.dimension(function (d) {return d.Province;});
			var type = ndx.dimension(function (d) {return d.type;});

			 
          
			
			
			//groups
          
			var sectorGroup = sector.group().reduceCount(function(d){ return d.Sector;});
			var organizationGroup = organization.group().reduceCount(function(d){ return d.Province;});
			var provinceGroup = province.group().reduceCount(function(d){ return d.Organization;});
			var typeGroup = type.group().reduceCount(function(d){ return d.type;});
			
			var organizationCount = organizationGroup.top(1)[0];
				console.log(organizationCount);
          
            // colors

           	var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
				var thematicColors = d3.scale.ordinal().range(["#EE7623","#076DB6","#658BC7","#96ADD9","#CDD5ED","#555555"]);
				var fundingColors = d3.scale.ordinal().range(["#076DB6","#EE7623"]);
				
           
			//charts
					
				who.width(450).height(250)
					.margins({top: 0, left: 10, right: 10, bottom: 20})
                    .transitionDuration(700)
                    .dimension(organization)
                    .group(organizationGroup, "Org")
					.data(function(group) {
								return group.top(10);
								})
                    .colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#076DB6","#076DB6","#658BC7","#658BC7","#96ADD9","#96ADD9","#CDD5ED","#555555"]))
                    .renderLabel(true)
                    .gap(4)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s")); 
				
				what.width(230).height(250)
					.margins({top: 0, left: 10, right: 10, bottom: 20})
                    .transitionDuration(700)
                    .dimension(sector)
                    .group(sectorGroup, "Sector")
					.data(function(group) {
								return group.top(10);
								})
                    .colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#076DB6","#076DB6","#658BC7","#658BC7","#96ADD9","#96ADD9","#CDD5ED","#555555"]))
                    .renderLabel(true)
                    .gap(4)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s")); 
				
				typeChart//.height(250)
					//.margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(700)
                    .dimension(type)
                    .group(typeGroup)
					.radius(90)
                    .innerRadius(20)
					/* .data(function(group) {
								return group.top(10);
								}) */
                    .colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#96ADD9","#CDD5ED","#555555"]))
                    .renderLabel(true);
                    
				
				
				
				
				
				d3.json("assets/data/burundi.geojson", function (governJSON){
											whereChart.width(500).height(600)
											.dimension(province)
											.group(provinceGroup)
											.colors(d3.scale.quantize().range([/* '#E6F0FF','#CCE0FF','#B2D1FF', */'#99C2FF','#80B2FF','#66A3FF','#4D94FF','#3385FF','#1975FF','#0066FF','#005CE6','#0052CC','#0047B2','#003D99','#003380','#002966','#001F4C','#001433','#000A1A','#000000']))
											.colorDomain([0, 80])
											.colorAccessor(function(d, i){return i%d;})
											
											.colorCalculator(function (d) { return d ? whereChart.colors()(d) : '#E6F0FF'; })
											.overlayGeoJson(governJSON.features, "Governorates", function (d) {
												return d.properties.ADM1_NAME;
											})
											.projection(d3.geo.mercator().center([31.4,-3]).scale(71000)) /* Center on Burundi */
/* 											.data(function(group) {
								return group.top(10);
								})  */
											.title(function (d) {
												
												return "Province: " + d.key + "\nActors " + numberFormat(d.value ? d.value : 0)  ;
											});
											
											dc.renderAll(); 
									});

									
			 
							 
				
				
										
			
						
							
	
					
				dc.renderAll();

        }

);

 
