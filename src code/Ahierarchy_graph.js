var sort_groups = 5,
    nodes_number, hierarchy_map = d3.map(),
    k_means_map = d3.map(),
    k_means_map2 = d3.map(),
    element_map,
    arr, overall_group, random_select,
    // group_index = new Array(sort_groups),
    // random_chosen = new Array(sort_groups),
    //curr_random = new Array(sort_groups),
    group, number_of_floor = 0;

function read_hc_file() {
    var hc_path = $("#path").val(),
        hc_data;

    hc_path = "data.txt";
    //hc_path = "574087.protein.links.v10.5.txt";
    hc_path = "demo.txt";
    rf.readFile(hc_path, "utf-8", function(err, hc_data) {
        if (err) error_handler();
        hc_file_handler(hc_data);
    });
}

function hc_file_handler(data) {
    data = data.toString().split("\n");
    var length = data.length,
        i,
        j;
    for (var index = 0; index < length; index++) {
        data[index] = data[index].toString().split(" ");
    }
    var k_means_ele = data[1][0],
        k_means_index = 1;
    k_means_map.set(k_means_ele, k_means_index);
    k_means_map2.set(k_means_index, k_means_ele);
    for (i = 2; i < data.length; i++) {
        if (data[i][0] != k_means_ele) {
            k_means_index++;
            k_means_map.set(data[i][0], k_means_index);
            k_means_map2.set(k_means_index, (data[i][0]));
            k_means_ele = data[i][0];
        }
    }
    console.log(k_means_map);
    nodes_number = Object.keys(k_means_map).length;

    element_map = new Array(nodes_number + 10);
    for (var i = 0; i < element_map.length; i++) {
        element_map[i] = d3.map();
    }
    for (var i = 1; i < data.length; i++) {
        element_map[k_means_map.get(data[i][0])].set(k_means_map.get(data[i][1]), (data[i][2]));
    }
    arr = new Array(nodes_number + 10);
    for (i = 0; i < nodes_number + 10; i++) {
        arr[i] = new Array(nodes_number + 10);
        for (j = 0; j < nodes_number + 10; j++)
            arr[i][j] = 0;
    }
    for (i = 1; i < length; i++) {
        arr[k_means_map.get(data[i][0])][k_means_map.get(data[i][1])] = data[i][2];
    }
    var inital_group = new Array(nodes_number);
    for (i = 0; i < nodes_number; i++) {
        inital_group[i] = i + 1;
    }
    overall_group = new Array(14);
    for (i = 0; i < 100; i++) {
        overall_group[i] = new Array();
    }
    recurring(inital_group);
    overall_group[0] = group;
    var hierarchy_group_index, hierarchy_flag = 1;

    for (index = 0; index < 99; index++) {　
        if (hierarchy_flag == 0) { console.log(index); break; }
        hierarchy_group_index = 0;
        hierarchy_flag = 0;
        for (i = 0; i < overall_group[index].length; i++) {
            if (overall_group[index][i].length <= sort_groups) continue;
            recurring(overall_group[index][i]);
            hierarchy_flag = 1;
            hierarchy_map.set(index + " " + i, hierarchy_group_index);
            for (j = 0; j < sort_groups; j++) {
                overall_group[index + 1][hierarchy_group_index++] = group[j];
            }
        }
    }
    k_means_drawing();
}



function recurring(test_group) {
    var sub_random_chosen = new Array(sort_groups);
    sub_random_chosen[0] = test_group[0];
    for (var i = 1; i < sort_groups; i++) {
        sub_random_chosen[i] = test_group[i * Math.floor(test_group.length / (sort_groups - 1)) - 1];
    }
    sub_random_chosen.sort(function(a, b) { return Math.random() > 0.5 ? -1 : 1; }); //乱序
    //   console.log(sub_random_chosen);
    var flag;
    var recurring_time = 0,
        curr_random = new Array(sort_groups);

    while (true) {
        recurring_time++;
        flag = 0;
        group_locate(test_group, sub_random_chosen);
        for (i = 0; i < sort_groups; i++) {
            curr_random[i] = center_locate(group[i], sub_random_chosen[i], arr);
        }
        for (i = 0; i < sort_groups; i++) {
            if (sub_random_chosen[i] != curr_random[i]) {
                flag = 1;
                sub_random_chosen[i] = curr_random[i];
            }
        }
        if (flag == 0) break;
    }
    for (i = 0; i < sort_groups; i++) {
        group[i].push(sub_random_chosen[i]);
    }
}

