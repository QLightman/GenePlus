function draw_sub_graph(data, key, locate_map, k_means_map, k_means_map2, nodes_number, min_con) {
    console.log(arguments);
    $("#graph_svg").remove();
    draw_sub_right_graph_div();
    var start_string = k_means_map2.get(key);
    console.log(start_string)
    var start_position = locate_map.get(start_string),
        sub_line_class = new Array(),
        sub_node_class = new Array(),
        width = $("#sub_right_graph_div").width(),
        height = $("#sub_right_graph_div").height(),
        center = [width / 2, height / 2],
        line_color = "steelblue",
        transform = d3.zoomIdentity;

    var tooptip = d3.select("body")
        .append("div")
        .attr("class", "tooptip")
        .style("opacity", 0.0);

    function sub_node() {}
    sub_node.prototype.id = "A";

    function sub_line() {}
    sub_line.prototype.source = "A";
    sub_line.prototype.target = "B";
    sub_line.prototype.value;
    sub_line.prototype.width;

    var nodes_group = [];

    while (true) {
        if (data[start_position][0] != start_string) break;
        else {
            nodes_group.push(data[start_position][1] + " " + (data[start_position][2]));
        }
        start_position++;
    }
    for (var i in nodes_group) {
        nodes_group[i] = nodes_group[i].toString().split(" ");
        nodes_group[i][1] = parseFloat(nodes_group[i][1]);
    }
    quickSort(nodes_group, 0, nodes_group.length - 1, 1);

    console.log(nodes_group)
    input_operator();


    sub_node_class[0] = new sub_node();
    sub_node_class[0].id = start_string;
    for (var i = 1; i < nodes_number; i++) {
        sub_node_class[i] = new sub_node();
        sub_node_class[i].id = nodes_group[i - 1][0];
    }
    for (var i = 0; i < nodes_number - 1; i++) {
        sub_line_class[i] = new sub_line();
        sub_line_class[i].source = start_string;
        sub_line_class[i].target = nodes_group[i][0];
        sub_line_class[i].value = nodes_group[i][1];
        sub_line_class[i].id = i;
    }
    var tmp_node_group = [],
        start_locate = 0;
    for (var i = 0; i < nodes_number - 1; i++) {
        tmp_node_group[i] = nodes_group[i][0];
    }
    console.log(tmp_node_group);
    for (var i = 0; i < nodes_number - 1; i++) {
        if (tmp_node_group.length == 1) break;
        start_locate = locate_map.get(tmp_node_group[0]);
        while (true) {
            if (data[start_locate][0] != tmp_node_group[0]) break;
            if (_.contains(tmp_node_group, data[start_locate][1])) {
                var tmp = new sub_line();
                tmp.source = tmp_node_group[0];
                tmp.target = data[start_locate][1];
                tmp.value = parseFloat(data[start_locate][2]);
                sub_line_class.push(tmp);
            }
            start_locate++;
        }
        tmp_node_group.splice(0, 1);
    }

    var max = d3.max(sub_line_class, function(d) {
            return d.value;
        }),
        min = d3.min(sub_line_class, function(d) {
            return d.value;
        });
    if (max == min) {
        for (var i = 0; i < sub_line_class.length; i++) {
            sub_line_class[i].width = 3;
        }
    } else {
        for (var i = 0; i < sub_line_class.length; i++) {
            if (sub_line_class[i].value == 0) sub_line_class[i].width = 0;
            else
                sub_line_class[i].width = ((sub_line_class[i].value - min) / (max - min)) * 5 + 2;
        }
    }
    console.log(sub_line_class);
    console.log(sub_node_class);
    force_layout(sub_node_class, sub_line_class);

    function force_layout(node_class, line_class) {
        const forceX = d3.forceX(width / 2).strength(15);
        const forceY = d3.forceY(height / 2).strength(15);
        var color = d3.scaleOrdinal(d3.schemeCategory20),
            radius = 18,
            g = graph_svg.append("g");

        var line_display_base = (max - min) * min_con + min;
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force('x', forceX)
            .force('y', forceY)

        var link = g
            .attr("class", "links")
            .attr("stroke", line_color)
            .selectAll("line")
            .data(line_class)
            .enter().append("line")
            .attr("opacity", function(d) {
                if (d.value <= line_display_base) return 0;
                return 0.5 / 1000 * d.value + 0.5;
            })
            .attr("stroke-width", function(d) {
                return d.width;
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("stroke", "yellow");
                tooptip.html("value:" + d.value + "<br>" + d.source.id + "<-->" + d.target.id)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("stroke", line_color);
                tooptip.style("opacity", 0.0);
            });

        var node = g
            .selectAll("circle")
            .data(node_class)
            .enter().append("circle")
            .attr("r", radius)
            .attr("fill", function(d) { return color(_.random(1, 18)); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        var text = g.selectAll("text")
            .data(node_class)
            .enter()
            .append("text")
            .text(function(d) {
                return d.id;
            });　

        simulation
            .nodes(node_class)
            .on("tick", ticked);

        simulation.force("link")
            .links(line_class)

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })

            node
                .attr("cx", function(d) { d.fx = d.x; return d.x; })
                .attr("cy", function(d) { d.fy = d.y; return d.y; });
            text
                .attr("x", function(d) {
                    return d.x + radius;
                })　　　　
                .attr("y", function(d) {
                    return d.y - radius;
                });　　

        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
        }
        zooming(graph_svg, g);
    }



    function input_operator() {
        //if (typeof(nodes_number) != "number" || typeof(min_con) != "number") error_handler();
        if (nodes_number <= 3) {
            $("#number").val(3);
            nodes_number = 3;
        }
        var max_nodes_number = nodes_group.length + 1;
        if (nodes_number > max_nodes_number) {
            nodes_number = max_nodes_number;
            $("#number").val(max_nodes_number);
        }
        if (min_con <= 0) {
            min_con = 0;
            $("#confidence").val(0);
        }
        if (min_con >= 1) {
            min_con = 1;
            $("#confidence").val(1);
        }
    }
}