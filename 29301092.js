//set up margins
var margin = {top: 10, right: 100, bottom: 30, left: 70},
            width = 460 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
        var svgChart = d3.select("#linegraph")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
//loading the data here
d3.csv("YT_solution.csv", function(data) {
    var allGroup = d3.map(data, function(d){return(d.country)}).keys()
            d3.select("#selectButton")
              .selectAll('myOptions')
                .data(allGroup)
              .enter()
                .append('option')
              .text(function (d) { return d; }) // text showed in the menu
              .attr("value", function (d) { return d; }) // corresponding value returned by the button
    
    //----------------------------------Draw bubbles-------------------------------
    var margin = {top: 10, right: 100, bottom: 30, left: 70},
            width = 460 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    function dataset_country(country){
    data_country = []
    for (var i = 0; i < data.length; i++) {
        if(data[i].country == country){
            data_country.push(data[i])
            }
        }
    entertainment = 0
    music = 0
    people_blogs = 0
    sports = 0
    comedy = 0
    film =0
    news = 0
    science = 0
    for (var i = 0; i < data_country.length; i++){
        if(data_country[i].category_title == "Entertainment"){
                entertainment += 1
            }
        if(data_country[i].category_title == "Music"){
                music += 1
            }
        if(data_country[i].category_title == "People & Blogs"){
                people_blogs += 1
            }
        if(data_country[i].category_title == "Sports"){
                sports += 1
            }
        if(data_country[i].category_title == "Comedy"){
                comedy += 1
            }
        if(data_country[i].category_title == "Film & Animation"){
                film += 1
            }
        if(data_country[i].category_title == "News & Politics"){
                news += 1
            }
        if(data_country[i].category_title == "Science & Technology"){
                science += 1
            }
    
    }
    //available categories and finding their counts
    dataset = {
            "children": [{"Name":"Entertainment","Count":entertainment},
                        {"Name":"Music","Count":music},
                        {"Name":"People & Blogs","Count":people_blogs},
                        {"Name":"Sports","Count":sports},
                        {"Name":"Comedy","Count":comedy},
                        {"Name":"Film & Animation","Count":film},
                        {"Name":"News & Politics","Count":news},
                        {"Name":"Science & Technology","Count":science},
                        ]};
        return dataset
        }
    //default country is "US" here
    var us_dataset = dataset_country("US")
    var diameter = 345;
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    //setting up tooltip
    var div_bubble = d3.select("body").append("div_bubble")	
            .attr("class", "tooltip")	
            .style("opacity", 0);

    var bubble = d3.pack()
        .size([diameter, diameter])
        .padding(1.5);

    var svgBubble = d3.select("#bubblechart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");
   
    //draw bubble chart here
    //referred from https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168
    function drawNodes(dataset, selectedOption){  
        var country_name = selectedOption
        var nodes = d3.hierarchy(dataset)
        .sum(function(d) { return d.Count; });
        //removing the node here to append for the next dataset
        svgBubble.selectAll(".node").remove();
        var node = svgBubble.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });  
        var circle = node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .attr("fill", function (d) { return color(d.data.Name); })
            
        circle
            .on("click", function(d) {
                var category_name = d.data.Name
                var data = country_dataset_category(country_name, category_name)
                //calling the bar graph and streaming function
                update(data, country_name, category_name)
                top_20(country_name, category_name);
                
            })
                

            .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer");
                div_bubble.transition()	
                    .duration(200)	
                    .style("opacity", .9);	
                div_bubble.html(d.data.Name + "<br/>" +"Total videos: " + d.data.Count)	
                    .style("left", (d3.event.pageX) + "px")	
                    .style("top", (d3.event.pageY - 28) + "px");	
                d3.select(this).attr("opacity", 4); 
        })
            .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default"); 
                div_bubble.transition()	
                    .duration(500)	
                    .style("opacity", 0);
                d3.selectAll("circle").attr("opacity", 4);
        })
            

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Name.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");
        d3.select(self.frameElement)
            .style("height", diameter + "px");
    }
    drawNodes(us_dataset, "US")
    //categoryBar("US", "Entertainment");
//-----------------------------End of bubble chart---------------------------------------------------
    
