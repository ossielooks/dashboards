
/* function regionsMapShow(){
            $('#map2').hide();
            $('#map').show();
            map2_chart.filterAll();
            dc.redrawAll();
        }

        function governoratesMapShow(){
            $('#map').hide();
            $('#map2').show();
        }
 */

//var functionPieChart = dc.pieChart("#function-pie-chart");
//var functionChart = dc.rowChart("#function-chart");
var expByCampusChart = dc.barChart("#exp-by-campus-chart");
var expFiveYearBarChart = dc.lineChart("#exp-trend-bar-chart");//, "expenditures"
var map2_chart = dc.geoChoroplethChart("#map2");
var volumeChart = dc.barChart("#timefilter")
//var country_fundingchart = dc.rowChart("#function-chart");
var roundChart = dc.bubbleChart("#round-chart");
var refugeeIdpChart = dc.barChart("#refugeeIdp");

//var regionwest_chart = dc.geoChoroplethChart("#map");


var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);


// load data from a csv file
d3.csv("assets/data/funding.csv", function (data) {
            // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",3f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            

			
          
			//dimensions
			/* var committed = ndx.dimension(function (d) {return d.COMMITTED;});
			var funded = ndx.dimension(function (d) {return d.FUNDED;});
			var refugees = ndx.dimension(function (d) {return d.REFUGEES;}); */
			/* var idps = ndx.dimension(function (d) {return d.IDPS;}); */
			var year = ndx.dimension(function (d) {return d.YEAR;});
			/* var pin = ndx.dimension(function (d) {return d.PIN;});
			var tar = ndx.dimension(function (d) {return d.TAR;}); */
			var country = ndx.dimension(function (d) {return d.NAME;});
			
			//groups
            var yearByPin = year.group().reduceSum(function (d) { return d.PIN; });
			var yearByTar = year.group().reduceSum(function (d) { return d.TAR; });
			var yearByCommitted = year.group().reduceSum(function (d) { return d.COMMITTED; });
			var yearByFunded = year.group().reduceSum(function (d) { return d.FUNDED; });
			
			var countryByFunded = country.group().reduceSum(function (d) { return d.FUNDED; });
			var countryByCommitted = country.group().reduceSum(function (d) { return d.COMMITTED; });
			var countryByRefugees = country.group().reduceSum(function (d) { return d.REFUGEES; });
			var countryByIdps = country.group().reduceSum(function (d) { return d.IDPS; });
			var countryByPin = country.group().reduceSum(function (d) { return d.PIN; });
            var countryByTar = country.group().reduceSum(function (d) { return d.TAR; });
			
			var countrybubbles = country.group().reduce(
                function (p, v) {
                    p.peopleinneed += +v["PIN"];
                    p.targeted += +v["TAR"];
                    return p;
                },
                function (p, v) {
                    p.peopleinneed -= +v["PIN"];
                   /*  if (p.peopleinneed < 0.001) p.peopleinneed = 0; // do some clean up */
                    p.targeted -= +v["TAR"];
					 return p;
                },
                function () {
                    return {peopleinneed: 0, targeted: 0};
                }				
				
        );
		
			
			var fundingBubbles = country.group().reduce(
                function (p, v) {
                    p.amountCommitted += +v["COMMITTED"];
                    p.amountFunded += +v["FUNDED"];
					p.percentageFunding = (p.amountFunded/p.amountCommitted)*100;
                    return p;
                },
                function (p, v) {
                    p.amountCommitted -= +v["COMMITTED"];
                    p.amountFunded -= +v["FUNDED"];
					p.percentageFunding = (p.amountFunded/p.amountCommitted)*100;
					 return p;
                },
                function () {
                    return {amountCommitted: 0 , amountFunded: 0, percentageFunding: 0 };
                }				
				
        );
			
			var maxamount = fundingBubbles.top(10)[3].value;
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

            // set colors to red <--> purple
           // var expenseColors = ["#fde0dd","#fa9fb5","#e7e1ef","#d4b9da","#c994c7","#fcc5c0","#df65b0","#e7298a","#ce1256", "#f768a1","#dd3497","#e78ac3","#f1b6da","#c51b7d"];
			//var expenseColors = ["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"];
				var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
				//var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
           

            expByCampusChart.width(250)
                    .height(150)
                    .transitionDuration(750)
                    .margins({top: 20, right: 0, bottom: 20, left: 40})
                    .dimension(country)
                    .group(countryByCommitted, "Committed Amount")
					.colors(expenseColors)
                    .centerBar(true)
                    .brushOn(false)
                   // .title(function (d) { return ""; })
                    .gap(1)
                    .elasticY(true)
                    //.colors(['steelblue'])
					//.colors(expenseColors) // .colors(['#737373']) ALSO AN OPTION
                    .xUnits(dc.units.ordinal)
					//.xUnits(function(){return 7;})
					.stack(countryByFunded, "Funded Amount")
					//.alwaysUseRounding(true)
					//.round(dc.round.floor)
					//.alwaysUseRounding(true)
					.legend(dc.legend().x(250).y(10).itemHeight(13).gap(5))
                    .x(d3.scale.ordinal().domain(["","SOM","SUD","SSD","DJI","ETH","KEN","UGA"])) // removed ,  "Systemwide",  "DOE Labs" ,"RWA","BUR"
                    //.y(d3.scale.linear().domain([1000000, 10000000000])) 
                    .renderHorizontalGridLines(true)
                    //.yAxis().tickFormat(d3.format("d"));
					expByCampusChart.yAxis().ticks(5).tickFormat(d3.format("s"));
                    
								
					/* map with ID adm1_code */
               refugeeIdpChart.width(250)
                    .height(150)
                    .transitionDuration(750)
                    .margins({top: 20, right: 0, bottom: 40, left: 40})
                    .dimension(country)
                    .group(countryByRefugees, "Refugees")
					.colors(expenseColors)
                    .centerBar(true)
                    .brushOn(false)
                   // .title(function (d) { return ""; })
                    .gap(1)
                    .elasticY(true)
                    //.colors(['steelblue'])
					//.colors(expenseColors) // .colors(['#737373']) ALSO AN OPTION
                    .xUnits(dc.units.ordinal)
					//.xUnits(function(){return 7;})
					.stack(countryByIdps, "IDPs")
					//.alwaysUseRounding(true)
					//.round(dc.round.floor)
					//.alwaysUseRounding(true)
					.legend(dc.legend().x(250).y(10).itemHeight(13).gap(5))
                    .x(d3.scale.ordinal().domain(["","SOM","SUD","SSD","DJI","ETH","KEN","UGA"])) // removed ,  "Systemwide",  "DOE Labs" ,"RWA","BUR"
                    //.y(d3.scale.linear().domain([1000000, 10000000000])) 
                    .renderHorizontalGridLines(true)
					refugeeIdpChart.yAxis().ticks(5).tickFormat(d3.format("s")); 
					
                                            
			expFiveYearBarChart
               .width(400)
                .height(150)
                .margins({top: 40, right: 20, bottom: 30, left: 30})
				.renderArea(false)
                .dimension(year)
                .group(yearByCommitted,"Amount Committed")
                .valueAccessor(function(d) {
                    return d.value;
                })
				.stack(yearByFunded, 'Amount Funded', function (d) {
						return d.value;
					})
				//.colors(expenseColors)
				.legend(dc.legend().x(250).y(5).itemHeight(13).gap(5))
                .x(d3.scale.linear().domain([2011, 2015]))
                .renderHorizontalGridLines(true)
                .elasticY(true)
                //.brushOn(false)
                .title(function(d){
                    return d.key
                            + "\nAmount: " + Math.round(d.value.funded);
                })
                .xAxis().ticks(5).tickFormat(d3.format("d"))
				//.y(d3.scale.linear().domain([0, 8000000000]));
				expFiveYearBarChart.yAxis().ticks(4).tickFormat(d3.format("s"));
				
				
				volumeChart.width(400)
				.height(40)
				.margins({top: 0, right: 20, bottom: 30, left: 30})
				.dimension(year)
				.group(yearByFunded)
				.stack(yearByFunded, 'Amount Funded', function (d) {
						return d.value;
					})
				//.centerBar(true)
				//.gap(1)
				.brushOn(true)
				.x(d3.scale.linear().domain([2011, 2015]))
				.xAxis().ticks(5).tickFormat(d3.format("d"))
				volumeChart.yAxis().ticks(0).tickFormat(d3.format("s"));
				volumeChart.filter("2014")
				
				
				roundChart.width(400)
                    .height(265)
                    .margins({top: 10, right: 0, bottom: 30, left: 40})
                    //.dimension(cf.organisation)
					.dimension(country)
                   // .group(yearByTotal)
					.group(countrybubbles)
					//.data(function(group) {
                 //   return group.top(8);
					
            //    })
					.colors(expenseColors)
                    //.colors(d3.scale.category10())
                     .keyAccessor(function (p,v) {
                        v = p.value.peopleinneed;
						return v;
					})
                    .valueAccessor(function (p) {
                        return p.value.targeted;
                    })
                    .radiusValueAccessor(function (p) {
                        return p.value.peopleinneed;
						
                    })
                    .x(d3.scale.linear().domain([100000, 25000000]))
					.y(d3.scale.linear().domain([100000, 25000000]))
                    .r(d3.scale.linear().domain([1000, 15000000]))
                    .minRadiusWithLabel(7)
					.elasticY(true)
                    .yAxisPadding(2000000)
                    .elasticX(true)
					//.on("filtered", getFiltersValues)
                    .xAxisPadding(2000000)
                    .maxBubbleRelativeSize(0.05)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .renderLabel(true)
                    .renderTitle(true)
					.title(function (p) {
                        return p.key
                                + "\n"
                                + "people in need: " + numberFormat(p.value.peopleinneed) + "M\n" // M in millions
                                + "people targeted for Assistance: " + numberFormat(p.value.targeted) 
                    }); 
					roundChart.xAxis().ticks(9).tickFormat(d3.format("s"));
                   roundChart.yAxis().ticks(4).tickFormat(d3.format("s")); 
				  // .renderTitle(true)
                    
          /*  roundChart.yAxis().tickFormat(function (s) {
                return s.value + " peoplein need";
            });
            roundChart.xAxis().tickFormat(function (s) {
                return s.value + "people targeted";
            }); */
		
				
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
                            function (d) {
                            return d.YEAR;
                        },
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
                    .sortBy(function (d) {
                        return d.YEAR;
                    })
                    .order(d3.ascending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

           // expFiveYearBarChart.filter(2014);
			
			d3.json("assets/data/ea-region.geojson", function (governJSON){
                        map2_chart.width(300).height(250)
							.dimension(country)
                            .group(countryByFunded)
							//.colors(["#E2F2FF","#C4E4FF", "#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF","#0061B5"])
							//.colors(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"])
							//.colors(d3.scale.quantile().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]))			
							
							.colorDomain([0, 2000000000])
							.colors(d3.scale.quantize().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF","#0061B5"]))
							//.colorAccessor(function(d, i){return i%7;})
							//.colorAccessor(function(d, i){return d.key;})
							.colorCalculator(function (d) { return d ? map2_chart.colors()(d) : '#0061B5'; })
                           	.overlayGeoJson(governJSON.features, "Governorates", function (d) {
                                return d.properties.id;
                            })
                            .projection(d3.geo.mercator().center([80,-5.0]).scale(3000)) /* Center on Eastern Africa */
                            .title(function (d) {
                                //return "code: " + gcode2[d.key] + gcode2[d.value];
								return "Country: " + d.key + "\nTotal Amount Raised: " + numberFormat(d.value ? d.value : 0) + "M";
                            });
							//map2_chart.filter('');
							dc.renderAll(); 
					});
					
					
										
			
						dc.bubbleOverlay("#bubblemap")
						.svg(d3.select("#bubblemap svg"))
						.transitionDuration(750)
								.width(500)
								.height(500)
								.dimension(country)
								.group(fundingBubbles)
								.radiusValueAccessor(function(p) {
									return p.value.amountCommitted;
								})
								.r(d3.scale.linear().domain([0, 15000000000]))
								//.colors(["#0089FF"])
								//.colors(["#E2F2FF","#C4E4FF", "#9ED2FF","#81C5FF","#6BBAFF","#51AEFF"])
								//.colors(d3.scale.quantize().range(["red","blue", "green","orange","purple","pink"]))
								.colors(d3.scale.quantize().range(['#E6F0FF',/* '#CCE0FF','#B2D1FF', */'#99C2FF',/* '#80B2FF','#66A3FF', */'#4D94FF',/* '#3385FF','#1975FF', */'#0066FF',/* '#005CE6','#0052CC' ,*/'#0047B2',/* '#003D99','#003380', */'#002966'/* '#001F4C','#001433', '#000A1A','#000000'*/]))
								.colorDomain([0, 100])
								.colorAccessor(function(d) {
									return d.value.percentageFunding;
								})
								.renderLabel(true)
								// (optional) closure to generate label per bubble, :default = group.key
								.label(function(d) {return "USD " + numberFormat((d.value.amountFunded/1000000).toFixed(2)) + " Million" ;})
								.title(function(d) {
									return "Country: " + d.key
											 + "\nTotal amount Committed: " + numberFormat((d.value.amountCommitted/1000000).toFixed(2))+ "M"
											+ "\nAmount Funded USD: " + numberFormat((d.value.amountFunded/1000000).toFixed(2)) + "M"
											+ "\nPercentage Funding: " + numberFormat(d.value.percentageFunding.toFixed(2)) + "%"; 
								})
								
									.point("KEN", 274, 362)
									.point("SSD", 140, 245)
									.point("SOM", 180, 344)
									.point("ETH", 297, 222)
									.point("SUD", 137, 115)
									.point("BUR", 141, 428)
									.point("RWA", 133, 395)
									.point("ERI", 218, 94)
									.point("DJI", 355, 166)
									.point("UGA", 300, 120)
									.debug(false);
			
			
			
						var projection = d3.geo.mercator()
							.center([50,7])
							.scale(6200);

						var path = d3.geo.path()
							.projection(projection);

						var g = d3.selectAll("#bubblemap").select("svg").append("g");
								 
						/*  g.selectAll("path")
							.data(earegionsvg.features)
							.enter()
							.append("path")
							.attr("stroke",'#999999')
							.attr("stroke-width",'0.5px')
							.attr("fill",'none')
							.attr("d", path); 
						 */
						
						g.selectAll("path")
							.data(fs201501.features)
							.enter()
							.append("path")
							.attr("d", path)
							.attr("stroke",'none')
							//.attr("stroke",'#999999')
							//.attr("stroke-width",'0.5px')
							//.attr("fill",'none')
							.attr("class", function(d) { return d.id;})
							
							
							
							
							/* .country.KEN { fill: #ddc; }
						 .country.UGA { fill: #cdd; }
						.country.SOM { fill: #cdc; }
						.country.ETH { fill: #dcd; }
						.country.SSD { display: none; } */
							 
						 
					/* 	var mapLabels = d3.selectAll("#bubble-overlay").select("svg").append("p");
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
