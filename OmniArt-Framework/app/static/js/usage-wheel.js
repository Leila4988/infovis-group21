function removeOldUsage() {
  d3.select("#usage_group")
    .remove();
  d3.select("#usage_grid")
    .remove()
}

function removeOldWheel() {
  d3.select("##my_dataviz")
    .remove();
}

// gridlines in x axis function
function make_y_usage_gridlines() {
  return d3.axisLeft(y_usage)
    .ticks(7)
}


function plotWheel() {

  // append the svg object
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", wheel_width + wheel_margin.left + wheel_margin.right)
    .attr("height", wheel_height + wheel_margin.top + wheel_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (wheel_width / 4 + wheel_margin.left) + "," + (wheel_height / 2 + wheel_margin.top) + ")");

  var fetch_url = "/color_list";
  fetch(fetch_url)
    .then(function (response) { return response.json(); })
    .then((data) => {
      default_color = "Brown"
      selected_color = "Brown"
      // Scales
      var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(data.map(function (d) { return d.Colour; })); // The domain of the X axis is the list of states.
      var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

      // Add the bars
      svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "countbar")
        .attr("fill", function (d) { return d['RGB']; })
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function (d) { return y(d['Value'] / 20); })
          .startAngle(function (d) { return x(d.Colour); })
          .endAngle(function (d) { return x(d.Colour) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))
        .attr("stroke", "#C4C4C4")
        .attr("stroke-width", function (d, i) {
          if (d.Colour == "Brown") { return "2px" }
          else { return "1px" }
        })
        .on("click", function (d) {
          d3.selectAll(".countbar").attr("stroke", "white");
          d3.select(this).attr("stroke", "red");
          selected_color = d.Colour;
          var colour_name = d.Colour;
          plot_usage(colour_name)
        })
        .on("mouseover", function (d, i) {
          d3.selectAll(".countbar").attr("stroke", function (d, i) {
            if (d.Colour == selected_color) { return "red" }
            else { return "white" }
          });
          d3.select(this).attr("stroke", "black");
          displayTooltip("<b>Color_name: </b>" + d.Colour + "<br /><b>Count: </b>" + d.Value)
        })
        .on("mousemove", function (d, i) {
          d3.selectAll(".countbar").attr("stroke", function (d, i) {
            if (d.Colour == selected_color) { return "red" }
            else { return "white" }
          });
          d3.select(this).attr("stroke", "black");
          displayTooltip("<b>Color_name: </b>" + d.Colour + "<br /><b>Count: </b>" + d.Value)
        })
        .on("mouseout", function (d) {
          d3.selectAll(".countbar").attr("stroke", function (d, i) {
            if (d.Colour == selected_color) { return "red" }
            else { return "white" }
          });
          hideTooltip();
        })

      // Add the labels
      svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor", function (d) { return (x(d.Colour) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function (d) { return "rotate(" + ((x(d.Colour) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['Value']) + 10) + ",0)"; })
        .append("text")
        .text(function (d) { return (d.Colour) })
        .attr("transform", function (d) { return (x(d.Colour) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")


      plot_usage(default_color)
    

    });


}



function plot_usage(colour_name) {
  var fetch_url = "/usage_data?colour_name=" + colour_name;
  fetch(fetch_url)
    .then(function (response) { return response.json(); })
    .then((data) => {
      removeOldUsage();
      index = 0
      default_artist = ""
      data.forEach(function (d) {
        if (index == 0 & d.count != 0) {
          default_artist = d.artist
          index = 1
        }
        else {

        }
      });
      // removeOldDonut
      // Scale the range of the data in the domains
      x_usage.domain(data.map(function (d) { console.log(d.artist); return d.artist; }));
      y_usage.domain([0, d3.max(data, function (d) { return d.percent; })]);

      // add the Y grid
      usageSvg.append("g")
        .attr("class", "grid")
        .attr("id", "usage_grid")
        .attr("transform", "translate(20," + 20 + ")")
        .call(make_y_usage_gridlines()
          .tickSize(-usage_svg_width + 15)
          .tickFormat("")
        )

      // add react group
      var usage_group = usageSvg.append("g")
        .attr("id", "usage_group")
        .attr("width", usage_svg_width)
        .attr("height", usage_svg_height)
        .attr("transform", "translate(" + 0 + "," + 20 + ")");

      var usage_chart = usage_group.append("g")
        .attr("id", "usage_chart")
        .attr("transform", "translate(" + 15 + "," + 0 + ")");

      usage_chart.selectAll(".usagebar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "usagebar")
        .attr("x", function (d) { return x_usage(d.artist) + x_usage.bandwidth() / 4 })
        .attr("y", function (d) {
          return y_usage(d.percent)
        })
        .attr("fill", function (d) { return d.color })
        .attr("width", x_usage.bandwidth() / 2)
        .attr("height", function (d) {
          return usage_svg_height - y_usage(d.percent);
          // return y_usage(d.count); 
        })
        .attr("rx", 5)
        .attr("ry", 5)
        // .attr("stroke", function (d, i) {
        //   if (default_artist == d.artist) { return "red" }
        //   else { return "white" }
        // })
        .on("mouseover", function (d, i) {
          d3.selectAll(".usagebar").attr("stroke", "white");
          d3.select(this).attr("stroke", "black");
          displayTooltip("<b>Artist: </b>" + d.artist + "<br /><b>Usage Percent: </b>" + d.percent)
        })
        .on("mousemove", function (d, i) {
          d3.selectAll(".usagebar").attr("stroke", "white");
          d3.select(this).attr("stroke", "black");
          displayTooltip("<b>Artist: </b>" + d.artist + "<br /><b>Usage Percent: </b>" + d.percent)
        })
        .on("mouseout", function (d) {
          d3.selectAll(".usagebar").attr("stroke", "white");
          hideTooltip();
        })

      const ticksAmount = 5;
      const tickStep = (d3.max(data, function (d) { return d.count; }) - d3.min(data, function (d) { return d.count; })) / (ticksAmount);
      const step = Math.ceil(tickStep / 5) * 5;

      // add the X Axis
      usage_group.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(15," + (usage_svg_height + 10) + ")")
        .call(d3.axisBottom(x_usage))
        .call(g => g.select(".domain").attr('stroke-width', 0))
        .selectAll("text")
        .attr("transform", "rotate(10)");

      // add the Y Axis
      usage_group.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + 22 + ",0)")
        .call(d3.axisLeft(y_usage).ticks(10))
        .call(g => g.select(".domain").attr('stroke-width', 0));


    });


}