//------------------------------Start of bar chart---------------------------------------------------
    
    //bar chart
    var margin = {top: 10, right: 100, bottom: 120, left: 70},
                width = 460 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;
    var myColor = d3.scaleOrdinal()
      .range(d3.schemeSet2);
    //function for generating the dataset with country name and category name as parameters
    function country_dataset_category(country, category){
        country_data = []
        var country_name = country
        for (var i = 0; i < data.length; i++) {
            if(data[i].country == country_name){
                country_data.push(data[i])
                }
            }
        //var category_name = "Entertainment"
        var category_name = category
        category_data = []
        for (var i = 0; i < country_data.length; i++) {
            if(country_data[i].category_title == category_name){
                category_data.push(country_data[i])
                }
            }
        var data_channel_count = d3.nest()
          .key(function(d) {
            return d.channel_title;
          })
          .rollup(function(leaves) {
            return leaves.length;
          })
          .entries(category_data);

        data_channel_count.forEach(function (d) {
            d.channel = d.key;
            d.channel_count = d.value;
            });

        var topChannels = data_channel_count.sort(function(a, b) {
                            return d3.descending(+a.channel_count, +b.channel_count);
                            }).slice(0, 10);
        
        return topChannels
    }
    var div_bar = d3.select("body").append("div_bar")	
        .attr("class", "tooltip")	
        .style("opacity", 0);
    //function for bar chart updation with category selection to display top ten trending channels
    function update(data, selectedOption, category){
        var category_name = category
        var country = selectedOption
        //set domain for the x axis
        xChart.domain(data.map(function(d){ return d.channel.substring(0, 10); }) );
        //set domain for y axis
        yChart.domain( [0, d3.max(data, function(d){ return +d.channel_count+20; })] );
        //get the width of each bar 
        var barWidth = width / data.length;
        var bars = chart.selectAll(".bar_")
                        .remove()
                        .exit()
                        .data(data)
        //append the rectangle here
        bars.enter()
            .append("rect")
            .attr("class", "bar_")
            .attr("x", function(d, i){ return i * barWidth + 1 })
            .attr("y", function(d){ return yChart( d.channel_count); })
            .attr("height", function(d){ return height - yChart(d.channel_count); })
            .attr("width", barWidth - 1)
            .attr("fill", function(d){ return myColor(d.channel);})
            .on("click", function(d) {
                    var channel = d.channel
                    //channel_dataset = channel_category_dataset(country, category_name, channel)
                    show_graph(country, category_name, channel)
                })
            .on("mouseover", function(d) {	
                    d3.select(this).style("cursor", "pointer");
                    div_bar.transition()	
                        .duration(200)	
                        .style("opacity", .9);	
                    div_bar.html(d.channel+ " :" + d.channel_count)	
                        .style("left", (d3.event.pageX) + "px")	
                        .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {	
                    d3.select(this).style("cursor", "default"); 
                    div_bar.transition()	
                        .duration(500)	
                        .style("opacity", 0);})

        //left axis
        chart.select('.y')
              .call(yAxis)
        //bottom axis
        chart.select('.xAxis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d){
                    return "rotate(-65)";
                });	
    }//end of bar update

    var chart = d3.select("#barChart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xChart = d3.scaleBand()
                    .range([0, width]);	
    var yChart = d3.scaleLinear()
                    .range([height, 0]);
    var xAxis = d3.axisBottom(xChart);
    var yAxis = d3.axisLeft(yChart);

    //left axis
    chart.append("g")
          .attr("class", "y axis")
          .call(yAxis)

    //bottom axis
    chart.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d){
                return "rotate(-45)";
            });

    //add labels
    chart
        .append("text")
        .attr("transform", "translate(-35," +  (height+margin.bottom)/2 + ") rotate(-90)")
        .text("No. of trended videos");


    //display "US" country by default and "Entertainment" as category
    //country changes when the user selects the other country and however, "Film & Animation" will be selected as defualt for category
    data_category = country_dataset_category("US", "Film & Animation")
    update(data_category, "US", "Film & Animation");
    //-----------------------end of bar chart---------------------------------------------------------
    
    //function for generating the datasets
    function channel_category_dataset(country, category, channel){
        country_data = []
        data.forEach(function(d, i) {
            d.trend_date = parseDate(d.trending_date);
            })
        var country_name = country
        for (var i = 0; i < data.length; i++) {
            if(data[i].country == country_name){
                country_data.push(data[i])
                }
            }
        category_country_data = []
        var category_name = category
        for (var i = 0; i < country_data.length; i++) {
            if(country_data[i].category_title == category_name){
                category_country_data.push(country_data[i])
                }
            }
        channel_category_data = []
        var channel_name = channel
        for (var i = 0; i < category_country_data.length; i++) {
            if(category_country_data[i].channel_title == channel_name){
                channel_category_data.push(category_country_data[i])
                }
            }
        return channel_category_data
    }

