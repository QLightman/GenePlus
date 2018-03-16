const { remote, ipcRenderer } = require('electron');
var graph_svg;

$(document).ready(function() {
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    $("#graph_top_div").height(0.1 * wHeight - 10);
    $("#graph_bottom_div").height(0.88 * wHeight - 10);
    $("#graph_top_div").width(wWidth - 25);
    $("#graph_bottom_div").width(wWidth - 25);
    draw_svg($("#graph_bottom_div").width(), $("#graph_bottom_div").height());

});

function close_graph() {
    ipcRenderer.send('hide-graph');
}

function draw_svg(width, height) {
    graph_svg = d3.select("#graph_bottom_div").append("svg")
        .attr("width", width)
        .attr("height", height);
}