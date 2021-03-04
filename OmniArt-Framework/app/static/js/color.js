function removeOldChart() {
    d3.select("#year_group")
        .remove();
    d3.select("#color_group")
        .remove();
}

function removeOldBlocks() {
    d3.select("#color_group")
        .remove();
}

function plot_year(artist_name,start,end,fullname) {
    var fetch_url = "/year_data?artist_name=" + artist_name;
    fetch(fetch_url)
        .then(function (response) { return response.json(); })
        .then((data) => {
            removeOldChart()
            var y = document.getElementById("artist_year_name");
            y.innerHTML = fullname + " " + start + "-" + end;

            // Scale the range of the data in the domains
            x_year.domain(data.map(function (d) { return d.year; }));
            y_year.domain([0, d3.max(data, function (d) { return d.count; })]);

            // add react group
            var year_group = yearSvg.append("g")
                .attr("id", "year_group")
                .attr("width", year_svg_width)
                .attr("height", year_bar_height)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

            var year_chart = year_group.append("g")
                .attr("id", "year_chart")
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

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
                .attr("rx", 10)
                .attr("ry", 15)
                .on("click", function (d, i) {
                    var artist_name = d.artist, year = d.year;
                    plot_blocks(artist_name, year)
                })


            // add the X Axis
            year_group.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0," + year_bar_height + ")")
                .call(d3.axisBottom(x_year))
                .call(g => g.select(".domain").attr('stroke-width', 0))
                .selectAll("text")
                .attr("transform", "rotate(80)");
            // remove());

            // // add the Y Axis
            // artistSvg.append("g")
            //     .attr("class", "yAxis")
            //     .attr("transform", "translate(" + 50 + ",20)")
            //     .call(d3.axisLeft(y))
            //     .call(g => g.select(".domain").attr('stroke-width', 0));
        });
}

function plot_blocks(artist_name, year) {
    var fetch_url = "/color_data?artist_name=" + artist_name + "&year=" + year;
    fetch(fetch_url)
        .then(function (response) { return response.json(); })
        .then((data) => {
            removeOldBlocks()
            dominant_colors = []
            data.forEach(function (d) {
                dominant_colors.push(d.color)
            });
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
                    return x_block(Math.ceil((i + 1) % horizontal_numbers)) })
                .attr("y", function (d, i) { 
                    console.log((i + 1) / horizontal_numbers); 
                return y_block(Math.ceil((i + 1) / horizontal_numbers)) })
                .attr("fill", function (d) { return d.color })
                .attr("width", block_height * 2 / 3)
                .attr("height", block_height * 2 / 3)
                .on("click", function (d, i) {
                    // plot_img(d.id)
                    plot_treemap(d.artwork_url, d.paint_id, d.artwork_name, d.year)
                })

        });

}