//-------------------------streaming for top trending videos------------------------------------
    
//function for streaming
//referred from http://bl.ocks.org/charlesdguthrie/11356441
function top_20(country, category){
var val_attributes = function(value_for_video){
	//Set size of svg element and chart
	var margin = {top: 0, right: 0, bottom: 0, left: 0}
    var width = 600 - margin.left - margin.right
    var height = 400 - margin.top - margin.bottom
    var indentation_type = 4*15 + 5
    var bar_width = 2000;

	//Set up scales
	var x = d3.scaleLinear()
	  .domain([0,bar_width])
	  .range([0,width]);
	var y = d3.scaleBand()
    .rangeRound([0, height])
    .padding(0.1);

	//Create SVG element
	d3.select(value_for_video).selectAll("svg").remove()
	var svg = d3.select(value_for_video).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	//Package and export attributes_set
	var attributes_set = {
	  margin:margin, width:width, height:height, indentation_type:indentation_type,
	  svg:svg, x:x, y:y
	}
	return attributes_set;
}

var bar_top_values = function(value_for_video, newdata) {

	//attributes_set
	var margin=attributes_set.margin, width=attributes_set.width, height=attributes_set.height, indentation_type=attributes_set.indentation_type, 
	svg=attributes_set.svg, x=attributes_set.x, y=attributes_set.y;

	//domains
	y.domain(newdata.sort(function(a,b){
	  return b.value - a.value;
	})
	  .map(function(d) { return d.key; }));
	var max_bar_val = d3.max(newdata, function(e) {
	  return e.value;
	});
	x.domain([0,max_bar_val]);

	var each_bar = svg.selectAll("g.each_bar")						
	  .data(newdata, function(d){ return d.key});
	var bar_each_next = each_bar
	  .enter()
	  .append("g")
	  .attr("class", "each_bar")
	  .attr("transform", "translate(0," + height + margin.top + margin.bottom + ")");

	//rectangles
	bar_each_next.insert("rect")
	  .attr("class","bar")
	  .attr("x", 0)
	  .attr("opacity",0)
	  .attr("height", y.bandwidth())
	  .attr("width", function(d) { return x(d.value);}) 

	//labels
	bar_each_next.append("text")
	  .attr("class","label")
	  .attr("y", y.bandwidth()/2)
	  .attr("x",0)
	  .attr("opacity",0)
	  .attr("dy",".35em")
	  .attr("dx","0.5em")
	  .text(function(d){return d.value;}); 
	
	//Headlines
	bar_each_next.append("text")
	  .attr("class","category")
	  .attr("text-overflow","ellipsis")
	  .attr("y", y.bandwidth()/2)
	  .attr("x",indentation_type)
	  .attr("opacity",0)
	  .attr("dy",".35em")
	  .attr("dx","0.5em")
	  .text(function(d){return d.key});

	
	//bar
	each_bar.select(".bar").transition()
	  .duration(300)
	  .attr("width", function(d) { return x(d.value);})
	  .attr("opacity",1);

	//labels for each bar
	each_bar.select(".label").transition()
	  .duration(300)
	  .attr("opacity",1)
        //.attr("fill", "green")
	  .tween("text", function(d) { 
		var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d.value);
		return function(t) {
		  this.textContent = Math.round(i(t));
		};
	  });

	//tranisition
	each_bar.select(".category").transition()
	  .duration(300)
	  .attr("opacity",1);

	//exit
	each_bar.exit().transition()
	  .style("opacity","0")
	  .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
	  .remove();
    
    //reorder
	var delay = function(d, i) { return 200 + i * 30; };

	each_bar.transition()
		.delay(delay)
		.duration(900)
		.attr("transform", function(d){ return "translate(0," + y(d.key) + ")"; });
};



