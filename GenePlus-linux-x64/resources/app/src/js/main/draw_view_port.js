function draw_view_port(states, number) {
    $("#left_bottom_div").empty();
    var colorScale = d3v3.scale.category20();
    var scrollSVG = d3v3.select("#left_bottom_div").append("svg");
    var chartGroup = scrollSVG.append("g");

    chartGroup.append("rect")
        .attr("fill", "#FFFFFF");
    var rowEnter = function(rowSelection) {
        rowSelection.append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("width", function() {
                return $("#left_bottom_div").width() * 1.6;
            })
            .attr("height", "24")
            .attr("fill-opacity", 0.25)
            .attr("stroke", "#999999")
            .attr("stroke-width", "2px");
        rowSelection.append("text")
            .attr("transform", "translate(10,15)");
    };
    var rowUpdate = function(rowSelection) {
        rowSelection.select("rect")
            .attr("fill", function(d) {
                return colorScale(d.id);
            });
        rowSelection.select("text")
            .text(function(d) {
                return (d.id);
            });
    };

    var rowExit = function(rowSelection) {};

    var virtualScroller = d3v3.VirtualScroller()
        .rowHeight(30)
        .enter(rowEnter)
        .update(rowUpdate)
        .exit(rowExit)
        .svg(scrollSVG)
        .totalRows(number)
        .viewport(d3v3.select("#left_bottom_div"));

    states.forEach(function(nextState, i) {
        nextState.index = i;
    });

    virtualScroller.data(states, function(d) {
        return d.id;
    });

    chartGroup.call(virtualScroller);
}