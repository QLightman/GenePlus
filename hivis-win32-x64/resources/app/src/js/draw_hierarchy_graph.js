function draw_hierarchy_graph(overall_group, sort_groups, element_map, hierarchy_map, k_means_map2) {
    //  console.log(arguments);
    var i, j,
        graph_r = 0,
        graph_sub_r = 0,
        k_means_line_class = 0,
        k_means_node_class = 0,
        k_means_sub_node_class = 0,
        k_means_sub_line_class = 0,
        line_color = "steelblue",
        text_color = "black",
        node_opacity = 0.2,
        sub_node_opacity = 0.2,
        line_opacity = 0.4,
        text_opacity = 0.5,
        sub_line_opactiy = 0.2,
        center = new Array(2),
        graph_node = 0,
        graph_line = 0,
        text = 0,
        number_of_floor = 0,
        start_number = new Array(sort_groups),
        configure_history = new Array(),
        sub_node = new Array(sort_groups),
        sub_line = new Array(sort_groups),
        // sub_text = new Array(sort_groups),
        width = $("#right_graph_div").width(),
        height = $("#right_graph_div").height();
    var tooptip = d3.select("body")
        .append("div")
        .attr("class", "tooptip")
        .style("opacity", 0.0);
    graph_r = height / 9;
    graph_sub_r = graph_r / 15 > 1 ? graph_r / 15 : 1;

    configure_history[0] = 0;
    if (number_of_floor <= 1)
        $('#back').prop('disabled', true).css('opacity', 0.5);
    k_means_drawing();

    function k_means_node() {}
    k_means_node.prototype.id = "A";
    k_means_node.prototype.size;
    k_means_node.prototype.radius;
    k_means_node.prototype.x;
    k_means_node.prototype.y;
    k_means_node.prototype.fx;
    k_means_node.prototype.fy;

    function k_means_line() {}
    k_means_line.prototype.source = "A";
    k_means_line.prototype.target = "B";
    k_means_line.prototype.value;
    k_means_line.prototype.width;
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

    function generate_node_radius(node_class, amount) {
        var max = d3.max(node_class, function(d) {
                return d.size;
            }),
            min = d3.min(node_class, function(d) {
                return d.size;
            });
        if (max == min) {
            for (var i = 0; i < node_class.length; i++) {
                node_class[i].radius = amount;
            }
        } else {
            for (var i = 0; i < node_class.length; i++) {
                node_class[i].radius = (node_class[i].size - min) / (max - min) * amount + amount;
            }
        }
    }

    function k_means_drawing() {
        // console.log(configure_history);
        //var start_point = hierarchy_map.get(number_of_floor + " " + parseInt(chosen_sort));
        // console.log(overall_group);
        // console.log(hierarchy_map);
        k_means_line_class = new Array();
        k_means_node_class = new Array();

        // if (start_point == undefined) alert("warning");
        for (var i = 0; i < sort_groups; i++) {
            k_means_node_class[i] = new k_means_node();
            k_means_node_class[i].id = i;
            k_means_node_class[i].size = overall_group[number_of_floor][i + configure_history[number_of_floor]].length;
            // console.log(k_means_node_class[i].size);
        }

        generate_node_radius(k_means_node_class, graph_r / 2);
        generate_line_class(k_means_line_class, 0);

        for (var i = 0; i < sort_groups; i++) {
            var tmp = number_of_floor + " " + parseInt(configure_history[number_of_floor] + i);
            start_number[i] = hierarchy_map.get(tmp);
        }
        // console.log(start_number);
        center = [width / 2, height / 2];
        k_means_force_layout(k_means_node_class, k_means_line_class, center, -1);
        setTimeout(generate_sub_graph, 0);
    }

    function generate_sub_graph() {
        k_means_sub_node_class = new Array(sort_groups);
        k_means_sub_line_class = new Array(sort_groups);
        number_of_floor++;
        if (number_of_floor > 1)
            $('#back').prop('disabled', false).css('opacity', 1);


        for (var i = 0; i < sort_groups; i++) {
            if (start_number[i] == undefined) continue;
            k_means_sub_node_class[i] = new Array(sort_groups);
            k_means_sub_line_class[i] = new Array();
            for (var j = 0; j < sort_groups; j++) {
                k_means_sub_node_class[i][j] = new k_means_node();
                k_means_sub_node_class[i][j].id = j;
                k_means_sub_node_class[i][j].size = overall_group[number_of_floor][start_number[i] + j].length;
            }
        }
        for (var i = 0; i < sort_groups; i++) {
            if (start_number[i] == undefined) continue;
            generate_node_radius(k_means_sub_node_class[i], 10);
        }
        for (var i = 0; i < sort_groups; i++) {
            if (start_number[i] == undefined) continue;
            generate_line_class(k_means_sub_line_class[i], start_number[i]);
        }

        for (var i = 0; i < sort_groups; i++) {
            if (start_number[i] == undefined) continue;
            center[0] = k_means_node_class[i].x;
            center[1] = k_means_node_class[i].y;
            center[2] = k_means_node_class[i].radius;
            k_means_force_layout(k_means_sub_node_class[i], k_means_sub_line_class[i], center, i);
        }

    }



    function k_means_force_layout(node_class, line_class, center, flag) {

        var max = d3.max(line_class, function(d) {
                return d.value;
            }),
            min = d3.min(line_class, function(d) {
                return d.value;
            }),
            dis = (flag < 0) ? 600 : center[2];
        if (max == min) {
            if (max == 0)
                for (var i = 0; i < line_class.length; i++) {
                    line_class[i].width = 0;
                } else
                    for (var i = 0; i < line_class.length; i++) {
                        line_class[i].width = 3;
                    }

        } else {
            for (var i = 0; i < line_class.length; i++) {
                if (line_class[i].value == 0) line_class[i].width = 0;
                else
                    line_class[i].width = ((line_class[i].value - min) / (max - min)) * 5 + 2;
            }
        }

        var times;
        var simulation = d3.forceSimulation(node_class)
            .force("center", d3.forceCenter(center[0], center[1]))
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink(line_class).distance(function(d) {
                if (max == min) return dis;
                else return dis / 2 - (d.value - min) / (max - min) * (dis / 2) + dis / 2;
            }))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .stop();
        // .force("link", d3.forceLink(line_class).distance(50).strength(function(d) {
        //     if (max == min) return 4;
        //     else {
        //         return ((d.value - min) / (max - min)) * 5.8 + 0.2;
        //     }
        // }))

        d3.timeout(function() {
            // loading.remove();
            for (var i = 0, times = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < times; ++i) {
                simulation.tick();
            }
            if (flag < 0) {
                graph_node = svg.append("g")
                    .attr("opacity", node_opacity)
                    .selectAll("circle")
                    .data(node_class)
                    .enter().append("circle")
                    .attr("cx", function(d) {
                        return d.x;
                    })
                    .attr("cy", function(d) {
                        return d.y;
                    })
                    .attr("r", function(d, i) {
                        return 0;
                    })
                    .style("fill", function(d) { return line_color; })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended))
                    .on("mouseover", show_another_graph)
                    .on("dblclick", graph_zoom_test);

                text = svg.append("g")
                    .selectAll("text")
                    .data(node_class)
                    .enter().append("text")
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y", function(d) {
                        return d.y + d.radius;
                    })
                    .attr("opacity", 0)
                    .text(function(d) {
                        return "size " + d.size;
                    })

                graph_line = svg.append("g")
                    .attr("opacity", line_opacity)
                    .attr("stroke", line_color)
                    .selectAll("line")
                    .data(line_class)
                    .enter().append("line")
                    .attr("stroke-width", function(d) {
                        return 0;
                    })
                    .attr("x1", function(d) {
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
                    })
                    .on("mouseover", function(d) {
                        d3.select(this)
                            .attr("stroke", "yellow");
                        tooptip.html("number:" + d.number + "  " + "value:" + d.value)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY + 20) + "px")
                            .style("opacity", 1);
                    })
                    .on("mouseout", function() {
                        d3.select(this)
                            .attr("stroke", line_color);
                        tooptip.style("opacity", 0.0);
                    })


                graph_node
                    .transition()
                    .duration(2000)
                    .attr("r", function(d, i) {
                        return d.radius;
                    })
                text
                    .transition()
                    .duration(2000)
                    .attr("stroke", text_color)
                    .attr("opacity", text_opacity)

                graph_line
                    .transition()
                    .duration(2000)
                    .attr("stroke-width", function(d) {
                        return d.width;
                    })

            } else {
                sub_node[flag] = svg.append("g")
                    .attr("opacity", sub_node_opacity)
                    .style("fill", function(d) { return "steelblue"; })
                    .selectAll("circle")
                    .data(node_class)
                    .enter().append("circle")
                    .attr("cx", function(d, i) {
                        d.fx = d.x - k_means_node_class[flag].x;
                        return d.x;
                    })
                    .attr("cy", function(d, i) {
                        d.fy = d.y - k_means_node_class[flag].y;
                        return d.y;
                    })
                    .attr("r", function(d) {
                        return 0;
                    })
                    .on("mouseover", function(d) {
                        tooptip.html("size:" + d.size)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY + 20) + "px")
                            .style("opacity", 1.0);
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                        tooptip.style("opacity", 0.0);
                    })


                sub_line[flag] = svg.append("g")
                    .attr("opacity", sub_line_opactiy)
                    .attr("stroke", line_color)
                    .selectAll("line")
                    .data(line_class)
                    .enter().append("line")
                    .attr("stroke-width", function(d) {
                        return 0;
                    })
                    .on("mouseover", function(d) {
                        tooptip.html("size:" + d.size)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY + 20) + "px")
                            .style("opacity", 1.0);
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                        tooptip.style("opacity", 0.0);
                    })
                    .attr("x1", function(d) {
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

                // sub_text[flag] = svg.append("g")
                //     .selectAll("text")
                //     .data(node_class)
                //     .enter().append("text")
                //     .attr("x", function(d) {
                //         return d.x;
                //     })
                //     .attr("y", function(d) {
                //         return d.y - d.radius;
                //     })
                //     .text(function(d) {
                //         return "size " + d.size;
                //     })
                //     .attr("opacity", 0)


                sub_node[flag]
                    .transition()
                    .duration(2000)
                    .attr("r", function(d, i) {
                        return d.radius;
                    })
                    // sub_text[flag]
                    //     .transition()
                    //     .duration(2000)
                    //     .attr("opacity", 0.2)

                sub_line[flag]
                    .transition()
                    .duration(2000)
                    .attr("stroke-width", function(d) {
                        return d.width;
                    })
            }
        });


    }



    function dragstarted(d) {
        d3.select(this).raise().classed("active", true);
    }

    function dragged(d) {
        var tmpx, tmpy, tmp;
        tmp = d.id;
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
        if (start_number[d.id] != undefined) {
            sub_node[d.id]
                .attr("cx", function(d) {
                    d.x = tmpx + d.fx;
                    return d.x;
                })
                .attr("cy", function(d) {
                    d.y = tmpy + d.fy;
                    return d.y;
                })

            // sub_text[d.id]
            //     .attr("x", function(d, i) {
            //         return d.x;
            //     })
            //     .attr("y", function(d, i) {
            //         return d.y - d.radius;
            //     })

            sub_line[d.id]
                .attr("x1", function(d) {
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
        }

        graph_line
            .attr("x1", function(d) {
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
            })
            .attr("stroke", function(d, i) {
                if (d.source.id == tmp || d.target.id == tmp) return "red";
                return line_color;
            })
        text.attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y + d.radius;
            })
    }

    function dragended(d) {
        d3.select(this).classed("active", false);
        graph_line
            .attr("stroke", function(d, i) {
                return line_color;
            })
    }

    $("#back").click(function() {
        number_of_floor = number_of_floor - 2;
        // console.log("back " + number_of_floor)
        if (number_of_floor <= 1)
            $('#back').prop('disabled', true).css('opacity', 0.5);

        graph_node
            .transition()
            .duration(2000)
            .attr("r", 0);
        graph_line
            .transition()
            .duration(2000)
            .attr("stroke-width", 0);
        text
            .transition()
            .duration(2000)
            .attr("opacity", 0);
        for (var i = 0; i < sort_groups; i++) {
            if (start_number[i] == undefined) continue;
            sub_node[i]
                .transition()
                .duration(2000)
                .attr("r", 0);

            sub_line[i]
                .transition()
                .duration(2000)
                .attr("stroke-width", function(d) {
                    return 0;
                })
                // sub_text[i]
                //     .transition()
                //     .duration(2000)
                //     .attr("opacity", function(d) {
                //         return 0;
                //     })
        }
        k_means_drawing();
    });

    function show_another_graph(d) {
        function State() {}
        State.prototype.id = "A";
        State.prototype.value = 0;
        var view_port = new Array();

        var another_group = (overall_group[number_of_floor - 1][d.id + configure_history[number_of_floor - 1]]);
        $("#element_select").empty();
        $("#element_select").chosen("destroy");
        $("#element_select").append("<option value='" + (0) + "'>" + "" + "</option>")

        for (var i = 0; i < another_group.length; i++) {
            var true_name = k_means_map2.get(another_group[i]);
            view_port[i] = new State();
            view_port[i].id = true_name;
            view_port[i].value = another_group[i];
            $("#element_select").append("<option value='" + (another_group[i]) + "'>" + true_name + "</option>")
        }

        $('#element_select').chosen({
            disable_search_threshold: 10,
            width: "100%"
        });
        draw_view_port(view_port, another_group.length);
        download_data = k_means_map2.get(another_group[0]);
        for (var i = 1; i < another_group.length; i++) {
            download_data += '\n' + k_means_map2.get(another_group[i]);
        }
    }

    function graph_zoom_test(d) {
        var string = number_of_floor - 1 + " " + (d.id + configure_history[number_of_floor - 1]);
        if (hierarchy_map.get(string) == undefined) return;
        var prev_x = d.x,
            prev_y = d.y;
        graph_node
            .transition()
            .duration(2000)
            .attr("r", 0);
        graph_line
            .transition()
            .duration(2000)
            .attr("stroke-width", 0);
        text
            .transition()
            .duration(2000)
            .attr("opacity", 0);
        for (var i = 0; i < sort_groups; i++) {
            if (start_number[i] == undefined) continue;
            sub_node[i]
                .transition()
                .duration(2000)
                .attr("r", 0);

            sub_line[i]
                .transition()
                .duration(2000)
                .attr("stroke-width", function(d) {
                    return 0;
                })
                // sub_text[i]
                //     .transition()
                //     .duration(2000)
                //     .attr("opacity", function(d) {
                //         return 0;
                //     })
        }

        // for (var i = 0; i < sort_groups; i++) {
        //     k_means_sub_node_class[d.id][i].x = k_means_sub_node_class[d.id][i].x + width / 2 - prev_x;
        //     k_means_sub_node_class[d.id][i].y = k_means_sub_node_class[d.id][i].y + height / 2 - prev_y;
        // }

        // rearrange_position(k_means_sub_node_class[d.id], 0, graph_r, 0);

        // sub_node[d.id]
        //     .transition()
        //     .duration(2000)
        //     .attr("cx", function(d, i) {
        //         return d.x;
        //     })
        //     .attr("cy", function(d, i) {
        //         return d.y;
        //     })
        //     .attr("r", function(d) {
        //         return d.radius;
        //     });

        // sub_line[d.id]
        //     .transition()
        //     .duration(2000)
        //     .attr("x1", function(d) {
        //         return d.source.x;
        //     })
        //     .attr("y1", function(d) {
        //         return d.source.y;
        //     })
        //     .attr("x2", function(d) {
        //         return d.target.x;
        //     })
        //     .attr("y2", function(d) {
        //         return d.target.y;
        //     })
        //     .attr("stroke-width", function(d) {
        //         return d.width;
        //     })

        configure_history[number_of_floor] = start_number[d.id];
        k_means_drawing();

    }
}