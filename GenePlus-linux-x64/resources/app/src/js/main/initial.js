const { remote, ipcRenderer } = require('electron');
// var numeric = require('numeric'),
var rf = require("fs");
// _ = require('underscore');
var svg, graph_svg, tooptip;

$(document).ready(function() {
    $("#sub_right_graph_div").hide();
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    $("body").height(wHeight - 30);
    $("body").width(wWidth - 30);
    draw_svg();
    draw_sub_right_graph_div();
    //draw_left_bottom_div();
});



function show_help() {
    ipcRenderer.send('show-help');
}

function close_help() {
    ipcRenderer.send('hide-help');
}


$('#element_select').chosen({
    disable_search_threshold: 10,
    width: "95%"
});


$("#reload").click(function() {
    location.reload();
}).mouseover(function() {
    $(this).attr('title', 'In case you resize the interface or encounter errors');
})

$("#spectrum").mouseover(function() {
    $(this).attr('title', 'Display the graph using muti-layer fast spertral clustering algorithm');
})

$("#k_means").mouseover(function() {
    $(this).attr('title', 'Display the graph using muti-layer k-means algorithm');
})

$("#help").mouseover(function() {
    $(this).attr("title", "Basic instructions of this application")
})
$("#threshold").mouseover(function() {
    $(this).attr("title", "The numbers of nodes to display")
})
$("#minimum").mouseover(function() {
    $(this).attr("title", "The minimum confidence radio to display")
})

$("#graph_return").click(function() {
    $("#sub_right_graph_div").hide();
    $("#right_graph_div").show();
    $('#graph_return').prop('disabled', true).css('opacity', 0.5);
    $('#demo1,#spectrum,#k_means').prop('disabled', false).css('opacity', 1);
})


function quickSort(s, l, r, index) {
    if (l < r) {
        var i = l,
            j = r,
            x = s[l];
        while (i < j) {
            while (i < j && (s[j][index]) < (x[index]))
                j--;
            if (i < j)
                s[i++] = s[j];
            while (i < j && (s[i][index]) >= (x[index]))
                i++;
            if (i < j)
                s[j--] = s[i];
        }
        s[i] = x;
        quickSort(s, l, i - 1, index);
        quickSort(s, i + 1, r, index);
    }
}




function draw_svg() {
    var width = $("#right_graph_div").width();
    var height = $("#right_graph_div").height();
    svg = d3.select("#right_graph_div").append("svg")
        .attr("id", "SVG")
        .attr("width", width)
        .attr("height", height);

}

function draw_sub_right_graph_div() {
    var width = $("#sub_right_graph_div").width();
    var height = $("#sub_right_graph_div").height();
    graph_svg = d3.select("#sub_right_graph_div").append("svg")
        .attr("id", "graph_svg")
        .attr("width", width)
        .attr("height", height);
}

// function draw_left_bottom_div() {
//     var width = $("#left_bottom_div").width();
//     var height = $("#left_bottom_div").height();
//     scrollSVG = d3.select("#left_bottom_div").append("svg")
//         .attr("id", "view_port")
//         .attr("width", width)
//         .attr("height", height);
// }


function error_handler() {
    alert("Sorry, wrong input!!!");
}

function zooming(svg, g) {
    svg.call(d3.zoom()
        .scaleExtent([0.2, Infinity])
        .on("zoom", zoomed));

    function zoomed() {
        g.attr("transform", d3.event.transform);
    }
}