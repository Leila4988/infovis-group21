// d3.csv("../data/pallete.csv", function(d) {
//   return {
//     art : d.art,
//     color_palette : +d.color_palette,
//     palette_count : +d.palette_count,
//   };
// }).then(function(data){
//   console.log(data[0]);
// });

// function treemap(){
//       // stratify the data: reformatting for d3.js
//     var root = d3.stratify()
//     .id(function(d) { return d.color_palette; })
//     .parentId(function(d) { return d.art; })
//     (data);
//     root.sum(function(d) { return +d.palette_count })

//   // Then d3.treemap computes the position of each element of the hierarchy
//   // The coordinates are added to the root object above
//     d3.treemap()
//     .size([width, height])
//     .padding(4)
//     (root)

//     console.log(root.leaves())

// }

function removeOldTreemap() {
  d3.select("#treemap_group")
    .remove();
}

function plot_treemap(url, artwork_id, artwork_name, year) {
  var y = document.getElementById("artwork_name");
  y.innerHTML = artwork_name + " " + year;
  var fetch_url = "/artwork_data?id=" + artwork_id;
  fetch(fetch_url)
    .then(function (response) { return response.json(); })
    .then((data) => {
      loadImage(url)
      // loadImage("https://uploads2.wikiart.org/images/frederic-bazille/woman-in-moorish-costume.jpg")
      removeOldTreemap()
      var index = 0
      tree_colors = []
      data.forEach(function (d) {
        if (index == 0) {
          index++;
        }
        else {
          tree_colors.push(d.color)
          index++;
        }
      });
      // stratify the data: reformatting for d3.js
      var root = d3.stratify()
        .id(function (d) { return d.name; })   // Name of the entity (column name is name in csv)
        .parentId(function (d) { return d.parent; })   // Name of the parent (column name is parent in csv)
        (data);
      root.sum(function (d) { return +d.value })

      d3.treemap()
        .size([treemap_width, treemap_height])
        .padding(4)
        (root)

      console.log(root.leaves())

      var treemap_group = treemapSvg.append("g")
        .attr("id", "treemap_group")
        .attr("width", treemap_width)
        .attr("height", treemap_height)
        .attr("transform", "translate(" + 0 + "," + (0 + 0) + ")");

      // use this information to add rectangles:
      treemap_group
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1; })
        .attr('height', function (d) { return d.y1; })
        .style("fill", function (d, i) { return tree_colors[i] });

      // // and to add the text labels
      // treemap_group
      //   .selectAll("text")
      //   .data(root.leaves())
      //   .enter()
      //   .append("text")
      //   .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
      //   .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
      //   .text(function (d) { return d.data.name })
      //   .attr("font-size", "15px")
      //   .attr("fill", "white")

    });

    
}


