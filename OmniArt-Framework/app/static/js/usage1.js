function removeOldDonut() {
    d3.select("##usage1")
        .remove();
}

function removeOldWheel() {
    d3.select("##my_dataviz")
        .remove();
}

function plotWheel(){

// append the svg object
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", wheel_width + wheel_margin.left + wheel_margin.right)
    .attr("height", wheel_height + wheel_margin.top + wheel_margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (wheel_width / 2 + wheel_margin.left) + "," + (wheel_height / 2 + wheel_margin.top) + ")");

d3.csv("https://raw.githubusercontent.com/Dongliang7/AML-group64/main/colorlist.csv", function(data) {

  // Scales
  var x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.Colour; })); // The domain of the X axis is the list of states.
  var y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", function(d) { return d['RGB']; })
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return y(d['Value']); })
          .startAngle(function(d) { return x(d.Colour); })
          .endAngle(function(d) { return x(d.Colour) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))
      .on("click",function(d){
        d3.select(this)
          .attr("fill" , "red");
        var colour_name = d.Colour;
          removeOldDonut();
          plot_donut(colour_name)
      })
  // Add the labels
  svg.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (x(d.Colour) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.Colour) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Value'])+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.Colour)})
        .attr("transform", function(d) { return (x(d.Colour) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

});

    
}



function plot_donut(colour_name) {
    var fetch_url = "/usage_data?colour_name=" + colour_name;
    fetch(fetch_url)
        .then(function (response) { return response.json(); })
        .then((data) => {
            // format the data
            var colour_code
            var artist_1 ;
            var count_1;
            var artist_2 ;
            var count_2;
            var artist_3 ;
            var count_3;
            var artist_4 ;
            var count_4;
            var artist_5 ;
            var count_5;
            colors = []
            number = data.length
            data.forEach(function (d) {
                colour_code = d.hex
                artist_1 = d.artist_1
                count_1 = d.count_1
                artist_2 = d.artist_2
                count_2 = d.count_2
                artist_3 = d.artist_3
                count_3 = d.count_3
                artist_4 = d.artist_4
                count_4 = d.count_4
                artist_5 = d.artist_5
                count_5 = d.count_5
            });

        // append the svg object to the div called 'usage1'
        var svg = d3.select("#usage1")
          .append("svg")
             .attr("width", donut_width / 5)
             .attr("height", donut_height)
          .append("g")
             .attr("transform", "translate(" + donut_width / 10 + "," + donut_height / 2 + ")");

        // Create dummy data
        var data = {a: count_1, b: 100 - count_1}

        // set the color scale
        var color = d3.scaleOrdinal()
          .domain(data)
          .range([colour_code, "#F5F5F5"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
           .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
           .selectAll('whatever')
           .data(data_ready)
           .enter()
           .append('path')
           .attr('d', d3.arc()
              .innerRadius(30)         // This is the size of the donut hole
              .outerRadius(radius)
        )
           .attr('fill', function(d){ return(color(d.data.key)) })
        
        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 5)
              .text(count_1+"%")


        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 75)
              .text(artist_1)        
        
        // append the svg object to the div called 'usage1'
        var svg = d3.select("#usage1")
          .append("svg")
             .attr("width", donut_width / 5)
             .attr("height", donut_height)
          .append("g")
             .attr("transform", "translate(" + donut_width / 10 + "," + donut_height / 2 + ")");

        // Create dummy data
        var data = {a: count_2, b: 100 - count_2}

        // set the color scale
        var color = d3.scaleOrdinal()
          .domain(data)
          .range([colour_code, "#F5F5F5"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
           .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
           .selectAll('whatever')
           .data(data_ready)
           .enter()
           .append('path')
           .attr('d', d3.arc()
              .innerRadius(30)         // This is the size of the donut hole
              .outerRadius(radius)
        )
           .attr('fill', function(d){ return(color(d.data.key)) })
        
        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 5)
              .text(count_2+"%")


        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 75)
              .text(artist_2)       


// append the svg object to the div called 'usage1'
        var svg = d3.select("#usage1")
          .append("svg")
             .attr("width", donut_width / 5)
             .attr("height", donut_height)
          .append("g")
             .attr("transform", "translate(" + donut_width / 10 + "," + donut_height / 2 + ")");

        // Create dummy data
        var data = {a: count_3, b: 100 - count_3}

        // set the color scale
        var color = d3.scaleOrdinal()
          .domain(data)
          .range([colour_code, "#F5F5F5"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
           .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
           .selectAll('whatever')
           .data(data_ready)
           .enter()
           .append('path')
           .attr('d', d3.arc()
              .innerRadius(30)         // This is the size of the donut hole
              .outerRadius(radius)
        )
           .attr('fill', function(d){ return(color(d.data.key)) })
        
        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 5)
              .text(count_3+"%")


        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 75)
              .text(artist_3)   

// append the svg object to the div called 'usage1'
        var svg = d3.select("#usage1")
          .append("svg")
             .attr("width", donut_width / 5)
             .attr("height", donut_height)
          .append("g")
             .attr("transform", "translate(" + donut_width / 10 + "," + donut_height / 2 + ")");

        // Create dummy data
        var data = {a: count_4, b: 100 - count_4}

        // set the color scale
        var color = d3.scaleOrdinal()
          .domain(data)
          .range([colour_code, "#F5F5F5"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
           .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
           .selectAll('whatever')
           .data(data_ready)
           .enter()
           .append('path')
           .attr('d', d3.arc()
              .innerRadius(30)         // This is the size of the donut hole
              .outerRadius(radius)
        )
           .attr('fill', function(d){ return(color(d.data.key)) })
        
        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 5)
              .text(count_4+"%")


        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 75)
              .text(artist_4)       

// append the svg object to the div called 'usage1'
        var svg = d3.select("#usage1")
          .append("svg")
             .attr("width", donut_width / 5)
             .attr("height", donut_height)
          .append("g")
             .attr("transform", "translate(" + donut_width / 10 + "," + donut_height / 2 + ")");

        // Create dummy data
        var data = {a: count_5, b: 100 - count_5}

        // set the color scale
        var color = d3.scaleOrdinal()
          .domain(data)
          .range([colour_code, "#F5F5F5"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
           .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
           .selectAll('whatever')
           .data(data_ready)
           .enter()
           .append('path')
           .attr('d', d3.arc()
              .innerRadius(30)         // This is the size of the donut hole
              .outerRadius(radius)
        )
           .attr('fill', function(d){ return(color(d.data.key)) })
        
        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 5)
              .text(count_5+"%")


        svg.append("text")
              .attr("text-anchor", "middle")
                .attr('y', 75)
              .text(artist_5)       

        });


}