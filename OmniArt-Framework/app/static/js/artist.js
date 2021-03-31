// gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(x)
        .ticks(10)
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
            default_artist = {}
            index = 0
            data.forEach(function (d) {
                if (index == 0) {
                    default_artist['artist_name'] = d.artist
                    default_artist['startYear'] = +d.startYear
                    default_artist['endYear'] = +d.endYear
                    default_artist['fullname'] = d.fullname
                    index += 1
                    //default vis
                    plot_year(default_artist['artist_name'], default_artist['startYear'], default_artist['endYear'], default_artist['fullname'])
                }
                else {

                }
                d.startYear = +d.startYear;
                d.endYear = +d.endYear;
                artists.push(d.artist)
                colors.push(d.color)
            });
            selected_artist = default_artist.artist_name

            x.domain([d3.min(data, function (d) { return d.startYear; }), d3.max(data, function (d) { return d.endYear; })])
            y.domain(artists)

            // add the X grid
            artistSvg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(20," + artist_bar_height + ")")
                .call(make_x_gridlines()
                    .tickSize(-year_svg_height)
                    .tickFormat("")
                )

            // add react
            var chart_group = artistSvg.append("g")
                .attr("id", "chart_group")
                .attr("transform", "translate(" + 20 + "," + 0 + ")")



            chart_group.selectAll(".artistbar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "artistbar")
                .attr("x", function (d) { return x(d.startYear) })
                .attr("y", function (d) { return y(d.artist) + y.bandwidth() / 3 })
                .attr("fill", function (d) { return d.color })
                .attr("width", function (d) { return x(d.endYear) - x(d.startYear); })
                .attr("height", y.bandwidth() / 3)
                .attr("stroke", function (d,i) { 
                    if (i == 0){return "red" }
                    else {return "white"}
                })
                .attr("stroke-width", "1.5px")
                .attr("rx", 3)
                .attr("ry", 3)
                .on("click", function (d, i) {
                    d3.selectAll(".artistbar").attr("stroke", "white");
                    d3.select(this).attr("stroke", "red");
                    // d3.select(this).attr({ "stroke-width": "50%", "stroke": "black" });
                    var artist_name = d.artist;
                    selected_artist = d.artist;
                    plot_year(artist_name, d.startYear, d.endYear, d.fullname)
                })
                .on("mouseover", function (d, i) {
                    d3.selectAll(".artistbar").attr("stroke", function (d,i) { 
                        if (d.artist == selected_artist){return "red" }
                        else {return "white"}
                    });
                    d3.select(this).attr("stroke", "black");

                    displayTooltip("<b>Artist: </b>" + d.fullname + "<br /><b>From: </b>" +
                    d.startYear + "<br /><b>To: </b>" + d.endYear)
                })
                .on("mousemove", function (d, i) {
                    d3.selectAll(".artistbar").attr("stroke", function (d,i) { 
                        if (d.artist == selected_artist){return "red" }
                        else {return "white"}
                    });
                    d3.select(this).attr("stroke", "black");

                    displayTooltip("<b>Artist: </b>" + d.fullname + "<br /><b>From: </b>" +
                    d.startYear + "<br /><b>To: </b>" + d.endYear)
        
                    //d3.select(this).attr("fill", "DarkOrange");
                })
                .on("mouseout", function (d) {
                    d3.selectAll(".artistbar").attr("stroke", function (d,i) { 
                        if (d.artist == selected_artist){return "red" }
                        else {return "white"}
                    });
                    hideTooltip();
                    //d3.select(this).attr("fill", "steelblue");
                });

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