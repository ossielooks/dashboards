
var functionPieChart = dc.pieChart("#function-pie-chart");
var functionChart = dc.rowChart("#function-chart");
var expByCampusChart = dc.barChart("#exp-by-campus-chart");
//var expFiveYearBarChart = dc.lineChart("#exp-trend-bar-chart");//, "expenditures"
var map2_chart = dc.geoChoroplethChart("#map2");
var statusByBudgetPieChart = dc.pieChart("#statusByBudgetPieChart");
//var county_fundingchart = dc.rowChart("#function-chart");
var statusByProjectPieChart = dc.pieChart("#statusByProjectPieChart");
var county_projectchart = dc.rowChart("#function-chart");
var donor_fundingchart = dc.rowChart("#donor-chart");
var implementing_projectchart = dc.rowChart("#implementing-chart");
var donor_projectchart = dc.rowChart("#donor-project-chart");
//var regionwest_chart = dc.geoChoroplethChart("#map");
var caChart = dc.bubbleOverlay("#ca-chart")
            .svg(d3.select("#ca-chart svg"));


var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);


// load data from a csv file
d3.csv("assets/data/resilience.csv", function (data) {
            // format the data a bit
            var dateFormat = d3.time.format("%Y");
            var numberFormat = d3.format(",f");

            // feed it through crossfilter
            var ndx = crossfilter(data);
            
			//var amount = ndx.dimension(function (d) {return d.amount});
			
			
		   // dimensions
		    
			
			//peopleinneed.filter("2014");
			
		   
			var status = ndx.dimension(function(d) { return d.STATUS});
		    var county = ndx.dimension(function(d){return d.COUNTY;});		   
		   	var sector = ndx.dimension(function (d) { return d.SECTOR;});
			var budget = ndx.dimension(function(d) {return d.BUDGET;});
			var implementing = ndx.dimension(function(d) {return d.IMPLEMENTING;});
			var donor = ndx.dimension(function(d) {return d.DONOR;});
			var title = ndx.dimension(function(d) {return d.TITLE;});
			
			var donornumber = ndx.groupAll().reduce(
          function (p, v) {
              ++p.n;
              p.donors += v.donor;
              return p;
          },
          function (p, v) {
              --p.n;
              p.donors -= v.donor;
              return p;
          },
          function () { return {n:0,donors:0}; }
      );
			
			//Groups
			//var peopleinneedGroup = peopleinneed.group();
			//var county = county.top(20);
						
			
            var donorByBudgetGroup = donor.group().reduceSum(function (d) { return d.BUDGET; });
			var donorByCountyGroup = donor.group().reduceCount(function (d) { return d.COUNTY; });
			var donorByProjectGroup = donor.group().reduceCount(function (d) { return d.TITLE; });
				
				
			var sectorByCountyGroup = sector.group().reduceCount(function(d) { return d["COUNTY"];});
			var sectorByBudgetGroup = sector.group().reduceSum(function(d) { return d.BUDGET;});
			
			
			var titleByStatusGroup = title.group().reduceCount(function(d) { return d.STATUS;});
			var statusByBudgetGroup = status.group().reduceSum(function(d) { return d.BUDGET;});
			var statusByProjectGroup = status.group().reduceCount(function(d) { return d.TITLE;});
			var implementingByProjectGroup = implementing.group().reduceCount(function(d) { return d.TITLE;});
			
			
			
			var countyByBudgetGroup = county.group().reduceSum(function(d) { return d.BUDGET;});
			var countyByProjectGroup = county.group().reduceCount(function(d) { return d.TITLE;});
			var maxamount = countyByBudgetGroup.top(2)[1].value;
			console.log(maxamount);
		//	maxamount.filterAll();
			
			var fundingall = ndx.groupAll().reduceSum(function(d) {return d.BUDGET;});
			
			var totalProjects = donor.group().reduceCount(function(d) { return +d.value;});
			
			
				
			
			var totalDonors = donor.group();
			var totalImplementing = implementing.group();
			
			
			var countybubbles = county.group().reduce(
                function (p, v) {
                    p.amountinvested += +v.BUDGET;
                    //p.targeted += +v["TAR"];
                    return p;
                },
                function (p, v) {
                    p.amountinvested -= +v.BUDGET;
                   /*  if (p.peopleinneed < 0.001) p.peopleinneed = 0; // do some clean up */
                    //p.targeted -= +v["TAR"];
					 return p;
                },
                function () {
                    return {amountinvested: 0};
                }				
				
        );
						            
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

			var expenseColor = d3.scale.ordinal().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]);
			var expenseColors = d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF","#6BBAFF","#81C5FF","#9ED2FF","#C4E4FF","#E2F2FF"]);
			
			functionChart.width(200)  
                    .height(350)
                    .margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(750)
                    .dimension(donor)
                    .group(donorByBudgetGroup)
                    .colors(expenseColor)
                    .renderLabel(true)
                    .gap(9)
                    .title(function (d) { return  d.value + "$" ; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s")); 
								
			donor_fundingchart.width(200).height(250)
			.margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(2500)
                    .dimension(donor)
                    .group(donorByBudgetGroup)
					.data(function(group) {
								return group.top(5);
								})
                    .colors(d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF"]))
                    .renderLabel(true)
                    .gap(9)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s"));  
					
			donor_projectchart.width(250).height(250)
			.margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(2500)
                    .dimension(donor)
                    .group(donorByProjectGroup)
					.data(function(group) {
								return group.top(5);
								})
                    .colors(expenseColor)
                    .renderLabel(true)
                    .gap(9)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
                    .xAxis().ticks(5).tickFormat(d3.format("s")); 
					
			implementing_projectchart.width(200).height(250)
			.margins({top: 10, left: 10, right: 10, bottom: 20})
                    .transitionDuration(2500)
                    .dimension(implementing)
                    .group(implementingByProjectGroup)
					.data(function(group) {
								return group.top(5);
								})
                    .colors(d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF"]))
                    .renderLabel(true)
                    .gap(9)
                    .title(function (d) { return d.value; })
                    .elasticX(true)
					/* .title(function(d){
            return formatTitle(d.key,d.value);
            }) */
                   
					
                    .xAxis().ticks(5).tickFormat(d3.format("s")); 
					
			
			county_projectchart.width(250).height(350)
			.margins({top: 20, right: 10, bottom: 30, left: 10})
                .dimension(county)
                .group(countyByProjectGroup)
				 .data(function(group) {
								return group.top(15);
								}) 
				.colors(expenseColor)
                .elasticX(true)
                .xAxis().ticks(4).tickFormat(d3.format("s")); 
				//country_fundingchart.filter("funded");
				

            functionPieChart.width(200) 
                    .height(250)
					
                    .transitionDuration(2500)
                    .radius(80)
                    .innerRadius(30)
                    .dimension(sector)
                    .title(function (d) { return "$" + d.value; })
                    .group(sectorByBudgetGroup)
                    .colors(d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF"]))
					.title(function(d){
            return formatTitle(d.key,d.value);
            })
                    .renderLabel(true);
                    //functionPieChart.filter("funded");
					
			statusByBudgetPieChart.width(180) 
                    .height(250)    
                    .transitionDuration(2500)
                    .radius(90)
                    .innerRadius(30)
                    .dimension(status)
                    .title(function (d) { return ""; })
                    .group(statusByBudgetGroup)
                    .colors(d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF"]))
					.title(function(d){
            return formatTitle(d.key,d.value);
            })
                    .renderLabel(true); 
					
			statusByProjectPieChart.width(180) 
                    .height(300)    
                    .transitionDuration(2500)
                    .radius(90)
                    .innerRadius(30)
                    .dimension(status)
                    .title(function (d) { return ""; })
                    .group(statusByProjectGroup)
                    .colors(d3.scale.ordinal().range(["#0061B5","#0089FF","#1E96FF","#36A2FF","#51AEFF"]))
					.title(function(d){
            return formatTitle(d.key,d.value);
            })
                   .renderLabel(true);
				   
			function formatTitle(key, value){
						var v;
						if(value>1000000){
							value=value/1000000;
							v=value.toFixed(2)+" million";
						} else {
							v=value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						}
						return key+": "+v;
					}
					
             expByCampusChart.width(300)
                    .height(300)
                    .transitionDuration(2500)
                    .margins({top: 20, right: 10, bottom: 40, left: 40})
                    .dimension(sector)
                    .group(sectorByBudgetGroup)
                    .centerBar(true)
                    .brushOn(false)
                    .title(function (d) { return ""; })
                    .gap(1)
                    .elasticY(true)
                    //.colors(['steelblue'])
					.colors(expenseColor) // .colors(['#737373']) ALSO AN OPTION
                    .xUnits(dc.units.ordinal)
					//.xUnits(function(){return 7;})
					//.stack(expensesByCampusGroup, "Stack Value", function(d){return d.value;})
                    .x(d3.scale.ordinal().domain(["", "DRM","Health and Nutrition","Institutional Dev","Sustainable Livelihoods","Climate proofed infrastructure","Education","Peace and Human Security"])) // removed ,  "Systemwide",  "DOE Labs"
                    .y(d3.scale.linear().domain([0, 5500000])) 
                    .renderHorizontalGridLines(true)
                    .yAxis().tickFormat(d3.format("s"));
                    
 
					
					
				
            dc.dataCount(".dc-data-count") 
                    .dimension(ndx)
                    .group(all);
					
			
					
			 

            dc.dataTable("#dc-data-table") 
                    .dimension(title)
                    .group(function (d) {
                        return d.TITLE;
                    })
                    .size(170)
                    .columns([
                            function (d) {
                            return d.SECTOR
                            ;
                        },
						 function (d) {
                            return d.DONOR;
                        },
                        function (d) {
                            return numberFormat(d.BUDGET);
                        },
						function (d) {
                            return d.IMPLEMENTING;
                        },
						function (d) {
                            return d.STATUS;
                        },
						function (d) {
                            return d.COUNTY;
                        }
                       
                    ])
                   /*  .sortBy(function (d) {
                        return d.DONOR;
                    }) */
                    .order(d3.ascending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

          
			
			d3.json("assets/data/kenyacounties.GEOJSON", function (governJSON){
                        map2_chart.width(330).height(350)
							.dimension(county)
                            .group(countyByBudgetGroup)
					.colors(d3.scale.quantize().range(["#E2F2FF","#C4E4FF","#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF","#0061B5"]))
                    .colorDomain([0, maxamount])
					
                    .colorCalculator(function (d) { return d ? map2_chart.colors()(d) : '#ccc'; })
                    							.data(function(group) {
								return group.top(Infinity);
								}) 
												
                           	.overlayGeoJson(governJSON.features, "Features", function (d) {
                                return  d.properties.name;
                            })
                            .projection(d3.geo.mercator().center([48.5,-2.0]).scale(11800)) /* Center on Eastern Africa */
                            .title(function (d) {
                                //return "code: " + gcode2[d.key] + gcode2[d.value];
								return "Country: " + d.key + "\nAmount Invested: " + numberFormat(d.value ? d.value : 0) + "USD";
                            });
							//map2_chart.filter('SUD');
							dc.renderAll(); 
					});
          
			
			 caChart.width(500)
                .height(500)
                .dimension(county)
                .group(countybubbles)
                .radiusValueAccessor(function(p) {
                    return p.value.amountinvested;
                })
                .r(d3.scale.linear().domain([0, 500000000]))
				.colors(["#0089FF"])
                //.colors(["#a60000","#ff7373","#ff4040","#ff0000","#bf3030","#a60000"])
                .colorDomain([0, 30])
                .colorAccessor(function(p) {
                    return p.value.amountinvested;
                })
                .title(function(d) {
                    return "County: " + d.key
                             + "\nTotal amount Invested for Resilience: " + numberFormat(d.value.amountinvested)
                            /*+ "\nViolent crime per 100k population: " + numberFormat(d.value.avgViolentCrimeRate)
                            + "\nViolent/Total crime ratio: " + numberFormat(d.value.violentCrimeRatio) + "%"; */
                })
                .point("Turkana", 104, 96)
                .point("Baringo", 115, 243)
                .point("Wajir", 380, 200)
                .point("Mandera", 410, 120)
                .point("Marsabit", 250, 130)
                .point("Tana River", 333, 384)
                .point("Isiolo", 294, 240)
                .point("Samburu", 208, 236) 
                .point("Laikipia", 183, 285)
				.point("West Pokot", 91, 217)
				.point("Kitui", 267, 373)
				.point("Lamu", 410, 421)
				.point("Taita Taveta", 274, 489)
				.point("Kwale", 320, 533)
				.point("Kilifi", 345, 484)
				.point("Machakos", 217, 375)
				.point("Makueni", 236, 408)
				.point("Narok", 109, 382)
				.point("Kajiado", 186, 422)
				.point("Tharaka", 246, 320)
				.point("Embu", 233, 344)
				.point("Meru", 242, 290)
				.point("Nyeri", 196, 323)
				.point("Garissa", 390,340)
                .debug(false);
			
			/* regionwest_chart.width(900).height(950)
					.dimension(county)
					.group(countyByBudgetGroup)
					.colors(['#DDDDDD', '#ff5722'])
					.colorDomain([0, 1])
					.colorAccessor(function (d) {
						if(d>0){
							return 1;
						} else {
							return 0;
						}
					})
					.overlayGeoJson(westafrica.features, "Regions", function (d) {
						return d.properties.NAME;
					})
					.projection(d3.geo.mercator().center([-4,6.5]).scale(2200))
					.title(function(d){
						return d.key;
						//return formatTitle(d.key,d.value);
					}); */
		
			  
			
						 var projection = d3.geo.mercator()
						.center([42,1])
						.scale(20000)
						/* .width(900)
                .height(950) */;

					var path = d3.geo.path()
						.projection(projection);
					//.projection(d3.geo.mercator().center([48.5,-2.0]).scale(11800)
					var g = d3.selectAll("#ca-chart").select("svg").append("g");
					//         
					g.selectAll("path")
						.data(ke.features)
						.enter()
						.append("path")
						.attr("d", path)
						.attr("stroke",'white')
						.attr("stroke-width",'0.5px')
						.attr("fill",'#BEBEBE');
						//.attr("class","county");
						//dc.renderAll();
					 //   
					 /* var mapLabels = d3.selectAll("#ca-chart").select("svg").append("g");
					mapLabels.selectAll('text')
						.data(ke.features)
						.enter()
						.append("text")
						.attr("x", function(d,i){
									return path.centroid(d)[0]-20;})
						.attr("y", function(d,i){
									return path.centroid(d)[1];})
						.attr("dy", ".55em")
						.attr("class","maplabel")
						.style("font-size","8px")
						.attr("opacity",0.4)
						.text(function(d,i){
							return d.properties.name;
						});   */

 
 
 
 
 
        // rotate the x Axis labels
                /* d3.selectAll("g.x text")
                    .attr("class", "dc-chart")
                    .style("text-anchor", "end") 
                    .attr("transform", "translate(-10,0)rotate(315)"); */

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
