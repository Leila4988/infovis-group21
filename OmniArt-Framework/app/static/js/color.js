function removeOldChart() {
    d3.select("#year_group")
        .remove();
    d3.select("#color_group")
        .remove();
    d3.select("#year_grid")
        .remove();
}

// gridlines in x axis function
function make_y_year_gridlines() {
    return d3.axisLeft(y_year)
        .ticks(7)
}

function removeOldBlocks() {
    d3.select("#color_group")
        .remove();
}

function plot_year(artist_name, start, end, fullname) {
    var fetch_url = "/year_data?artist_name=" + artist_name;
    fetch(fetch_url)
        .then(function (response) { return response.json(); })
        .then((data) => {
            removeOldChart()
            var y = document.getElementById("artist_year_name");
            y.innerHTML = fullname + " " + start + "-" + end;
            index = 0
            default_artist = {}
            data.forEach(function (d) {
                if (index == 0) {
                    default_artist['artist_name'] = d.artist
                    default_artist['year'] = +d.year
                    console.log("plot")
                    plot_blocks(default_artist['artist_name'], default_artist['year'])
                    index = 1
                }
                else{
                    
                }
            });
            selected_year = default_artist.year
            // Scale the range of the data in the domains
            x_year.domain(data.map(function (d) { return d.year; }));
            y_year.domain([0, d3.max(data, function (d) { return d.count; })]);

            // add the Y grid
            yearSvg.append("g")
                .attr("class", "grid")
                .attr("id", "year_grid")
                .attr("transform", "translate(30," + 5 + ")")
                .call(make_y_year_gridlines()
                    .tickSize(-year_svg_width + 15)
                    .tickFormat("")
                )

            // add react group
            var year_group = yearSvg.append("g")
                .attr("id", "year_group")
                .attr("width", year_svg_width)
                .attr("height", year_bar_height)
                .attr("transform", "translate(" + 10 + "," + 5 + ")");

            var year_chart = year_group.append("g")
                .attr("id", "year_chart")
                .attr("transform", "translate(" + 15 + "," + 0 + ")");

            year_chart.selectAll(".yearbar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "yearbar")
                .attr("x", function (d) { return x_year(d.year) + x_year.bandwidth() / 4 })
                .attr("y", function (d) { return y_year(d.count) })
                .attr("fill", function (d) { return d.color })
                .attr("width", x_year.bandwidth() / 2)
                .attr("height", function (d) { return year_bar_height - y_year(d.count); })
                .attr("stroke-width", "1.5px")
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("stroke", function (d,i) { 
                    if (i == 0){return "red" }
                    else {return "white"}
                })
                .on("click", function (d, i) {
                    d3.selectAll(".yearbar").attr("stroke", "white");
                    d3.select(this).attr("stroke", "red");
                    var artist_name = d.artist, year = d.year;
                    selected_year = d.year;
                    plot_blocks(artist_name, year)
                })
                .on("mouseover", function (d, i) {
                    // d3.selectAll(".yearbar").attr("stroke", "white");
                    d3.selectAll(".yearbar").attr("stroke", function (d,i) { 
                        if (d.year == selected_year){return "red" }
                        else {return "white"}
                    });
                    d3.select(this).attr("stroke", "black");

                    displayTooltip("<b>Artist: </b>" + d.artist + "<br /><b>Year: </b>" +
                    d.year + "<br /><b>Artwork Number: </b>" + d.count)
                })
                .on("mousemove", function (d, i) {
                    // d3.selectAll(".yearbar").attr("stroke", "white");
                    d3.selectAll(".yearbar").attr("stroke", function (d,i) { 
                        if (d.year == selected_year){return "red" }
                        else {return "white"}
                    });
                    d3.select(this).attr("stroke", "black");

                    displayTooltip("<b>Artist: </b>" + d.artist + "<br /><b>Year: </b>" +
                    d.year + "<br /><b>Artwork Number: </b>" + d.count)
        
                    //d3.select(this).attr("fill", "DarkOrange");
                })
                .on("mouseout", function (d) {
                    // d3.selectAll(".yearbar").attr("stroke", "white");
                    d3.selectAll(".yearbar").attr("stroke", function (d,i) { 
                        if (d.year == selected_year){return "red" }
                        else {return "white"}
                    });
                    hideTooltip();
                    //d3.sele
                })

            const ticksAmount = 5;
            const tickStep = (d3.max(data, function (d) { return d.count; }) - d3.min(data, function (d) { return d.count; })) / (ticksAmount);
            const step = Math.ceil(tickStep / 5) * 5;

            // add the X Axis
            year_group.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(15," + year_bar_height + ")")
                .call(d3.axisBottom(x_year)
                    .tickValues(x_year.domain().filter(function (d, i) { return !(i % 10) })))
                .call(g => g.select(".domain").attr('stroke-width', 0))
            // .selectAll("text")
            // .attr("transform", "rotate(80)");
            // remove());

            // add the Y Axis
            year_group.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + 22 + ",0)")
                .call(d3.axisLeft(y_year).ticks(10))
                .call(g => g.select(".domain").attr('stroke-width', 0));

            //default vis
            console.log(default_artist['artist_name'],default_artist['year'])
            
            // plot_blocks(default_artist['artist_name'], default_artist['year'])
        });
}