//get data and create a streaming here
var get_dataset = function(attributes_set,callback){
    d3.csv("YT_solution.csv", function(data) {
        country_data = []
        var country_name = country
        //var country_name = "US"
        for (var i = 0; i < data.length; i++) {
            if(data[i].country == country_name){
                country_data.push(data[i])
                }
            }
        var category_name = category
        //var category_name = "Sports"
        category_data = []
        for (var i = 0; i < country_data.length; i++) {
            if(country_data[i].category_title == category_name){
                category_data.push(country_data[i])
                }
            }
        var video_trend_data = d3.nest()
          .key(function(d) {
            return d.title;
          })
          .rollup(function(leaves) {
            return leaves.length;
          })
          .entries(category_data);

        video_trend_data.forEach(function (d) {
            d.video = d.key;
            d.views_count = d.value;
            });
        
		var newData = video_trend_data;
		video_trend_data.forEach(function(d,i){
			var newValue = d.views_count + Math.floor((Math.random()*10) - 5)
			newData[i].views_count = newValue <= 0 ? 10 : newValue
		})

		newData = formatData(newData);

		callback(attributes_set,newData);
	})
}

//Sorting
var formatData = function(data){
    return data.sort(function (a, b) {
        return b.views_count - a.views_count;
      })
	  .slice(0, 20);
}

var new_bar = function(attributes_set){
	get_dataset(attributes_set,bar_top_values)
}

var attributes_set = val_attributes('#chart');
new_bar(attributes_set)

