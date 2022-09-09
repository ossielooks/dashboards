
var functionPieChart = dc.pieChart("#function-pie-chart");
var functionChart = dc.rowChart("#function-chart");
//var expByCampusChart = dc.barChart("#exp-by-campus-chart");
var expFiveYearBarChart = dc.lineChart("#exp-trend-bar-chart");//, "expenditures"
var map2_chart = dc.geoChoroplethChart("#map2");
////var country_fundingchart = dc.rowChart("#function-chart");

var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);


// load data from a csv file
d3.csv("assets/data/sectors.csv", function (data) {
            // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            
			//var amount = ndx.dimension(function (d) {return d.amount});
			
			
		   // dimensions
		    var peopleinneed = ndx.dimension(function(d) {return d.PIN;});
			var peopletargeted = ndx.dimension(function(d) {return d.TAR;});
			//peopleinneed.filter("2014");
			//var max_amount = peopleinneed.top(1)[0].value;
		   
			var yearFunction = ndx.dimension(function(d) { return d.YEAR});
		    var countryFunction = ndx.dimension(function(d){return d.COUNTRY;});		   
		   	var sectorFunction = ndx.dimension(function (d) { return d.SECTOR;});
			
			//Groups
			var peopleinneedGroup = peopleinneed.group();
			
            var sectortarFunctionGroup = sectorFunction.group().reduceSum(function (d) { return d.TAR; });
			var sectorneedFunctionGroup = sectorFunction.group().reduceSum(function (d) { return d.PIN; });
				
			var countryneedFunctiongroup = countryFunction.group().reduceSum(function(d) { return d["PIN"];});
			var countrytarFunctiongroup = countryFunction.group().reduceSum(function(d) { return d.TAR});
			
			var yeartarFunctiongroup = yearFunction.group().reduceSum(function(d) { return d.TAR});
			var yearneedFunctiongroup = yearFunction.group().reduceSum(function(d) { return d.PIN});
						            
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

            // set colors to red <--> purple
           // var expenseColors = ["#fde0dd","#fa9fb5","#e7e1ef","#d4b9da","#c994c7","#fcc5c0","#df65b0","#e7298a","#ce1256", "#f768a1","#dd3497","#e78ac3","#f1b6da","#c51b7d"];
			//var expenseColors = ["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"];
				//var expenseColors = ["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"];
				var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
            functionChart.width(300)  
                    .height(330)
                    .margins({top: 10, left: 30, right: 10, bottom: 20})
                    .transitionDuration(750)
                    .dimension(sectorFunction)
                    .group(sectorneedFunctionGroup)
                    .colors(expenseColors)
                    .renderLabel(true)
                    .gap(9)
                    .title(function (d) { return ""; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s")); 
					
					
			/* country_fundingchart.width(320).height(300) THIS STREAM IS TO BE UNCOMMENTED
			.margins({top: 20, right: 20, bottom: 30, left: 100})
                .dimension(expensesByCampus)
                .group(expensesByCampusGroup)
				.colors(expenseColors)
                .elasticX(true)
                .xAxis().ticks(4).tickFormat(d3.format("s"));
				//country_fundingchart.filter("funded");
				 */

            functionPieChart.width(180) 
                    .height(300)    
                    .transitionDuration(750)
                    .radius(90)
                    .innerRadius(30)
                    .dimension(sectorFunction)
                    .title(function (d) { return ""; })
                    .group(sectortarFunctionGroup)
                    .colors(expenseColors)
                    .renderLabel(false);
                    //functionPieChart.filter("funded");

            /* expByCampusChart.width(500)
                    .height(400)
                    .transitionDuration(750)
                    .margins({top: 20, right: 10, bottom: 80, left: 80})
                    .dimension(expensesByCampus)
                    .group(expensesByCampusGroup)
                    .centerBar(true)
                    .brushOn(false)
                    .title(function (d) { return ""; })
                    .gap(1)
                    .elasticY(true)
                    //.colors(['steelblue'])
					.colors(expenseColors) // .colors(['#737373']) ALSO AN OPTION
                    .xUnits(dc.units.ordinal)
					//.xUnits(function(){return 7;})
					.stack(expensesByCampusGroup, "Stack Value", function(d){return d.value;})
                    .x(d3.scale.ordinal().domain(["", "UGA","SOM","SUD","SSD","DJI","ETH","KEN"])) // removed ,  "Systemwide",  "DOE Labs"
                    .y(d3.scale.linear().domain([0, 5500000])) 
                    .renderHorizontalGridLines(true)
                    .yAxis().tickFormat(d3.format("s"));
                    
 */
					
					/* map with ID adm1_code */
                    
					
					
					
           //expByCampusChart.yAxis().filter("RECEIVED");
		 // expByCampusChart.filter("funded");


             /* expFiveYearBarChart.width(600)
                    .height(100)
                    .transitionDuration(750)
                    .margins({top: 20, right: 200, bottom: 30, left: 180})
                    .dimension(yearFunction)
                    .group(yearneedFunctiongroup)
                    .elasticY(true)
                    .centerBar(true)
                    .brushOn(true)
                    .title(function (d) { return ""; })
                    .gap(6)
                    .colors(['#737373'])
                    .xUnits(function(){return 6;})
                    .elasticX(false)
                    .x(d3.scale.linear().domain([2010, 2016]))
                    .renderHorizontalGridLines(true)
                    .xAxis().ticks(5).tickFormat(d3.format("d"));
                    

            expFiveYearBarChart.yAxis().ticks(3).tickFormat(d3.format("s"));  */
                                            
			expFiveYearBarChart 
               .width(900)
                .height(200)
                .margins({top: 20, right: 20, bottom: 30, left: 100})
				.renderArea(true)
                .dimension(yearFunction)
                //.group(yearneedFunctiongroup)
				.group(yearneedFunctiongroup, 'People in need')
                .valueAccessor(function(d) {
						return d.value;
					})
				.stack(yeartarFunctiongroup, 'People Targeted for Assistance', function (d) {
						return d.value;
					})
                .x(d3.scale.linear().domain([2011, 2015]))
                .renderHorizontalGridLines(true)
                .elasticY(true)
				.legend(dc.legend().x(700).y(10).itemHeight(13).gap(5))
                .brushOn(true)
               /*  .title(function(d){
                    return d.key
                            + "\nHomicide incidents: " + Math.round(d.value.funded);
                }) */
				/* .title(function (d) {
						var value = d.value.avg ? d.value.avg : d.value;
						if (isNaN(value)) {
							value = 0;
						}
						return dateFormat(d.key) + '\n' + numberFormat(value);
					}); */
                .xAxis().ticks(5).tickFormat(d3.format("d"))
				//.y(d3.scale.linear().domain([0, 8000000000]));
				expFiveYearBarChart.yAxis().ticks(6).tickFormat(d3.format("s"));
				 expFiveYearBarChart.filter(2014);
				
            dc.dataCount(".dc-data-count") //, "expenditures"
                    .dimension(ndx)
                    .group(all);

            dc.dataTable("#dc-data-table")//, "expenditures"  
                    .dimension(sectorFunction)
                    .group(function (d) {
                        return d.COUNTRY;
                    })
                    .size(170)
                    .columns([
                            function (d) {
                            return d.SECTOR
                            ;
                        },
						 function (d) {
                            return d.YEAR;
                        },
                        function (d) {
                            return numberFormat(d.PIN);
                        },
						function (d) {
                            return numberFormat(d.TAR);
                        }
                       
                    ])
                    .sortBy(function (d) {
                        return d.YEAR;
                    })
                    .order(d3.ascending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

          
			
			d3.json("assets/data/ea-region.geojson", function (governJSON){
                        map2_chart.width(330).height(350)
							.dimension(countryFunction)
                            .group(countryneedFunctiongroup)
							//.colors(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"])
							//.colors(d3.scale.quantile().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]))			
							.colors(d3.scale.quantize().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]))
							//.colorAccessor(function(d, i){return i%7;})
							.colorDomain([0, 6])
							.colorCalculator(function (d) { return d ? map2_chart.colors()(d) : "#0089FF"; })
                           	.overlayGeoJson(governJSON.features, "Governorates", function (d) {
                                return d.properties.id;
                            })
                            .projection(d3.geo.mercator().center([66,0.9]).scale(3800)) /* Center on Eastern Africa */
                            .title(function (d) {
                                //return "code: " + gcode2[d.key] + gcode2[d.value];
								return "Country: " + d.key + "\nPeople in Need: " + numberFormat(d.value ? d.value : 0) + "M";
                            });
							//map2_chart.filter('SUD');
							dc.renderAll(); 
					});
           // dc.renderAll();
			
			  
			
						/* var projection = d3.geo.mercator()
						.center([-4,6.5])
						.scale(2200);

					var path = d3.geo.path()
						.projection(projection);

					var g = d3.selectAll("#map").select("svg").append("g");
					//         
					g.selectAll("path")
						.data(westafrica.features)
						.enter()
						.append("path")
						.attr("d", path)
						.attr("stroke",'#999999')
						.attr("stroke-width",'2px')
						.attr("fill",'none')
						.attr("class","country");
					 //   
					var mapLabels = d3.selectAll("#map").select("svg").append("g");
					mapLabels.selectAll('text')
						.data(westafrica.features)
						.enter()
						.append("text")
						.attr("x", function(d,i){
									return path.centroid(d)[0]-20;})
						.attr("y", function(d,i){
									return path.centroid(d)[1];})
						.attr("dy", ".55em")
						.attr("class","maplabel")
						.style("font-size","12px")
						.attr("opacity",0.4)
						.text(function(d,i){
							return d.properties.NAME;
						});

 */
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