function group_inital() {
    group = [];
    group = new Array(sort_groups);
    for (var i = 0; i < sort_groups; i++)
        group[i] = new Array();
}

function group_locate(sub_group, random) {
    group_inital();
    var group_index = new Array(sort_groups),
        flag = 0,
        random_max_index, random_max;
    for (i = 0; i < sort_groups; i++) group_index[i] = 0;
    var element = 0;
    for (i = 0; i < sub_group.length; i++) {
        element = sub_group[i];
        flag = 0;
        for (var j = 0; j < sort_groups; j++) {
            if (element == random[j]) {
                flag = 1;
                break;
            }
        }
        if (flag == 1) continue;
        random_max = arr[random[0]][element];
        random_max_index = 0;
        for (var k = 1; k < sort_groups; k++) {
            if (arr[random[k]][element] > random_max) {
                random_max = arr[random[k]][element];
                random_max_index = k;
            }
        }
        random_select = new Array();
        for (var ii = 0; ii < sort_groups; ii++) {
            if (random_max == arr[random[ii]][element])
                random_select.push(ii);
        }
        random_max_index = random_select[Math.floor(Math.random() * random_select.length)];
        group[random_max_index][group_index[random_max_index]++] = element;
    }
}

function center_locate(group, random, array) {
    group.push(random);
    var current = 0,
        current_node, max = 0,
        current_index, index, node;
    for (i = 0; i < group.length; i++) {
        current_node = group[i];
        current_index = i;
        current = 0;
        for (var j = 0; j < group.length - 1; j++) {
            if (current_node == group[j]) continue;
            current += parseFloat(array[current_node][group[j]]);
        }
        if (current >= max) {
            index = current_index;
            max = current;
            node = current_node;
        }
    }
    group.splice(index, 1);
    return node;
}


//////////////////////////////////////////////---------K means---------//////////////////////////////////////////////////


//////////////////////////////////////////////---------K means_drawing---------/////////////////////////////////////////
var graph_r = 66,
    graph_sub_r = 10,
    k_means_line_class,
    k_means_node_class,
    k_means_sub_node_class,
    k_means_sub_line_class,

    center = new Array(2),
    node_position, graph_node, graph_line,
    sub_node = new Array(sort_groups),
    sub_line = new Array(sort_groups);

function k_means_node() {}
k_means_node.prototype.id = "A";
k_means_node.prototype.size;
k_means_node.prototype.x;
k_means_node.prototype.y;
k_means_node.prototype.fx;
k_means_node.prototype.fy;

function k_means_line() {}
k_means_line.prototype.source = "A";
k_means_line.prototype.target = "B";
k_means_line.prototype.value;
k_means_line.prototype.number;
k_means_line.prototype.x1;
k_means_line.prototype.x2;
k_means_line.prototype.y1;
k_means_line.prototype.y2;

function generate_line_class(class_1, index) {
    var line_index = 0;
    for (i = 0; i < sort_groups - 1; i++) {
        for (var j = i + 1; j < sort_groups; j++) {
            class_1[line_index] = new k_means_line();
            class_1[line_index].source = i;
            class_1[line_index].target = j;
            class_1[line_index].value = 0;
            class_1[line_index].number = 0;


            for (var index_i = 0; index_i < overall_group[number_of_floor][i + index].length; index_i++) {
                for (var index_j = 0; index_j < overall_group[number_of_floor][j + index].length; index_j++) {
                    var tmp_value = (element_map[(overall_group[number_of_floor][i + index][index_i])].get(overall_group[number_of_floor][j + index][index_j]));
                    if (tmp_value == undefined) continue;
                    tmp_value = parseFloat(tmp_value);
                    class_1[line_index].value += tmp_value;
                    class_1[line_index].number++;
                }
            }
            line_index++;
        }
    }
}