//loop in for every 3000 ms
setInterval(function(){
	new_bar(attributes_set)
}, 3000);
}
top_20("US", "Film & Animation")

    
    //-----------------------------line graph--------------------------------------
    //line graph section
    //referred from 
    // https://www.d3-graph-gallery.com/graph/line_filter.html
    //https://www.d3-graph-gallery.com/graph/line_several_group.html
     var parseDate = d3.timeParse("%Y-%m-%d")
            var date_format =  d3.timeFormat("%Y-%m-%d");
            data.forEach(function(d, i) {
                d.trend_date = parseDate(d.trending_date);
            })
            
            var myColor = d3.scaleOrdinal()
              .domain(allGroup)
              .range(d3.schemeSet2);
            
        country_data = []
        var country_name = "US"
        for (var i = 0; i < data.length; i++) {
            if(data[i].country == country_name){
                country_data.push(data[i])
                }
            }
        //default
        var category_name = "Film & Animation"
        //var category_name = category
        category_data = []
        for (var i = 0; i < country_data.length; i++) {
            if(country_data[i].category_title == category_name){
                category_data.push(country_data[i])
                }
            }
            //default
            channel_data_each = []
            //var channel_graph_name = channel
            var channel_graph_name = "Screen Junkies"
            for(var i = 0; i < category_data.length; i++){
                if(category_data[i].channel_title == channel_graph_name){
                    channel_data_each.push(category_data[i])
                }
            }
    
        //referred from https://gist.github.com/vicapow/8811228
          var allGroup = d3.map(country_data, function(d){return(d.country)}).keys()          
          date_data = d3.nest()
            .key(function(d){ return d3.timeMonth(d.trend_date) }) // `GROUP BY date`
            //.sortKeys(d3.ascending)
            .rollup(function(values){
              var counts = {}, keys = ['views', 'likes']
              keys.forEach(function(key){
                counts[key] = d3.sum(values, function(d){ return d[key] })
              })
              return counts
            })
            .entries(channel_data_each)
            
            var convert_to_date = d3.timeParse("%b %d %Y")
            for (var i=0; i< date_data.length; i++){
                 Object.assign(date_data[i], {"country": country_name});
                var dt = date_data[i].key
                var date_split = dt.split(" ");
                var str1 = date_split[1];
                var str2 = date_split[2];
                var str3 = date_split[3];
                var date_concat = str1.concat(" ", str2, " ", str3);
                //a = convert_to_date(date_concat)
                 Object.assign(date_data[i], {"date_val": convert_to_date(date_concat)});
                }
            
            var formatDate = d3.timeFormat("%b %Y");
            //var	parseDate = d3.time.format("%Y-%m-%d").parse;
            var startDate = new Date("2017-01-01"),
            endDate = new Date("2018-12-12");
            var myColor = d3.scaleOrdinal()
                  .domain(allGroup)
                  .range(d3.schemeSet2);
            
            var x = d3.scaleTime()
                  //.domain(d3.extent(date_data, function(d) { return d.key; }))
                  .domain(d3.extent(date_data, function(d) { return d.date_val; }))
                  .range([ 0, width ])
                    .clamp(true);
                svgChart.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x)
                        .ticks(15))
                .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start");
                
            // Add Y axis
            var y = d3.scaleLinear()
                  .domain(d3.extent(date_data, function(d) { return d.value.likes; }))
                  .range([ height, 0 ]);
                svgChart.append("g")
                  .call(d3.axisLeft(y).ticks(10, "s"));
                svgChart.append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 0 - margin.left)
                  .attr("x",0 - (height / 2))
                  .attr("dy", "1em")
                  .style("text-anchor", "middle")
                  .text("Amount Earned"); 
            
            var line = svgChart
                  .append('g')
                  .append("path")
                    .datum(date_data)
                    .attr("d", d3.line()
                      .x(function(d) { return x(d.date_val) })
                      .y(function(d) { return y(d.value.likes) })
                    )
                    .attr("stroke", function(d){ return myColor(channel_graph_name) })
                    .style("stroke-width", 4)
                    .style("fill", "none");
    
    //function for monthly income report
    function show_graph(country, category, channel){
            country_data = []
            var country_name = country
            for (var i = 0; i < data.length; i++) {
                if(data[i].country == country_name){
                    country_data.push(data[i])
                    }
                }
            //var category_name = "Film & Animation"
            var category_name = category
            category_data = []
            for (var i = 0; i < country_data.length; i++) {
                if(country_data[i].category_title == category_name){
                    category_data.push(country_data[i])
                    }
                }
    
            channel_data_each = []
            var channel_graph_name = channel
            //var channel_graph_name = "Screen Junkies"
            for(var i = 0; i < category_data.length; i++){
                if(category_data[i].channel_title == channel_graph_name){
                    channel_data_each.push(category_data[i])
                }
            }
          var allGroup = d3.map(country_data, function(d){return(d.country)}).keys()          
          date_data = d3.nest()
            .key(function(d){ return d3.timeMonth(d.trend_date) }) // `GROUP BY date`
            //.key(function(d){ return d.trending_date }) // `GROUP BY date`
            //.sortKeys(d3.ascending)
            .rollup(function(values){
              // `values` is all the rows of a particular date
              var counts = {}, keys = ['views', 'likes']
              keys.forEach(function(key){
                counts[key] = d3.sum(values, function(d){ return d[key] })
              })
              return counts
            })
            .entries(channel_data_each)
            var convert_to_date = d3.timeParse("%b %d %Y")
            for (var i=0; i< date_data.length; i++){
                 Object.assign(date_data[i], {"country": country_name});
                 //Object.assign(date_data[i], {"date_val": date_data[i].key});
                var dt = date_data[i].key
                //var date_concat = ""
                var date_split = dt.split(" ");
                var str1 = date_split[1];
                var str2 = date_split[2];
                var str3 = date_split[3];
                //var date_final = str1 + " " + str2 + " " + str3
                var date_concat = str1.concat(" ", str2, " ", str3);
                 Object.assign(date_data[i], {"date_val": convert_to_date(date_concat)});
                }
            
            var formatDate = d3.timeFormat("%b %Y");
            
            //x axis
            x
                .domain(d3.extent(date_data, function(d) { return d.date_val; }))
                .range([ 0, width ]);
            //y axis
            y
                  .domain(d3.extent(date_data, function(d) { return d.value.likes; }))
                  .range([ height, 0 ]);
            line
              .datum(date_data)
              .transition()
              .duration(1000)
              .attr("d", d3.line()
                .x(function(d) { return x(d.date_val) })
                .y(function(d) { return y(d.value.likes) })
              )
              .attr("stroke", function(d){ return myColor(country_name) })
        }
    //-------------------------final call-----------------------
    //finally, calling all the functions here based on filter inputs    
    d3.select("#selectButton").on("change", function(d) {
                var selectedOption = d3.select(this).property("value")
                dataset = dataset_country(selectedOption)
                drawNodes(dataset, selectedOption)
                data_category = country_dataset_category(selectedOption, "Film & Animation")
                update(data_category, selectedOption, "Film & Animation");
                if(selectedOption == "UK"){
                    var channel = "HBO"
                }
                if(selectedOption == "India"){
                    var channel = "Think Music India"
                }
                if(selectedOption == "US"){
                    var channel = "HBO"
                }
                show_graph(selectedOption, "Film & Animation", channel)
                top_20(selectedOption, "Film & Animation")
                })
    
})