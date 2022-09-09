

//declare charts
var foodsecurity = dc.lineChart("#foodsecurity");
var refugeeidpChart = dc.lineChart("#displacementtrend");
var fundingGap = dc.lineChart("#fundingGap");
var refugeeChart = dc.rowChart("#refugee");
var idpChart = dc.rowChart("#IDP");
var informChoropleth = dc.geoChoroplethChart(".inform-risk");
var foodtrendChart = dc.lineChart("#foodtrend");
//var risktrendChart = dc.lineChart("#risktrend");
var fundingChart = dc.barChart("#funding");
var hazards_chart = dc.geoChoroplethChart(".hazards");
var vulnerability_chart = dc.geoChoroplethChart(".vulnerability");
var coping_capacity_chart = dc.geoChoroplethChart(".coping-capacity");



var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);


// load data from a csv file
d3.csv("assets/data/fundingD.csv", function (data) {
            // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",3f");
			

            // feed it through crossfilter
            var ndx = crossfilter(data);
            

			 
          
			//dimensions
			var year = ndx.dimension(function (d) {return d.YEAR;});
			var country = ndx.dimension(function (d) {return d.NAME;});
			//var yearDimension = ndx.dimension(function(d) {return [+d.NAME, +d.YEAR]; });
			
			//groups
          
			var foodsec = year.group().reduceSum(function(d){ return d.FS;});
			var nutrition = year.group().reduceSum(function(d){ return d.NUTRITION;});
			var wash = year.group().reduceSum(function(d){ return d.WASH;});
			var idps = year.group().reduceSum(function(d){ return d.IDPS;});
			var refugees = year.group().reduceSum(function(d){ return d.REFUGEES;});
			var funded = year.group().reduceSum(function(d){ return d.Fundedinmillions;});
			var unmet = year.group().reduceSum(function(d){ return d.Unmetinmillions;});
			var requirements = year.group().reduceSum(function(d){return d.Committedinmillions;});
			//var refugeeidpyear = refugeeidp.group().reduceSum(function(d){ return d.YEAR;});
			//var fundingbyYear = funding.group().reduceSum(function(d) {return d.YEAR;});
			
			
			//var yearGroup = yearDimension.group().reduceSum(function(d) { return +d.INFORM; });
			
			
			var countryByFunded = country.group().reduceSum(function (d) { return d.Fundedinmillions; });
			var countryByUnmet = country.group().reduceSum(function (d) { return d.Unmetinmillions; });
			var countryByRefugees = country.group().reduceSum(function (d) { return d.REFUGEES; });
			var countryByIdps = country.group().reduceSum(function (d) { return d.IDPS; });
			var countryByPin = country.group().reduceSum(function (d) { return d.PIN; });
			var refugeeByYear = year.group().reduceSum(function (d) { return d.REFUGEE; });
			var idpByYear = year.group().reduceSum(function (d) { return d.IDPS; });
           
			var hazards = country.group().reduceSum(function (d) { return d.HAZARDS; });
			var vulnerability = country.group().reduceSum(function (d) { return d.VULNERABILITY; });
			var copingCapacity = country.group().reduceSum(function (d) { return d.COPINGCAPACITY; });
			var informriskindex = country.group().reduceSum(function(d) {return d.INFORM;});
			var informriskindextrend = country.group().reduceSum(function(d) {return d.RiskTrend;});
			
			var fundingAll = ndx.groupAll().reduceSum(function(d) {return d.Fundedinmillions;});
			var committedAll = ndx.groupAll().reduceSum(function(d) {return d.Committedinmillions;});
			var fsAll = ndx.groupAll().reduceSum(function(d) {return d.FS;});
			var idpAll = ndx.groupAll().reduceSum(function(d) {return d.IDPS;});
			var refugeeAll = ndx.groupAll().reduceSum(function(d) {return d.REFUGEES;});
			var pinAll = ndx.groupAll().reduceSum(function(d) {return d.PIN;});
			var nutritionAll = ndx.groupAll().reduceSum(function(d) {return d.NUTRITION;});
			var all = ndx.groupAll();
			
			
			
			var foodsecbubbles = country.group().reduce(
                function (p, v) {
                    p.foodInsecure += +v["FS"];
                    p.numberRefugees += +v["REFUGEES"];
					
                    return p;
                },
                function (p, v) {
                    p.foodInsecure -= +v["FS"];
                    p.numberRefugees -= +v["REFUGEES"];
					
					 return p;
                },
                function () {
                    return {foodInsecure: 0 , numberRefugees: 0 };
                }				
				
        );
			
			
          
            // colors

           	var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
				var thematicColors = d3.scale.ordinal().range(["#EE7623","#076DB6","#658BC7","#96ADD9","#CDD5ED","#555555"]);
				var fundingColors = d3.scale.ordinal().range(["#076DB6","#EE7623"]);
				
           
			//charts
					
				refugeeChart.width(150).height(250)
					.margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(700)
                    .dimension(country)
                    .group(countryByRefugees, "Refugees")
					.data(function(group) {
								return group.top(10);
								})
                    .colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#076DB6","#076DB6","#658BC7","#658BC7","#96ADD9","#96ADD9","#CDD5ED","#555555"]))
                    .renderLabel(true)
                    .gap(4)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s")); 
				
				idpChart.width(150).height(250)
					.margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(700)
                    .dimension(country)
                    .group(countryByIdps, "IDPs")
					.data(function(group) {
								return group.top(10);
								})
                    .colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#076DB6","#076DB6","#658BC7","#658BC7","#96ADD9","#96ADD9","#CDD5ED","#555555"]))
                    .renderLabel(true)
                    .gap(4)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
                    .xAxis().ticks(3).tickFormat(d3.format("s")); 
					
											  
				  
				
				/* peopleinneed.width(250).height(250)
					.margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(700)
                    .dimension(country)
                    .group(countryByPin)
					.data(function(group) {
								return group.top(10);
								})
                    .colors(d3.scale.ordinal().range(["#EE7623","#076DB6","#076DB6","#076DB6","#658BC7","#658BC7","#96ADD9","#96ADD9","#CDD5ED","#555555"]))
                    .renderLabel(true)
                    .gap(4)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s"));  */
					
					
					
                fundingChart.width(450)
                    .height(220)
                    .transitionDuration(750)
                    .margins({top: 50, right: 0, bottom: 20, left: 40})
                    .dimension(country)
                    .group(countryByFunded, "Funded amount (Million USD)")
					.colors(fundingColors)
					.clipPadding(10)
                    .brushOn(false)
                    .gap(10)
                    .elasticY(true)
                    .xUnits(dc.units.ordinal)
					.stack(countryByUnmet, "Unmet requirements (Million USD)")
					.title(function(d){
                    return d.key
                            + "\n Amount(USD): " + numberFormat(d.value) + "Million" ;
							})
					.legend(dc.legend().x(220).y(5).itemHeight(13).gap(5))
                    .x(d3.scale.ordinal().domain(5)) 
                   .renderHorizontalGridLines(true)				
					fundingChart.yAxis().ticks(5).tickFormat(d3.format("s")); 
					
					
				/* fundingpie
				.width(200) // (optional) define chart width, :default = 200
				.height(200) // (optional) define chart height, :default = 200
				.transitionDuration(500) // (optional) define chart transition duration, :default = 350
			// (optional) define color array for slices
				.colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
				// (optional) define color domain to match your data domain if you want to bind data or color
				.colorDomain([-1750, 1644])
				// (optional) define color value accessor
				.colorAccessor(function(d, i){return d.value;})
				.radius(90) // define pie radius
				// (optional) if inner radius is used then a donut chart will
				// be generated instead of pie chart
				.innerRadius(40)
				.dimension(gainOrLoss) // set dimension
				.group(gainOrLossGroup) // set group
				// (optional) by default pie chart will use group.key as it's label
				// but you can overwrite it with a closure
				.label(function(d) { return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)"; })
				// (optional) whether chart should render labels, :default = true
				.renderLabel(true)
				// (optional) by default pie chart will use group.key and group.value as its title
				// you can overwrite it with a closure
				.title(function(d) { return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)"; })
				// (optional) whether chart should render titles, :default = false
				.renderTitle(true); */
				
				/*  fundingpie.width(180) 
                    .height(300)    
                    .transitionDuration(750)
                    .radius(90)
                    .innerRadius(30)
                    .dimension(funding)
                    .title(function (d) { return ""; })
                    .group(fundingbyYear)
                    .colors(expenseColors)
                    .renderLabel(true); */
					
			refugeeidpChart
				   .width(500)
					.height(250)
					.margins({top: 80, right:90, bottom: 30, left: 40})
					.renderArea(true)
					.dimension(year)
					.interpolate("monotone") 
					.colors(fundingColors)
					.group(refugees, 'Refugees')
					//.clipPadding(100)
				  
					 .stack(idps, 'IDPs', function (d) {
							return d.value;
						}) 
					/* .stack(wash, 'WASH', function (d) {
							return d.value;
						}) */
					/* .stack(health, 'Health', function (d) {
							return d.value;
						}) */
					/* .stack(education, 'EDUCATION', function (d) {
							return d.value;
						}) */
					//.colors(expenseColors)
					.legend(dc.legend().x(250).y(0).itemHeight(13).gap(5))
					.x(d3.scale.linear().domain([2011, 2016]))
					.renderHorizontalGridLines(true)
					.elasticY(true)
					.brushOn(false)
					.dotRadius(10)
					//.clipPadding(10)
					.title(function(d){
						return d.key
								+ "\ntotal: " + numberFormat(d.value) ;
					})
					.xAxis().ticks(5).tickFormat(d3.format("d"))
					//.y(d3.scale.linear().domain([0, 8000000000]));
					refugeeidpChart.yAxis().ticks(4).tickFormat(d3.format("s"));
					refugeeidpChart.filter('2016');
					
					
					
					foodtrendChart
				   .width(500)
					.height(250)
					.margins({top: 30, right:30, bottom: 30, left: 40})
					.padding({top:10})
					.renderArea(true)
					.dimension(year)
					.interpolate("monotone") 
					.colors(fundingColors)
					.group(foodsec, 'Food Security')
				  
					 /* .stack(idps, 'IDPs', function (d) {
							return d.value; 
						}) */
				
					.legend(dc.legend().x(250).y(0).itemHeight(13).gap(5))
					.x(d3.scale.linear().domain([2011, 2016]))
					.renderHorizontalGridLines(true)
					.elasticY(true)
					.brushOn(false)
					.dotRadius(10)
					//.clipPadding(10)
					.title(function(d){
						return d.key
								+ "\ntotal: " + numberFormat(d.value) ;
					})
					.xAxis().ticks(5).tickFormat(d3.format("d"))
					//.y(d3.scale.linear().domain([0, 8000000000]));
					foodtrendChart.yAxis().ticks(4).tickFormat(d3.format("s"));
					foodtrendChart.filter('2016');
					
					/* risktrendChart
					.width(450)
						.height(480)
						//.interpolate('basis')
						.x(d3.scale.linear().domain([2011,2016]))
						.brushOn(false)
						.yAxisLabel("Inform Risk")
						.xAxisLabel("Year")
						.clipPadding(10)
						.elasticY(true)
						.dimension(yearDimension)
						.group(yearGroup)
						._rangeBandPadding(1)
						//.mouseZoomable(true)
						.seriesAccessor(function(d) {return "Country: " + d.key[0];})
						.keyAccessor(function(d) {return +d.key[1];})
						.valueAccessor(function(d) {return +d.value;})
						.legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
					  chart.yAxis().tickFormat(function(d) {return d3.format(',d')(d);});
					  chart.margins().left += 40;
					 */
					
					
					
					/* risktrendChart
				   .width(500)
					.height(250)
					.margins({top: 30, right:30, bottom: 30, left: 40})
					.renderArea(true)
					.dimension(year)
					.interpolate("monotone") 
					.colors(fundingColors)
					.group(informriskindextrend, 'Inform Risk')
				  
					 /* .stack(idps, 'IDPs', function (d) {
							return d.value; 
						}) */
				
					/* .legend(dc.legend().x(250).y(0).itemHeight(13).gap(5))
					.x(d3.scale.linear().domain([2011, 2016]))
					.renderHorizontalGridLines(true)
					.elasticY(true)
					.brushOn(false)
					.dotRadius(10) */
					//.clipPadding(10)
					/* .title(function(d){
						return d.key
								+ "\ntotal: " + numberFormat(d.value) ;
					})
					.xAxis().ticks(5).tickFormat(d3.format("d")) */
					//.y(d3.scale.linear().domain([0, 8000000000]));
					/* risktrendChart.yAxis().ticks(4).tickFormat(d3.format("d"));
					risktrendChart.filter('2016'); */ 
                                            
											
				fundingGap
				   .width(500)
					.height(220)
					.margins({top: 80, right:90, bottom: 30, left: 40})
					.renderArea(true)
					.dimension(year)
					.interpolate("monotone") 
					.colors(fundingColors)
					.group(funded, 'Funding received')
				  
					 .stack(unmet, 'Funding gap (UNMET)', function (d) {
							return d.value;
						}) 
					/* .stack(wash, 'WASH', function (d) {
							return d.value;
						}) */
					/* .stack(health, 'Health', function (d) {
							return d.value;
						}) */
					/* .stack(education, 'EDUCATION', function (d) {
							return d.value;
						}) */
					//.colors(expenseColors)
					.legend(dc.legend().x(250).y(0).itemHeight(13).gap(5))
					.x(d3.scale.linear().domain([2011, 2016]))
					.renderHorizontalGridLines(true)
					.elasticY(true)
					.brushOn(true)
					.dotRadius(10)
					//.clipPadding(10)
					.title(function(d){
						return d.key
								+ "\ntotal: " + numberFormat(d.value) ;
					})
					.xAxis().ticks(5).tickFormat(d3.format("d"))
					//.y(d3.scale.linear().domain([0, 8000000000]));
					fundingGap.yAxis().ticks(4).tickFormat(d3.format("s"));
					fundingGap.filter('2016');
					
					
				foodsecurity
				   .width(500)
					.height(220)
					.margins({top: 40, right:90, bottom: 30, left: 40})
					.renderArea(true)
					.dimension(year)
					.interpolate("monotone") 
					.colors(thematicColors)
					.group(foodsec, 'Food Security')
				  
					/* .stack(nutrition, 'NUTRITION', function (d) {
							return d.value;
						}) */
					/* .stack(wash, 'WASH', function (d) {
							return d.value;
						}) */
					/* .stack(health, 'Health', function (d) {
							return d.value;
						}) */
					/* .stack(education, 'EDUCATION', function (d) {
							return d.value;
						}) */
					//.colors(expenseColors)
					.legend(dc.legend().x(350).y(0).itemHeight(13).gap(5))
					.x(d3.scale.linear().domain([2011, 2016]))
					.renderHorizontalGridLines(true)
					.elasticY(true)
					.brushOn(true)
					.dotRadius(40)
					//.clipPadding(10)
					.title(function(d){
						return d.key
								+ "\nAmount: " + numberFormat(d.value.FS) ;
					})
					.xAxis().ticks(5).tickFormat(d3.format("d"))
					//.y(d3.scale.linear().domain([0, 8000000000]));
					foodsecurity.yAxis().ticks(4).tickFormat(d3.format("s"));
					//foodsecurity.filter('2016');
					
				dc.dataCount("#funding-figure").dimension(ndx).group(fundingAll);
				dc.dataCount("#requested-figure").dimension(ndx).group(committedAll);
				dc.dataCount("#pin-figure").dimension(ndx).group(pinAll);
				dc.dataCount("#refugees-figure").dimension(ndx).group(refugeeAll);
				dc.dataCount("#idps-figure").dimension(ndx).group(idpAll);
				dc.dataCount("#fs-figure").dimension(ndx).group(fsAll);
				
				dc.dataCount("#nutrition-figure").dimension(ndx).group(nutritionAll);
				
				
				d3.json("assets/data/ea-region.geojson", function (governJSON){
											informChoropleth.width(410).height(335)
											.dimension(country)
											.group(informriskindex)
										
											.colors(d3.scale.quantize().range(["#FFFFFF","#FFE6E6","#FFCCCC","#FFB2B2","#FF9999","#FF8080","#FF6666","#FF4D4D","#FF3333","#FF1919","#FF0000","#E60000","#CC0000","#B20000","#990000","#800000","#660000","#4C0000","#330000","#1A0000","#000000"]))
											.colorDomain([0, 10])
											.colorAccessor(function(d, i){return i%10;})
											
											.colorCalculator(function (d) { return d ? informChoropleth.colors()(d) : "#FFFFFF"; })
											.overlayGeoJson(governJSON.features, "Governorates", function (d) {
												return d.properties.id;
											})
											.projection(d3.geo.mercator().center([60,2]).scale(4500)) /* Center on Eastern Africa */
											.data(function(group) {
								return group.top(10);
								}) 
											.title(function (d) {
											
												return "Country: " + d.key + "\nInform Risk Index " + numberFormat(d.value ? d.value : 0)  ;
											});
											
											dc.renderAll(); 
									});
									
				d3.json("assets/data/ea-region.geojson", function (governJSON){
							hazards_chart.width(400).height(330)
								.dimension(country)
								.group(hazards)
								.colors(d3.scale.quantize().range(['#FFF5E6','#FFEBCC','#FFE0B2','#FFD699','#FFCC80','#FFC266','#FFB84D','#FFAD33','#FFA319','#FF9900','#E68A00','#CC7A00','#B26B00','#995C00','#804C00','#663D00','#4C2E00','#331F00','#1A0F00','#000000']))
								.colorDomain([0, 13])
								.colorCalculator(function (d) { return d ? hazards_chart.colors()(d) : '#FFC266'; })
								.overlayGeoJson(governJSON.features, "Governorates", function (d) {
									return d.properties.id;
								})
								.projection(d3.geo.mercator().center([60,2]).scale(4500)) 
								.title(function (d) {
									
									return "Country: " + d.key + "\nHazard " + numberFormat(d.value ? d.value : 0)  ;
								});
								
								dc.renderAll(); 
								
						});
				
				
				d3.json("assets/data/ea-region.geojson", function (governJSON){
											vulnerability_chart.width(400).height(330)
											.dimension(country)
											.group(vulnerability)
											.colors(d3.scale.quantize().range(['#E6F0FF','#CCE0FF','#B2D1FF','#99C2FF','#80B2FF','#66A3FF','#4D94FF','#3385FF','#1975FF','#0066FF','#005CE6','#0052CC','#0047B2','#003D99','#003380','#002966','#001F4C','#001433','#000A1A','#000000']))
											.colorDomain([0, 10])
											.colorAccessor(function(d, i){return i%10;})
											
											.colorCalculator(function (d) { return d ? vulnerability_chart.colors()(d) : '#0061B5'; })
											.overlayGeoJson(governJSON.features, "Governorates", function (d) {
												return d.properties.id;
											})
											.projection(d3.geo.mercator().center([60,2]).scale(4500)) /* Center on Eastern Africa */
											.data(function(group) {
								return group.top(10);
								}) 
											.title(function (d) {
												
												return "Country: " + d.key + "\nVulnerability " + numberFormat(d.value ? d.value : 0)  ;
											});
											
											dc.renderAll(); 
									});

									
			  
			  /* dc.leafletChoroplethChart(parent,chartGroup)
							  .mapOptions({..})       - set leaflet specific options to the map object; Default: Leaflet default options
							  .center([60,2])      - get or set initial location
							  .zoom(5)                - get or set initial zoom level
							  .map()                  - get map object
							  .geojson()              - geojson object describing the features
							  .featureOptions()       - object or a function (feature) to set the options for each feature
							  .featureKeyAccessor()   - function (feature) to return a feature property that would be compared to the group key; Defauft: feature.properties.key
							  .popup()                - function (d,feature) to return the string or DOM content of a popup
							  .renderPopup(true)      - set if popups should be shown; Default: true
							  .brushOn(true)          - if the map would select datapoints; Default: true
							  
							  
							  
			dc.leafletChoroplethChart("#demo3 .map")
								.dimension(country)
							  .group(copingCapacity)
							  .width(400)
								.height(600)
							  .center([42.69,25.42])
							  .zoom(7)
							  .geojson(governJSON)
							  //colors(['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'])
							  .colors(d3.scale.quantize().range(["#FFFFFF","#E6F0E6","#CCE0CC","#B2D1B2","#99C299","#80B280","#66A366","#4D944D","#338533","#197519","#006600","#005C00","#005200","#004700","#003D00","#003300","#002900","#001F00","#001400","#000A00","#000000"]))
								.colorDomain([0, 15])									
							  //.colorDomain(function() {
							  //  return [dc.utils.groupMin(this.group(), this.valueAccessor()),
							  //   dc.utils.groupMax(this.group(), this.valueAccessor())];
							 // })
							  .colorAccessor(function(d,i) {
								return d.value;
							  })
							  .featureKeyAccessor(function(feature) {
								return feature.properties.id;
							  })
							  .renderPopup(true)
							  .popup(function(d,feature) {
								return feature.properties.id+" : "+d.id;
							  });   */

							
										  
				d3.json("assets/data/ea-region.geojson", function (governJSON){
										coping_capacity_chart.width(400).height(330)
											.dimension(country)
											.group(copingCapacity)
											.colors(d3.scale.quantize().range(["#FFFFFF","#E6F0E6","#CCE0CC","#B2D1B2","#99C299","#80B280","#66A366","#4D944D","#338533","#197519","#006600","#005C00","#005200","#004700","#003D00","#003300","#002900","#001F00","#001400","#000A00","#000000"]))
											.colorDomain([0, 15])
											.colorCalculator(function (d) { return d ? coping_capacity_chart.colors()(d) : '#99C299'; })
											.overlayGeoJson(governJSON.features, "Governorates", function (d) {
												return d.properties.id;
											})
											.projection(d3.geo.mercator().center([60,2]).scale(4500))  
											.title(function (d) {
											
												return "Country: " + d.key + "\nCoping Capacity " + numberFormat(d.value ? d.value : 0)  ;
											});
											
											dc.renderAll(); 
									});		
					
				
							 
				
				dc.dataCount(".dc-data-count")
						.dimension(ndx)
						.group(all);

				dc.dataTable("#dc-data-table")
						.dimension(country)
						.group(function (d) {
							return d.YEAR;
						})
						.size(170)
						.columns([
								 function (d) {
								return d.NAME;
							}, 
							
							function (d) {
								return d.PRIORITIES;
							}
						])
						.sortBy(function (d) {
							return d.NAME;
						})
						.order(d3.ascending)
						.renderlet(function (table) {
							table.selectAll(".dc-table-group").classed("info", true);
						});
			
					 
					
										
			
						dc.bubbleOverlay("#foodsec-bubbles")
						.svg(d3.select("#foodsec-bubbles svg"))
						.transitionDuration(0)
								.width(410)
								.height(350)
								.dimension(country)
								.group(foodsecbubbles)
								.radiusValueAccessor(function(p) {
									return p.value.foodInsecure;
								})
								.r(d3.scale.linear().domain([0, 40000000]))
								.colors(d3.scale.quantize().range(['#E6F0FF']))
								.colorDomain([0, 100])
								.colorAccessor(function(d) {
									return d.value.foodInsecure;
								})
								.renderLabel(true)
								
								.label(function(d) {return numberFormat((d.value.foodInsecure/1000000).toFixed(2)) + "\nM" ;})
								.title(function(d) {
									return "Country: " + d.key
											 + "\nTotal number of food insecure: " + numberFormat((d.value.foodInsecure/1000000).toFixed(2))+ "M"
											; 
								})
								
									.point("KEN", 273, 287)
									.point("SSD", 177, 212)
									.point("SOM", 366, 248)
									.point("ETH", 276, 203)
									.point("SDN", 177, 101)
									.point("BRN", 150, 346)
									.point("RWA", 147, 317)
									.point("ERI", 218, 94)
									.point("DJI", 324, 145)
									.point("UGA", 197, 287)
									.debug(false);
			
			
			
						var projection = d3.geo.mercator()
							.center([55,4]).scale(4500)
						var path = d3.geo.path()
							.projection(projection);

						var g = d3.selectAll("#foodsec-bubbles").select("svg").append("g");
								 
						g.selectAll("path")
							.data(earegionsvg.features)
							.enter()
							.append("path")
							.attr("d", path)
							.attr("stroke",'#D1D2D4')
							
							.attr("class", function(d) { return d.properties.id;});
							
							var oc = chart.onClick;
							chart.onClick = function (d) {
									var had_others = chart.filters().indexOf("Others")>=0;
									if(d.key === "Others") {
										chart.filter(null); 
										if(!had_others)
											oc.call(chart, d); 
										else chart.redrawGroup(); 
									 } else { 
										 if(had_others) chart.filter(null); 
										 oc.call(chart, d); 
									 } 
								}
	
					
				dc.renderAll();

        }

);

 
