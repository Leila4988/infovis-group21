function removeOldUsage() {
  d3.select("#usage_group")
    .remove();
  d3.select("#usage_grid")
    .remove()
}

function removeOldWheel() {
  d3.select("#my_dataviz")
    .remove();
}

// gridlines in x axis function
function make_y_usage_gridlines() {
  return d3.axisLeft(y_usage)
    .ticks(7)
}


function plot_donut() {

  var fetch_url = "/color_list";
  fetch(fetch_url)
    .then(function (response) { return response.json(); })
    .then((data) => {
      var default_color = "Brown",
        selected_color = "Brown",
        legend_colors = [],
        index = 0;
      data.forEach(function (d) {
        if (index == 0) {
          index += 1
        }
        else {

        }
        legend_colors.push(d.RGB)
      });

      // append the svg object
      var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", donut_width + donut_margin.left + donut_margin.right)
        .attr("height", donut_height + donut_margin.top + donut_margin.bottom)

      var dount_group = svg
        .append("g")
        .attr("transform", "translate(" + (donut_width / 3 + 30) + "," + (donut_height / 2 - 20) + ")");

      // Compute the position of each group on the pie:
      var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function (d) { return d.value.Value; })
      var data_ready = pie(d3.entries(data))

      // The arc generator
      var arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      dount_group
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("class", "countbar")
        .attr('d', arc)
        .attr('fill', function (d) { return d.data.value.RGB })
        .attr("stroke", function (d, i) {
          if (d.data.value.Colour == selected_color) { return "red" }
          else { return "#C4C4C4" }
        })
        .style("stroke-width", "1px")
        .on("click", function (d) {
          d3.selectAll(".countbar").attr("stroke", "#C4C4C4").attr("stroke-width", "1px");
          d3.select(this).attr("stroke-width", "3px");
          d3.select(this).attr("stroke", "red");
          selected_color = d.data.value.Colour;
          d3.selectAll(".legendBlock").attr("stroke", function (d) {
            if (d.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          }).attr("stroke-width", function (d) {
            if (d.Colour == selected_color) { return "2px" }
            else { return "1px" }
          });
          var colour_name = d.data.value.Colour;
          plot_usage(colour_name)
        })
        .on("mouseover", function (d, i) {
          d3.selectAll(".countbar").attr("stroke", function (d, i) {
            if (d.data.value.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          });
          d3.select(this).attr("stroke", "black");
          d3.select(this).attr("stroke-width", "3px");
          displayTooltip("<b>Colour_Name: </b>" + d.data.value.Colour + "<br /><b>Count: </b>" + d.data.value.Value)
        })
        .on("mousemove", function (d, i) {
          d3.selectAll(".countbar").attr("stroke", function (d, i) {
            if (d.data.value.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          });
          d3.select(this).attr("stroke", "black");
          d3.select(this).attr("stroke-width", "3px");
          displayTooltip("<b>Colour_Name: </b>" + d.data.value.Colour + "<br /><b>Count: </b>" + d.data.value.Value)
        })
        .on("mouseout", function (d) {
          d3.selectAll(".countbar").attr("stroke", function (d, i) {
            if (d.data.value.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          });
          hideTooltip();
        })

      function compare(p) {
        return function (m, n) {
          var a = m[p];
          var b = n[p];
          return b - a; //升序
        }
      }

      ordered_data = data.sort(compare("Value"));

      var legend_group = svg.append("g")
        .attr("id", "legend_group")
        .attr("width", radius * 0.3)
        .attr("height", donut_height)
        .attr("transform", "translate(" + radius * 1.7 + "," + (20) + ")");

      var y_legend = d3.scaleBand().range([20, usage_svg_height * 2 / 3]).padding(0.1);
      var number = legend_colors.length
      // Scale the range of the data in the domains
      var domains = [];
      for (var n = 0; n < number; n++) domains.push(n + 1)
      y_legend.domain(domains);
      block_height = usage_svg_height / (3 * number)

      legend_group.selectAll(".legendBlock")
        .data(ordered_data)
        .enter()
        .append("rect")
        .attr("class", "legendBlock")
        .attr("x", "20")
        .attr("y", function (d, i) {
          console.log(Math.floor((i + 1) % (number + 1)))
          return y_legend(Math.floor((i + 1) % (number + 1)))
        })
        .attr("fill", function (d) { return d.RGB })
        .attr("width", block_height)
        .attr("height", block_height)
        .attr("stroke-width", "1px")
        .attr("stroke", function (d, i) {
          if (d.Colour == selected_color) { return "red" }
          else { return "#C4C4C4" }
        })
        .on("click", function (d, i) {
          d3.selectAll(".legendBlock").attr("stroke", "#C4C4C4").attr("stroke-width", "1px");
          d3.select(this).attr("stroke-width", "2px");
          selected_color = d.Colour;
          d3.selectAll(".countbar").attr("stroke", function (d, i) {
            if (d.data.value.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          }).attr("stroke-width", function (d) {
            if (d.data.value.Colour == selected_color) { return "3px" }
            else { return "1px" }
          });
          d3.select(this).attr("stroke", "red");
          var colour_name = d.Colour;
          plot_usage(colour_name)
        })
        .on("mouseover", function (d, i) {
          d3.selectAll(".legendBlock").attr("stroke", function (d, i) {
            if (d.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          }).attr("stroke-width", "1px");
          d3.select(this).attr("stroke", "black");
          d3.select(this).attr("stroke-width", "2px");
        })
        .on("mousemove", function (d, i) {
          d3.selectAll(".legendBlock").attr("stroke", function (d, i) {
            if (d.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          }).attr("stroke-width", "1px");
          d3.select(this).attr("stroke", "black");
          d3.select(this).attr("stroke-width", "2px");
        })
        .on("mouseout", function (d) {
          d3.selectAll(".legendBlock").attr("stroke", function (d, i) {
            if (d.Colour == selected_color) { return "red" }
            else { return "#C4C4C4" }
          });
        })

      var text_group = svg.append("g")
        .attr("id", "legend_group")
        .attr("width", radius * 0.3)
        .attr("height", donut_height)
        .attr("transform", "translate(" + (radius * 1.7 + block_height) + "," + (20) + ")");

      text_group.selectAll(".legendText")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "legendText")
        .attr("x", "24")
        .attr("y", function (d, i) {
          return y_legend(Math.floor((i + 1) % (number + 1))) + block_height * 4 / 5
        })
        .attr("fill", "gray")
        .style("font-size", "13px")
        .style("text-anchor", "left")
        .text(function (d) { return d.Colour });

      var count_group = svg.append("g")
        .attr("id", "legend_group")
        .attr("width", radius * 0.3)
        .attr("height", donut_height)
        .attr("transform", "translate(" + (radius * 1.8 + block_height) + "," + (20) + ")");

      count_group.selectAll(".legendCount")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "legendCount")
        .attr("x", "55")
        .attr("y", function (d, i) {
          return y_legend(Math.floor((i + 1) % (number + 1))) + block_height * 4 / 5
        })
        .attr("fill", "gray")
        .style("font-size", "13px")
        .style("text-anchor", "left")
        .text(function (d) { return d.Value });


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

      function compare(p) {
        return function (m, n) {
          var a = m[p];
          var b = n[p];
          return b - a; //升序
        }
      }

      ordered_data = data.sort(compare("count"));
      console.log(ordered_data)

      // removeOldDonut
      // Scale the range of the data in the domains
      x_usage.domain(ordered_data.map(function (d) { return d.artist; }));
      y_usage.domain([0, d3.max(ordered_data, function (d) { return d.percent; })]);

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
        .data(ordered_data)
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
        .attr("stroke", "#C4C4C4")
        // .attr("stroke", function (d, i) {
        //   if (default_artist == d.artist) { return "red" }
        //   else { return "white" }
        // })
        .on("mouseover", function (d, i) {
          d3.selectAll(".usagebar").attr("stroke", "#C4C4C4");
          d3.select(this).attr("stroke", "black");
          displayTooltip("<b>Artist: </b>" + d.artist + "<br /><b>Usage Count: </b>" + d.count)
        })
        .on("mousemove", function (d, i) {
          d3.selectAll(".usagebar").attr("stroke", "#C4C4C4");
          d3.select(this).attr("stroke", "black");
          displayTooltip("<b>Artist: </b>" + d.artist + "<br /><b>Usage Count: </b>" + d.count)
        })
        .on("mouseout", function (d) {
          d3.selectAll(".usagebar").attr("stroke", "#C4C4C4");
          hideTooltip();
        })

      const ticksAmount = 5;
      const tickStep = (d3.max(data, function (d) { return d.count; }) - d3.min(data, function (d) { return d.count; })) / (ticksAmount);
      const step = Math.ceil(tickStep / 5) * 5;

      // add the X Axis
      usage_group.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(15," + (usage_svg_height) + ")")
        .call(d3.axisBottom(x_usage))
        .call(g => g.select(".domain").attr('stroke-width', 0))
      // .selectAll("text")
      // .attr("transform", "rotate(10)");

      var x_usage_text = d3.scaleBand().range([usage_margin.left, usage_svg_width - 15]).padding(0.1)
      x_usage_text.domain(data.map(function (d) { return d.count.toString(); }));

      // // add the X Axis
      // usage_group.append("g")
      //   .attr("class", "xAxis")
      //   .attr("transform", "translate(15," + (usage_svg_height + 10) + ")")
      //   .call(d3.axisBottom(x_usage_text))
      //   .call(g => g.select(".domain").attr('stroke-width', 0))

      // add the Y Axis
      usage_group.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + 25 + ",0)")
        .call(d3.axisLeft(y_usage).ticks(10))
        .call(g => g.select(".domain").attr('stroke-width', 0))
        .append("text")
        .text("percent(%)")
        .style("font-size", "10px")
        .attr("transform", "translate(" + 45 + ",-20)")
        .attr("text-anchor", "end")
        .attr("dy", "1em")


    });


}