function k_means_drawing() {
    console.log(hierarchy_map);
    console.log(overall_group);

    draw_svg();

    k_means_line_class = new Array();
    k_means_node_class = new Array();
    for (var i = 0; i < sort_groups; i++) {
        k_means_node_class[i] = new k_means_node();
        k_means_node_class[i].id = i;
    }

    var k_means_line_index = 0;
    generate_line_class(k_means_line_class, 0);
    console.log(k_means_line_class)
    k_means_line_class = new Array();

    number_of_floor++;

    center = [width / 2, height / 2];
    k_means_force_layout(k_means_node_class, k_means_line_class, center, graph_r);

    //  setTimeout(duration, 1000);

    function duration() {
        node_position = [];
        node_position = new Array(sort_groups);
        for (var i = 0; i < sort_groups; i++) {
            node_position[i] = new Array(2);
        }
        for (var i = 0; i < sort_groups; i++) {
            node_position[i][0] = k_means_node_class[i].x;
            node_position[i][1] = k_means_node_class[i].y;
        }

        rearrange_position(node_position, 0, graph_r, 0);
        // for (var i = 0; i < sort_groups; i++) {
        //     k_means_node_class[i].x = node_position[i][0];
        //     k_means_node_class[i].y = node_position[i][1];
        // }

        for (var i = 0; i < sort_groups; i++) {
            graph_node_class[i].x = node_position[i][0];
            graph_node_class[i].y = node_position[i][1];
            graph_node_class[i].id = i;
        }
        // k_means_line_index = 0;
        // for (i = 0; i < sort_groups - 1; i++) {
        //     for (var j = i + 1; j < sort_groups; j++) {
        //         graph_line_class[k_means_line_index].x1 = graph_node_class[graph_line_class[]].x
        //     }
        // }

        center_located_foce_layout(node_position);
    }

}

function rearrange_position(classA, centerA, radius, overall_size) {
    var center = new Array(2),
        over_size = new Array(2);
    if (centerA == 0) {
        center[0] = width / 2;
        center[1] = height / 2;
    } else center = centerA;
    if (overall_size == 0) {
        over_size = height / 2;
    } else over_size = overall_size;
    var max = 0;
    for (var i = 0; i < sort_groups; i++) {
        var tmp = (classA[i][0] - center[0]) * (classA[i][0] - center[0]) + (classA[i][1] - center[1]) * (classA[i][1] - center[1]);
        if (max < tmp) max = tmp;
    }
    max = Math.sqrt(max);
    var valiance = (over_size - radius / 2) / (max);
    console.log(valiance);
    var tmp_x, tmp_y, tx, ty;
    for (i = 0; i < sort_groups; i++) {
        tmp_x = classA[i][0] - center[0];
        tmp_y = classA[i][1] - center[1];
        tx = tmp_x;
        ty = tmp_y;
        tmp_x = tx * valiance * Math.abs(tx) / (Math.sqrt((tx * tx + ty * ty)));
        tmp_y = ty * valiance * Math.abs(ty) / (Math.sqrt((tx * tx + ty * ty)));
        classA[i][0] = tmp_x + center[0];
        classA[i][1] = tmp_y + center[1];
    }
}