function plot_blocks(artist_name, year) {
    var fetch_url = "/color_data?artist_name=" + artist_name + "&year=" + year;
    fetch(fetch_url)
        .then(function (response) { return response.json(); })
        .then((data) => {
            removeOldBlocks()
            dominant_colors = []
            index = 0
            default_artist = {}
            data.forEach(function (d) {
                if (index == 0){
                    default_artist['artwork_url'] = d.artwork_url
                    default_artist['paint_id'] = d.paint_id
                    default_artist['artwork_name'] = d.artwork_name
                    default_artist['year'] = d.year
                    index += 1
                }
                else{
                    
                }
                dominant_colors.push(d.color)
            });

            selected_id = default_artist.paint_id

            var number = dominant_colors.length
            // add color-blocks group
            var color_group = yearSvg.append("g")
                .attr("id", "color_group")
                .attr("width", year_svg_width)
                .attr("height", color_blocks_height)
                .attr("transform", "translate(" + 0 + "," + (year_bar_height + 20) + ")");

            var block_height = Math.sqrt(year_svg_width * color_blocks_height / number) * 2 / 3;
            while (block_height > color_blocks_height) {
                block_height = block_height * 4 / 5
            }
            var horizontal_numbers = year_svg_width / block_height,
                vertical_numbers = color_blocks_height / block_height;

            // Scale the range of the data in the domains
            var domains = [];
            for (var n = 0; n < horizontal_numbers; n++) domains.push(n + 1)
            x_block.domain(domains);
            for (var n = 0; n < vertical_numbers; n++) domains.push(n + 1)
            y_block.domain(domains);
            console.log(vertical_numbers);

            color_group.selectAll(".colorBlock")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "colorBlock")
                .attr("x", function (d, i) {
                    // console.log(Math.ceil((i + 1) % horizontal_numbers)); 
                    return x_block(Math.ceil((i + 1) % horizontal_numbers))
                })
                .attr("y", function (d, i) {
                    console.log((i + 1) / horizontal_numbers);
                    return y_block(Math.ceil((i + 1) / horizontal_numbers))
                })
                .attr("fill", function (d) { return d.color })
                .attr("width", block_height * 2 / 3)
                .attr("height", block_height * 2 / 3)
                .attr("stroke-width", "1.5px")
                .attr("stroke", function (d,i) { 
                    if (i == 0){return "red" }
                    else {return "white"}
                })
                .on("click", function (d, i) {
                    d3.selectAll(".colorBlock").attr("stroke", "white");
                    d3.select(this).attr("stroke", "black");
                    selected_id = d.paint_id
                    // plot_img(d.id)
                    plot_treemap(d.artwork_url, d.paint_id, d.artwork_name, d.year)
                })
                .on("mouseover", function (d, i) {
                    // d3.selectAll(".colorBlock").attr("stroke", "white");
                    d3.selectAll(".colorBlock").attr("stroke", function (d,i) { 
                        if (d.paint_id == selected_id){return "red" }
                        else {return "white"}
                    });
                    d3.select(this).attr("stroke", "black");

                    displayTooltip("<b>Artwork: </b>" + d.artwork_name + "<br /><b>Year: </b>" +
                    d.year)
                })
                .on("mousemove", function (d, i) {
                    d3.selectAll(".colorBlock").attr("stroke", function (d,i) { 
                        if (d.paint_id == selected_id){return "red" }
                        else {return "white"}
                    });
                    d3.select(this).attr("stroke", "black");

                    displayTooltip("<b>Artwork: </b>" + d.artwork_name + "<br /><b>Year: </b>" +
                    d.year)
        
                    //d3.select(this).attr("fill", "DarkOrange");
                })
                .on("mouseout", function (d) {
                    d3.selectAll(".colorBlock").attr("stroke", function (d,i) { 
                        if (d.paint_id == selected_id){return "red" }
                        else {return "white"}
                    });
                    hideTooltip();
                    //d3.sele
                })

            //default vis
            plot_treemap(default_artist['artwork_url'], default_artist['paint_id'], default_artist['artwork_name'], default_artist['year'])
        });

}