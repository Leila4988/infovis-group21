// gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5)
        .attr('id', 'test')

}

function plot() {
    var fetch_url = "/artists_data";
    fetch(fetch_url)
        .then(function (response) { return response.json(); })
        .then((data) => {
            // format the data
            artists = []
            colors = []
            number = data.length
            data.forEach(function (d) {
                d.startYear = +d.startYear;
                d.endYear = +d.endYear;
                artists.push(d.artist)
                colors.push(d.color)
            });

            x.domain([d3.min(data, function (d) { return d.startYear; }), d3.max(data, function (d) { return d.endYear; })])
            y.domain(artists)

            console.log(x(1927))
            console.log(artist_bar_width)
            console.log(artist_width)

            // add the X grid
            artistSvg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(20," + artist_bar_height + ")")
                .call(make_x_gridlines()
                    .tickSize(-artist_bar_height)
                    .tickFormat("")
                )

            // add react
            var chart_group = artistSvg.append("g")
                .attr("id", "chart_group")
                .attr("transform", "translate("+20+ "," + 0 + ")")
            
               

            chart_group.selectAll(".artistbar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "artistbar")
                .attr("x", function (d) { return x(d.startYear) })
                .attr("y", function (d) { return y(d.artist) + y.bandwidth() / 3 })
                .attr("fill", function (d) { return d.color })
                .attr("width", function (d) { return x(d.endYear)-x(d.startYear); })
                .attr("height", y.bandwidth() / 3)
                .attr("rx", 15)
                .attr("ry", 20)
                .on("click", function (d, i) {
                    var artist_name = d.artist;
                    plot_year(artist_name)
                })

            // add the X Axis
            artistSvg.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(20," + (artist_height - 20) + ")")
                .call(d3.axisBottom(x))
                .call(g => g.select(".domain").attr('stroke-width', 0));
            // remove());


            // add the Y Axis
            artistSvg.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + 50 + ",0)")
                .call(d3.axisLeft(y))
                .call(g => g.select(".domain").attr('stroke-width', 0));
        });
}