function center_located_foce_layout(center) {
    k_means_sub_node_class = [];
    k_means_sub_line_class = [];

    graph_sub_node_class = new Array(sort_groups);
    graph_sub_line_class = new Array(sort_groups);
    k_means_sub_node_class = new Array(sort_groups);
    k_means_sub_line_class = new Array(sort_groups);

    for (var i = 0; i < sort_groups; i++) {
        k_means_sub_node_class[i] = new Array(sort_groups);
        k_means_sub_line_class[i] = new Array();
        graph_sub_node_class[i] = new Array(sort_groups);
        graph_sub_line_class[i] = new Array();
    }

    for (var k = 0; k < sort_groups; k++) {
        for (i = 0; i < sort_groups; i++) {
            k_means_sub_node_class[k][i] = new k_means_node();
            k_means_sub_node_class[k][i].id = i;
            k_means_sub_node_class[k][i].size = overall_group[0][i].length;

            graph_sub_node_class[k][i] = new k_means_node();
        }
    }
    for (var i = 0; i < sort_groups; i++) {
        generate_line_class(k_means_sub_line_class[i], graph_sub_line_class[i], 5 * i);
    }
    console.log(graph_sub_line_class);
    console.log(k_means_sub_line_class); {
        // var k_means_sub_line_index = 0;
        // for (var k = 0; k < sort_groups; k++) {
        //     k_means_sub_line_index = 0;
        //     for (i = 0; i < sort_groups - 1; i++) {
        //         for (var j = i + 1; j < sort_groups; j++) {
        //             k_means_sub_line_class[k][k_means_sub_line_index] = new k_means_line();
        //             k_means_sub_line_class[k][k_means_sub_line_index].source = i;
        //             k_means_sub_line_class[k][k_means_sub_line_index].target = j;
        //             k_means_sub_line_class[k][k_means_sub_line_index].value = 500;
        //             k_means_sub_line_index++;
        //         }
        //     }
        // }
    }

    for (var i = 0; i < sort_groups; i++) {
        k_means_force_layout(k_means_sub_node_class[i], k_means_sub_line_class[i], center[i], 10, 5);
    }
    //  setTimeout(durationA, 1000);
    console.log(k_means_sub_line_class)

    function durationA() {
        node_position = [];
        node_position = new Array(sort_groups);
        for (var i = 0; i < sort_groups; i++) {
            node_position[i] = new Array(sort_groups);
            for (var j = 0; j < sort_groups; j++) {
                node_position[i][j] = new Array(2);
            }
        }
        for (var j = 0; j < sort_groups; j++) {
            for (var i = 0; i < sort_groups; i++) {
                node_position[j][i][0] = k_means_sub_node_class[j][i].x;
                node_position[j][i][1] = k_means_sub_node_class[j][i].y;
            }
        }
        console.log(node_position);
        for (var i = 0; i < sort_groups; i++) {
            rearrange_position(node_position[i], center[i], graph_sub_r, graph_r);
        }
        for (var j = 0; j < sort_groups; j++) {
            for (var i = 0; i < sort_groups; i++) {
                graph_sub_node_class[j][i].x = node_position[j][i][0];
                graph_sub_node_class[j][i].y = node_position[j][i][1];
                graph_sub_node_class[j][i].fx = node_position[j][i][0] - graph_node_class[j].x;
                graph_sub_node_class[j][i].fy = node_position[j][i][1] - graph_node_class[j].y;
            }
        }
        console.log(node_position)
        for (var i = 0; i < sort_groups; i++) {
            sub_node[i] = svg.append("g")
                .selectAll("circle")
                .data(graph_sub_node_class[i])
                .enter().append("circle")
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                })
                .attr("r", graph_sub_r)
                .attr("opacity", 0.1)
                .style("fill", function(d) { return "green"; })
        }

        for (var index = 0; index < sort_groups; index++) {
            sub_line[index] = svg.append("g")
                .selectAll("line")
                .data(graph_sub_line_class[index])
                .enter().append("line")
                .attr("class", "links")
                .attr("stroke", "black")
                .attr("opacity", 0.3)
                .on("mouseover", function(d) {
                    tooptip.html("size:" + d.size)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("background-color", "Ivory")
                        .style("opacity", 1.0);
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                    tooptip.style("opacity", 0.0);
                })
                .attr("stroke-width", function(d) {
                    return 5;
                })
                .attr("x1", function(d, i) {
                    d.x1 = graph_sub_node_class[index][d.source].x;
                    return d.x1;
                })
                .attr("y1", function(d, i) {
                    d.y1 = graph_sub_node_class[index][d.source].y;
                    return d.y1;
                })
                .attr("x2", function(d, i) {
                    d.x2 = graph_sub_node_class[index][d.target].x;
                    return d.x2;
                })
                .attr("y2", function(d, i) {
                    d.y2 = graph_sub_node_class[index][d.target].y;
                    return d.y2;
                })
        }
        console.log(sub_line)


        graph_node = svg.append("g")
            .selectAll("circle")
            .data(graph_node_class)
            .enter().append("circle")
            .attr("r", function(d) {
                return graph_r;
            })
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .attr("opacity", 0)
            .style("fill", function(d) { return "blue"; })
            .on("mouseover", function(d) {
                tooptip.html("size:" + d.size)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("background-color", "Ivory")
                    .style("opacity", 1.0);
            })
            .on("mouseout", function() {
                d3.select(this)
                tooptip.style("opacity", 0.0);
            })
            .on("dblclick", graph_zoom)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        graph_line = svg.append("g")
            .selectAll("line")
            .data(graph_line_class)
            .enter().append("line")
            .attr("class", "links")
            .attr("stroke", "black")
            .attr("opacity", 0.1)
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("stroke", "yellow");
                tooptip.html("number:" + d.number + "  " + "value:" + d.value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("background-color", "Ivory")
                    .style("opacity", 0);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("stroke", "grey");
                tooptip.style("opacity", 0.0);
            })
            .attr("stroke-width", function(d) {
                return 5;
            })
            .attr("x1", function(d, i) {
                d.x1 = graph_node_class[d.source].x;
                return d.x1;
            })
            .attr("y1", function(d, i) {
                d.y1 = graph_node_class[d.source].y;
                return d.y1;
            })
            .attr("x2", function(d, i) {
                d.x2 = graph_node_class[d.target].x;
                return d.x2;
            })
            .attr("y2", function(d, i) {
                d.y2 = graph_node_class[d.target].y;
                return d.y2;
            })

        function graph_zoom(d) {
            var prev_x = d.x,
                prev_y = d.y;
            graph_node
                .transition()
                .duration(2000)
                .attr("r", 0);
            d3.select(this)
                .transition()
                .duration(2000)
                .attr("opacity", 0)
                .attr("r", 600);
            for (var i = 0; i < sort_groups; i++) {
                sub_node[i]
                    .transition()
                    .duration(2000)
                    .attr("r", 0);
            }
            node_position = [];
            node_position = new Array(sort_groups);
            for (var i = 0; i < sort_groups; i++) {
                node_position[i] = new Array(2);
            }
            for (var i = 0; i < sort_groups; i++) {
                node_position[i][0] = graph_sub_node_class[d.id][i].x + width / 2 - prev_x;
                node_position[i][1] = graph_sub_node_class[d.id][i].y + height / 2 - prev_y;
            }

            rearrange_position(node_position, 0, graph_r, 0);

            sub_node[d.id]
                .transition()
                .duration(2000)
                .attr("cx", function(d, i) {
                    d.x = node_position[i][0];
                    return d.x;
                })
                .attr("cy", function(d, i) {
                    d.y = node_position[i][1];
                    return d.y;
                })
                .attr("r", graph_r);

            graph_line
                .transition()
                .duration(2000)
                .attr("opacity", 0);


        }
        var tmpx, tmpy;

        function dragstarted(d) {
            d3.select(this).raise().classed("active", true);
            sub_node[d.id]
                .style("fill", function(d) { return "black"; })
        }

        function dragged(d) {
            d3.select(this)
                .attr("cx", function(d) {
                    tmpx = d3.event.x;
                    d.x = d3.event.x;
                    return d.x;
                })
                .attr("cy", function(d) {
                    tmpy = d3.event.y;
                    d.y = d3.event.y;
                    return d.y;
                });

            sub_node[d.id]
                .attr("cx", function(d) {
                    d.x = tmpx + d.fx;
                    return d.x;
                })
                .attr("cy", function(d) {
                    d.y = tmpy + d.fy;
                    return d.y;
                })

            graph_line
                .attr("x1", function(d, i) {
                    d.x1 = graph_node_class[d.source].x;
                    return d.x1;
                })
                .attr("y1", function(d, i) {
                    d.y1 = graph_node_class[d.source].y;
                    return d.y1;
                })
                .attr("x2", function(d, i) {
                    d.x2 = graph_node_class[d.target].x;
                    return d.x2;
                })
                .attr("y2", function(d, i) {
                    d.y2 = graph_node_class[d.target].y;
                    return d.y2;
                })

        }

        function dragended(d) {
            d3.select(this).classed("active", false);
            sub_node[d.id]
                .style("fill", function(d) { return "green"; })
        }
    }

}

function k_means_force_layout(node_class, line_class, center, r) {
    var color = d3.scaleOrdinal(d3.schemeCategory20),
        // g = svg.append("g"),
        radius;
    var times = 100;
    if (arguments.length == 3) radius = 3;
    else radius = 3;

    //  var g = svg.append("g").attr("transform", "translate(" + center[0] / 2 + "," + center[1] + ")");

    var simulation = d3.forceSimulation(node_class)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(line_class))
        .force("center", d3.forceCenter(center[0], center[1]))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .stop();

    var loading = svg.append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .text("Simulating. One moment please…");


    d3.timeout(function() {
        loading.remove();
        for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
            simulation.tick();
        }



        svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(node_class)
            .enter().append("circle")
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .attr("r", 10);

        svg.append("g")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .selectAll("line")
            .attr("opacity", 0.3)
            .data(line_class)
            .enter().append("line")
            .attr("x1", function(d) {
                console.log(d.source.x);
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });
    });
}