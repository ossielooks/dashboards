
var occurenceChart = dc.lineChart("#donor-chart");


var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);


// load data from a csv file
d3.csv("assets/data/acled2.csv", function (data) {
            // format the data a bit
            

            // feed it through crossfilter
            var ndx = crossfilter(data);
			
            var numberFormat = d3.format(",2f");
			
			var parseDate = d3.time.format("%d/%m/%Y").parse;
				data.forEach(function(d) {
					d.date = parseDate(d.date);
					d.month = d3.time.month(d.date);
					
				});


				var dateDim = ndx.dimension(function(d) {return d.month;});
				

				var minDate = dateDim.bottom(1)[0].date;
				var maxDate = dateDim.top(1)[0].date;
				console.log('maxDate');

				
			
			var location = ndx.dimension(function(d) {return d.COUNTRY;});
			
			var fatalitiesGroup = location.group().reduce(
                function (p, v) {
                    p.fatalities += +v["FATALITIES"];
                  
                    return p;
					
                },
                function (p, v) {
                    p.fatalities -= +v["FATALITIES"];
					 return p;
                },
                function () {
                    return {fatalities: 0};
                }				
				
        );
		var testing = fatalitiesGroup.top(5)[2];
		console.log(testing);
		console.log(5);
			
			var fatalitiesByTime = dateDim.group().reduceSum(function(d) { return d.FATALITIES;});
			var occurencesByTime = dateDim.group().reduceCount(function(d) { return d.ADM_LEVEL_2;});

			
			
			
						            
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
			
			
								
			
			
					occurenceChart
						.width(800).height(200)
						.transitionDuration(750)
						.dimension(dateDim)
						.group(occurencesByTime)
						.brushOn(true)
						.x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2015, 4, 31)]))
						.round(d3.time.month.round)
						.xUnits(d3.time.months);
						//.x(d3.time.scale().domain([minDate,maxDate])); 
				
         //dc.renderAll();
					
			 

            
         // var caChart = dc.bubbleOverlay("#ca-chart")
           // .svg(d3.select("#ca-chart svg"));

			dc.bubbleOverlay("#cachart")
				.svg(d3.select("#cachart svg"))
				.transitionDuration(750)
				.width(800)
                .height(800)
                .dimension(location)
                .group(fatalitiesGroup)
                .radiusValueAccessor(function(d) {
                    return d.value.fatalities;
                })
                .r(d3.scale.linear().domain([10, 8000]))
				.colors(["#0089FF"])
                //.colors(["#a60000","#ff7373","#ff4040","#ff0000","#bf3030","#a60000"])
                .colorDomain([0, 1])
                .colorAccessor(function(d) {
                    return d.value.fatalities;
                })
                .title(function(d) {
                    return "County: " + d.key
                             + "\nFatalities: " + numberFormat(d.value.fatalities);
                                            })
                
                .point("Burundi", 210, 700)
                .point("Uganda", 300, 560)
                .point("Sudan", 256, 230)
                .point("Kenya", 425, 568)
                .point("Somalia", 650, 530)
				.point("South Sudan", 200, 400)
				.point("Ethiopia", 460, 380)
				.point("Eritrea", 460, 180)
				.point("Djibouti", 550, 310)
                .debug(false); 
			
		
			  
			
					var projection = d3.geo.mercator()
						.center([40,14.0])
						.scale(9000)
						

					var path = d3.geo.path()
						.projection(projection);
					//.projection(d3.geo.mercator().center([48.5,-2.0]).scale(11800)
					var g = d3.selectAll("#cachart").select("svg").append("g");
					//         
					
					g.selectAll("path")
						.data(eaadmin2.features)
						.enter()
						.append("path")
						.attr("d", path)
						.attr("stroke",'#bebebe')
						.attr("stroke-width",'0.5px')
						.attr("fill",'#fff')
						.attr("class", function(d) { return d.properties.ADM1_NAME;});
						
						
					g.selectAll("path")
						.data(eaoutline.features)
						.enter()
						.append("path")
						.attr("d", path)
						.attr("stroke",'#bebebe')
						.attr("stroke-width",'1px')
						.attr("fill",'none');
						
						
       

					dc.renderAll();
				

        }

);
