

var hazards_chart = dc.geoChoroplethChart("#hazards");
var vulnerability_chart = dc.geoChoroplethChart("#vulnerability");
var coping_capacity_chart = dc.geoChoroplethChart("#coping-capacity");
//var trendChart = dc.lineChart("#trendChart")
var informChoropleth = dc.geoChoroplethChart("#inform");


var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);


// load data from a csv file
d3.csv("assets/data/inform_sub_national.csv", function (data) {
            // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",3f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            

			
          
			//dimensions
			var hazards = ndx.dimension(function (d) {return d.HAZARD;});
			var vulnerability = ndx.dimension(function (d) {return d.VULNERABILITY;});
			var copingCapacity = ndx.dimension(function (d) {return d.COPING;});
			var informIndex = ndx.dimension(function (d) {return d.RISK;});
			//var year = ndx.dimension(function (d) {return d.YEAR;});
			var country = ndx.dimension(function (d) {return d.ADMIN1;});
			
			//groups
            
			//var yearFeature = year.group().reduceSum(function (d) { return d.HAZARDS; });
			
			var countryHazards = country.group().reduceSum(function (d) { return d.HAZARD; });
			var countryVulnerability = country.group().reduceSum(function (d) { return d.VULNERABILITY; });
			var countryCopingCapacity= country.group().reduceSum(function (d) { return d.COPING; });
			var countryRisk= country.group().reduceSum(function (d) { return d.RISK; });
			
			
			var informgroup = country.group().reduce(
                function (p, v) {
                    p.coping += +v["COPING"];
                    p.vulnerability += +v["VULNERABILITY"];
					p.hazards += +v["HAZARD"];
					
					p.inform = p.coping * p.vulnerability * p.hazards;
					
                    return p;
                },
                function (p, v) {
                    p.coping -= +v["COPING"];
                    p.vulnerability -= +v["VULNERABILITY"];
					p.hazards -= +v["HAZARD"];
					
					p.inform = p.coping * p.vulnerability * p.hazards;
					
					 return p;
                },
                function () {
                    return {coping: 0, vulnerability: 0, hazards: 0, inform: 0};
					//return {inform: 0};
                }				
				
        );
			
			var maxamount = informgroup.top(1)[0].value;
			console.log(maxamount);
			
		
			
       
			
			var all = ndx.groupAll();

            // TODO clean up this part
            // tooltips for row chart
            var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #f0027f'>" +  d.key + "</span> : "  + numberFormat(d.value); });

            // tooltips for pie chart
            var pieTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #f0027f'>" +  d.data.key + "</span> : "  + numberFormat(d.value); });

            // tooltips for bar chart
            var barTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat(d.y);});

            
           // var expenseColors = ["#fde0dd","#fa9fb5","#e7e1ef","#d4b9da","#c994c7","#fcc5c0","#df65b0","#e7298a","#ce1256", "#f768a1","#dd3497","#e78ac3","#f1b6da","#c51b7d"];
			//var expenseColors = ["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"];
				var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
				//var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
           
		
                                            
			/* trendChart
               .width(600)
                .height(300)
                .margins({top: 70, right: 20, bottom: 30, left: 60})
				//.renderArea(false)
                .dimension(year)
                .group(yearFeature)
                .valueAccessor(function(d) {
                    return d.value;
                })
				
				//.colors(expenseColors)
				.legend(dc.legend().x(350).y(25).itemHeight(13).gap(5))
                .x(d3.scale.linear().domain([2010, 2016]))
                .renderHorizontalGridLines(true)
                .elasticY(true)
                //.brushOn(false)
                .title(function(d){
                    return d.key
                            + "\nAmount: " + Math.round(d.value.funded);
                })
                .xAxis().ticks(5).tickFormat(d3.format("d"))
				//.y(d3.scale.linear().domain([0, 8000000000]));
				trendChart.yAxis().ticks(6).tickFormat(d3.format("s"));
				trendChart.filter('2015'); */
				
            dc.dataCount(".dc-data-count") //, "expenditures"
                    .dimension(ndx)
                    .group(all);

            dc.dataTable(".dc-data-table")//, "expenditures"
                    .dimension(country)
                    .group(function (d) {
                        return d.NAME;
                    })
                    .size(170)
                    .columns([
                            /* function (d) {
                            return d.YEAR;
                        }, */
                        function (d) {
                            return numberFormat(d.COMMITTED);
                        },
                        function (d) {
                            return numberFormat(d.FUNDED);
                        },
						function (d) {
                            return numberFormat(d.PIN);
                        },
                        function (d) {
                            return numberFormat(d.TAR);
                        }
                    ])
                    /* .sortBy(function (d) {
                        return d.YEAR;
                    }) */
                    .order(d3.ascending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

           // expFiveYearBarChart.filter(2014);
			
				d3.json("assets/data/ea-admin1.GEOJSON", function (governJSON){
							hazards_chart.width(400).height(330)
								.dimension(country)
								.group(countryHazards)
								.colors(d3.scale.quantize().range(['#FFF5E6','#FFEBCC','#FFE0B2','#FFD699','#FFCC80','#FFC266','#FFB84D','#FFAD33','#FFA319','#FF9900','#E68A00','#CC7A00','#B26B00','#995C00','#804C00','#663D00','#4C2E00','#331F00','#1A0F00','#000000']))
								.colorDomain([0, 15])
								/* .colorDomain([0, 10])
								.colors(d3.scale.quantize().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF","#0061B5"])) */
								//.colorAccessor(function(d, i){return i%7;})
								//.colorAccessor(function(d, i){return d.key;})
								.colorCalculator(function (d) { return d ? hazards_chart.colors()(d) : '#FFB84D'; })
								.overlayGeoJson(governJSON.features, "Governorates", function (d) {
									return d.properties.ADM1_NAME;
								})
								.projection(d3.geo.mercator().center([60,2]).scale(4500))  /* Center on Eastern Africa */
								.title(function (d) {
									//return "code: " + gcode2[d.key] + gcode2[d.value];
									return "Country: " + d.key + "\nHazard " + numberFormat(d.value ? d.value : 0)  ;
								});
								
								dc.renderAll(); 
								
						});
				//hazards_chart.filter('2015');
				
				d3.json("assets/data/ea-admin1.GEOJSON", function (governJSON){
											vulnerability_chart.width(400).height(330)
											.dimension(country)
											.group(countryVulnerability)
											//.colors(d3.scale.quantize().range(["blue","red","green","yellow","purple","orange","pink","grey","brown","black"]))
											.colors(d3.scale.quantize().range(['#E6F0FF','#CCE0FF','#B2D1FF','#99C2FF','#80B2FF','#66A3FF','#4D94FF','#3385FF','#1975FF','#0066FF','#005CE6','#0052CC','#0047B2','#003D99','#003380','#002966','#001F4C','#001433','#000A1A','#000000']))
											.colorDomain([0, 10])
											.colorAccessor(function(d, i){return i%10;})
											//.colorAccessor(function(d, i){return d.key;})
											.colorCalculator(function (d) { return d ? vulnerability_chart.colors()(d) : '#0061B5'; })
											.overlayGeoJson(governJSON.features, "Governorates", function (d) {
												return d.properties.ADM1_NAME;
											})
											.projection(d3.geo.mercator().center([60,2]).scale(4500)) /* Center on Eastern Africa */
											/* .data(function(group) {
								return group.top(10);
								})  */
											.title(function (d) {
												//return "code: " + gcode2[d.key] + gcode2[d.value];
												return "Country: " + d.key + "\nVulnerability " + numberFormat(d.value ? d.value : 0)  ;
											});
											//vulnerability_chart.filter('SSD');
											dc.renderAll(); 
									});

									
			  //orange['#FFF5E6','#FFEBCC','#FFE0B2','#FFD699','#FFCC80','#FFC266','#FFB84D','#FFAD33','#FFA319','#FF9900','#E68A00','#CC7A00','#B26B00','#995C00','#804C00','#663D00','#4C2E00','#331F00','#1A0F00','#000000']
			 //blue	['#E6F0FF','#CCE0FF','#B2D1FF','#99C2FF','#80B2FF','#66A3FF','#4D94FF','#3385FF','#1975FF','#0066FF','#005CE6','#0052CC','#0047B2','#003D99','#003380','#002966','#001F4C','#001433','#000A1A','#000000']
			//green	["#FFFFFF","#E6F0E6","#CCE0CC","#B2D1B2","#99C299","#80B280","#66A366","#4D944D","#338533","#197519","#006600","#005C00","#005200","#004700","#003D00","#003300","#002900","#001F00","#001400","#000A00","#000000"]
									
									
				d3.json("assets/data/ea-admin1.GEOJSON", function (governJSON){
										coping_capacity_chart.width(400).height(330)
											.dimension(country)
											.group(countryCopingCapacity)
											.colors(d3.scale.quantize().range(["#FFFFFF","#E6F0E6","#CCE0CC","#B2D1B2","#99C299","#80B280","#66A366","#4D944D","#338533","#197519","#006600","#005C00","#005200","#004700","#003D00","#003300","#002900","#001F00","#001400","#000A00","#000000"]))
											.colorDomain([0, 15])
											//.colors(d3.scale.quantize().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF","#0061B5"]))
											//.colorAccessor(function(d, i){return i%7;})
											//.colorAccessor(function(d, i){return d.key;})
											.colorCalculator(function (d) { return d ? coping_capacity_chart.colors()(d) : '#4D944D'; })
											.overlayGeoJson(governJSON.features, "Governorates", function (d) {
												return d.properties.ADM1_NAME;
											})
											.projection(d3.geo.mercator().center([60,2]).scale(4500))  /* Center on Eastern Africa */
											.title(function (d) {
												//return "code: " + gcode2[d.key] + gcode2[d.value];
												return "Country: " + d.key + "\nCoping Capacity " + numberFormat(d.value ? d.value : 0)  ;
											});
											//map2_chart.filter('');
											dc.renderAll(); 
									});	
								

				d3.json("assets/data/ea-admin1.GEOJSON", function (governJSON){
										informChoropleth.width(400).height(330)
											.dimension(country)
											.group(countryRisk)
											.colors(d3.scale.quantize().range(["#FFFFFF","#FFE6E6","#FFCCCC","#FFB2B2","#FF9999","#FF8080","#FF6666","#FF4D4D","#FF3333","#FF1919","#FF0000","#E60000","#CC0000","#B20000","#990000","#800000","#660000","#4C0000","#330000","#1A0000","#000000"]))
											.colorDomain([0, 18])
											//.colors(d3.scale.quantize().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF","#0061B5"]))
											//.colorAccessor(function(d, i){return i%7;})
											//.colorAccessor(function(d, i){return d.key;})
											.colorCalculator(function (d) { return d ? informChoropleth.colors()(d) : '#FF8080'; })
											//.colorCalculator(function (d) { return d ? informChoropleth.colors()(d) : '#0061B5'; })
											.overlayGeoJson(governJSON.features, "Governorates", function (d) {
												return d.properties.ADM1_NAME;
											})
											.projection(d3.geo.mercator().center([60,2]).scale(4500))  /* Center on Eastern Africa */
											.title(function (d) {
												//return "code: " + gcode2[d.key] + gcode2[d.value];
												return "Country: " + d.key + "\nRisk " + numberFormat(d.value ? d.value : 0)  ;
											});
											//map2_chart.filter('');
											dc.renderAll(); 
									});											
					

        // rotate the x Axis labels
                d3.selectAll("g.x text")
                    .attr("class", "campusLabel")
                    .style("text-anchor", "end") 
                    .attr("transform", "translate(-10,0)rotate(315)");

                d3.selectAll("g.row").call(tip);
                d3.selectAll("g.row").on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);

                d3.selectAll(".bar").call(barTip);
                d3.selectAll(".bar").on('mouseover', barTip.show)
                    .on('mouseout', barTip.hide);  

					
				dc.renderAll();

        }

);
