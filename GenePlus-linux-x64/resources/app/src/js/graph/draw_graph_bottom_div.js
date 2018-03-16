function draw_graph_bottom_div() {
    var index = $("#element_select").val();
    console.log(index);
    graph_svg.append("g").append("rect")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", index)
        .attr("y", index)
        .attr("stroke", "red")
        .attr("opacity", 0.3)
        .attr("stroke-width", 1);
}