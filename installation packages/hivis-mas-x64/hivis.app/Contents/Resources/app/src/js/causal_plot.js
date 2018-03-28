$("#ppi_update,#interactors,#confidence,#sub_pathway,#random,#random_nodes").hide();
var width = 750,
    height = 750,
    rf = require("fs"),
    i,
    data, threshold, property_data,
    transform = d3.zoomIdentity;
var svg,
    color1 = d3.rgb("green"),
    color2 = d3.rgb("yellow"),
    compute1 = d3.interpolate(color1, "white"),
    compute2 = d3.interpolate("white", color2),
    tooptip = d3.select("body")
    .append("div")
    .attr("class", "tooptip")
    .style("opacity", 0.0);

function error_handler() {
    alert("Sorry, wrong path!!!");
    show_content();
}


function show_content() {
    var tmp = d3.select("body").selectAll("svg");
    tmp.remove();
    $("button,input").show();
    $("#confidence,#interactors,#return,#ppi_update").hide();
    $("#sub_pathway,#random,#random_nodes").hide();

}

function zooming(g) {
    svg.call(d3.zoom()
        .scaleExtent([0.2, Infinity])
        .on("zoom", zoomed));

    function zoomed() {
        g.attr("transform", d3.event.transform);
    }
}

function force_layout(node_class, line_class) {
    const forceX = d3.forceX(width / 2).strength(15);
    const forceY = d3.forceY(height / 2).strength(15);
    var color = d3.scaleOrdinal(d3.schemeCategory20),
        g = svg.append("g"),
        radius = 18;

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('x', forceX)
        .force('y', forceY)

    var link = g
        .attr("class", "links")
        .attr("stroke", "black")
        .selectAll("line")
        .data(line_class)
        .enter().append("line")
        .attr("opacity", function(d) {
            return 0.5 / 1000 * d.value + 0.5;
        })
        .attr("stroke-width", function(d) {
            return d.value / 200;
        })
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("stroke", "yellow");
            tooptip.html("value:" + d.value + "<br>" + d.source.id + "<-->" + d.target.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("background-color", "Ivory")
                .style("opacity", 1.0);
        })
        .on("mouseout", function() {
            d3.select(this)
            tooptip.style("opacity", 0.0);
        });



    var node = g
        .selectAll("circle")
        .data(node_class)
        .enter().append("circle")
        .attr("r", radius)
        .attr("fill", function(d) { return color(Math.floor(10 * Math.random())); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    // node.append("title")
    //    .text(function(d) { return d.id; });

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
    zooming(g);
}

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
//////////////////////////////////////////////---------CasualGraph---------//////////////////////////////////////////////////

function show_drawing() {
    draw_svg();
    read_CausalGraph_file();
    draw_the_main();
}

function random_test() {
    draw_svg();
    var random_nodes = $("#random_nodes").val();
    // threshold = document.getElementById("threshold").value;
    threshold = $("#threshold").val();
    // threshold = 0.4;
    data = new Array(random_nodes);
    for (var i = 0; i < random_nodes; i++) {
        data[i] = (i == 0 ? "A" + i + '\t' + "0.0" : "A" + i + '\t' + "0.0" + '\t');
        for (var j = 0; j < i; j++) {
            data[i] = data[i] + '\t' + (Math.random() - 0.5);
        }
        data[i] = i == (random_nodes - 1) ? data[i] : data[i] + '\n';
    }
    property_data = new Array(random_nodes);
    for (var i = 0; i < random_nodes; i++) {
        property_data[i] = "A" + i + "\t" + Math.random() + '\n';
    }
    draw_the_main();
}

function read_CausalGraph_file() {
    var file_path = $("#path").val();
    //var property_path = document.getElementById("property").value;
    var property_path = $("#property").val();
    //threshold = document.getElementById("threshold").value;
    threshold = $("#threshold").val();
    try {
        data = rf.readFileSync(file_path, "utf-8");
        property_data = rf.readFileSync(property_path, "utf-8");
    } catch (err) {
        error_handler();
    }
}


function draw_the_main() {
    var nodes = data.toString().split("\n");
    var nodes_property = property_data.toString().split("\n");
    var length = nodes.length;
    var max = 0,
        min = 0,
        i, j;
    for (var index = 0; index < length; index++) {
        nodes[index] = nodes[index].toString().split("\t");
        nodes_property[index] = nodes_property[index].toString().split("\t");
    }
    var list = new Array(length),
        reference = new Array(length),
        flag = false;
    for (var k = 0; k < length; k++) {
        flag = false;
        for (i = 0; i < length; i++) {
            if (reference[i] == 2) continue;
            for (j = 1; j < i + 1; j++) {
                if (reference[j - 1] == 2) continue;
                if (nodes[i][j] > max) max = nodes[i][j];
                if ((nodes[i][j] < 0) && (-nodes[i][j] > -min)) min = nodes[i][j];
                if ((nodes[i][j] > threshold || nodes[i][j] < -threshold)) {
                    reference[i] = 1;
                    break;
                }
            }
        }
        list[k] = "";
        for (var w = 0; w < length; w++) {
            if (reference[w] == 2) continue;
            else if (reference[w] != 1) {
                list[k] += w.toString() + " ";
                flag = true;
                reference[w] = 2;
            } else reference[w] = 0;
        }
        if (flag == false) break;
    }

    var nodes_by_line = new Array(k),
        max_of_row = 0;
    draw_the_line(max, min, k);
    for (index = 0; index < k; index++) {
        nodes_by_line[index] = list[index].toString().split(" ");
        if (nodes_by_line[index].length > max_of_row) max_of_row = nodes_by_line[index].length;

    }
    var x_coordinate = new Array(length + 1),
        y_coordinate = new Array(length + 1);
    for (index = 0; index < k; index++) {
        for (var s = 0; s < nodes_by_line[index].length - 1; s++) {
            x_coordinate[nodes_by_line[index][s]] = width / (2 + 2 * k) + index * width / (1 + k);
            y_coordinate[nodes_by_line[index][s]] = height / nodes_by_line[index].length * (s + 1);
        }

    }
    var g = svg.append("g");

    function Line() {}
    Line.prototype.value = 0.8;
    Line.prototype.source = 4;
    Line.prototype.target = 4;
    Line.prototype.sourceID = 4;
    Line.prototype.targetID = 4;

    var line_class = new Array(),
        index_for_lineClass = 0;
    for (i = 0; i < length; i++) {
        for (j = 1; j < i + 1; j++) {
            if ((nodes[i][j] > threshold || nodes[i][j] < -threshold)) {
                line_class[index_for_lineClass] = new Line();
                line_class[index_for_lineClass].value = nodes[i][j];
                line_class[index_for_lineClass].source = nodes[j - 1][0];
                line_class[index_for_lineClass].target = nodes[i][0];
                line_class[index_for_lineClass].sourceID = j - 1;
                line_class[index_for_lineClass].targetID = i;
                index_for_lineClass++;
            }
        }
    }

    var lines = g.selectAll("line")
        .data(line_class)
        .enter()
        .append("line")
        .attr("x1", function(d) {
            return x_coordinate[d.sourceID];
        })
        .attr("y1", function(d) {
            return y_coordinate[d.sourceID];
        })
        .attr("x2", function(d) {
            return x_coordinate[d.targetID];
        })
        .attr("y2", function(d) {
            return y_coordinate[d.targetID];
        })
        .attr("stroke-width", 4)
        .attr("stroke", function(d) {
            if (d.value > 0) return compute1(1 - d.value / max);
            else return compute2(d.value / min);
        })
        .attr("fill", "none")
        .on("mouseover", function(d) {

            d3.select(this)
                .attr("stroke-width", 8);
            tooptip.html("value:" + d.value + "<br>" + "source:" + d.source + "<br>" + "target:" + d.target)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("background-color", "Ivory")
                .style("opacity", 1.0);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("stroke-width", 4);
            tooptip.style("opacity", 0.0);

        });

    function Node() {}
    Node.prototype.name = "A";
    Node.prototype.ID = 1;
    Node.prototype.property = 1;

    var node_class = new Array();
    for (i = 0; i < length; i++) {
        node_class[i] = new Node();
        node_class[i].ID = i;
        node_class[i].property = nodes_property[i][1];
    }
    console.log(node_class);
    var r = max_of_row > k ? max_of_row : k;
    r = height / (2.5 * r);
    var causal_node = g.selectAll("circle")
        .data(node_class)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return x_coordinate[d.ID];
        })
        .attr("cy", function(d) {
            return y_coordinate[d.ID];
        })
        .attr("r", r)
        .attr("fill", "#40E0D0")
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("stroke-width", 3)
                .attr("stroke", "red");
            tooptip.html("property:" + d.property)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("background-color", "Ivory")
                .style("opacity", 1.0);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("stroke-width", 0);
            tooptip.style("opacity", 0.0);
        })
        .call(d3.drag()
            .on("drag", function dragged(d) {
                d3.select(this)
                    .attr("cx", x_coordinate[d.ID] = d3.event.x).attr("cy", y_coordinate[d.ID] = d3.event.y);
                causal_text
                    .attr("x", function(d) {
                        return x_coordinate[d.ID];
                    })　　　　.attr("y", function(d) {
                        return y_coordinate[d.ID];
                    });
                lines
                    .attr("x1", function(d) {
                        return x_coordinate[d.sourceID];
                    })
                    .attr("y1", function(d) {
                        return y_coordinate[d.sourceID];
                    })
                    .attr("x2", function(d) {
                        return x_coordinate[d.targetID];
                    })
                    .attr("y2", function(d) {
                        return y_coordinate[d.targetID];
                    })
            }));
    var causal_text = g.selectAll("text")
        .data(node_class)
        .enter()
        .append("text")
        .attr("class", "texts")　　
        .attr("x", function(d) {
            return x_coordinate[d.ID];
        })　　　　.attr("y", function(d) {
            return y_coordinate[d.ID];
        })　　　　.text(function(d) {
            return nodes[d.ID][0];
        });

    zooming(g);
}

function draw_the_line(max, min, length) {
    min = Math.floor(min), max = Math.floor(max) + 1;
    var yScale = d3.scaleLinear()
        .domain([min, max])
        .range([0, height]);
    var yAxis = d3.axisRight()
        .scale(yScale)
        .ticks(8);
    yScale.range([height, 0]);

    for (i = 0; i < 200 * (max / (max - min)); i++) {
        svg.append("rect")
            .attr("x", 0.9 * width)
            .attr("y", height / 200 * i)
            .attr("width", 0.04 * width)
            .attr("height", height / 200)
            .attr("fill", compute1(i / (200 * (max / (max - min)))));
    }
    for (i = 0; i < 200 * (-min / (max - min)); i++) {
        svg.append("rect")
            .attr("x", 0.9 * width)
            .attr("y", height * max / (max - min) + height / 200 * i)
            .attr("width", 0.04 * width)
            .attr("height", height / 200)
            .attr("fill", compute2(i / (200 * (-min / (max - min)))));
    }
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (width * 0.94) + "," +
            (0) + ")")
        .call(yAxis);
}

//////////////////////////////////////////////---------CasualGraph---------//////////////////////////////////////////////////


//////////////////////////////////////////////---------pathway---------//////////////////////////////////////////////////
function read_pathway_file() {
    //var path = document.getElementById("path").value;
    var path = "dmeData";
    if (rf.existsSync(path)) {
        rf.readdir(path, function(err, files) {
            if (err) error_handler();
            var pathway_length = files.length / 2;
            var results = new Array(pathway_length);
            for (var i = 0; i < pathway_length; i++) {
                results[i] = rf.readFileSync(path + "/" + files[2 * i], "utf-8");
            }
            pathway_file_handler(results, pathway_length);
        });
    } else
        error_handler();
}

function pathway() {
    read_pathway_file();
    draw_svg();
}

function pathway_file_handler(file, length) {
    var pathway_file = new Array(length);
    for (var i = 0; i < length; i++) {
        pathway_file[i] = file[i].toString().split("\n");
        for (var j = 0; j < pathway_file[i].length; j++) {
            pathway_file[i][j] = pathway_file[i][j].toString().split("\t");
        }
    }
    pathway_draw(pathway_file, length);
}

function pathway_draw(file, length) {
    function Pathway_node() {}
    Pathway_node.prototype.name = "A";
    Pathway_node.prototype.ID = 1;

    var pathway_node_class = new Array(length);
    for (var i = 0; i < length; i++) {
        pathway_node_class[i] = new Pathway_node();
        pathway_node_class[i].id = file[i][0][0];
    }

    function Pathway_line() {}
    Pathway_line.prototype.source = "A";
    Pathway_line.prototype.target = "B";
    Pathway_line.prototype.sourceID = 4;
    Pathway_line.prototype.targetID = 4;
    console.log(file);
    var pathway_line_class = new Array(),
        index_for_PathwaylineClass = 0;
    for (var i = 0; i < file.length; i++) {
        for (var j = 0; j < file[i].length; j++) {
            for (var k = 0; k < file[i][j].length; k++) {
                if ((k == 2 || k == 1) && (file[i][j][k].slice(0, 4) == "path") && (file[i][j][k].slice(5, 8) == file[0][0][0].slice(0, 3))) {
                    pathway_line_class[index_for_PathwaylineClass] = new Pathway_line();
                    pathway_line_class[index_for_PathwaylineClass].source = file[i][j][0];
                    pathway_line_class[index_for_PathwaylineClass].target = file[i][j][k].slice(5);
                    pathway_line_class[index_for_PathwaylineClass].sourceID = i;
                    pathway_line_class[index_for_PathwaylineClass].targetID = i;
                    index_for_PathwaylineClass++;
                }
            }
        }
    }
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
    var link = svg.append("g")
        .attr("class", "links")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .selectAll("line")
        .data(pathway_line_class)
        .enter().append("line");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(pathway_node_class)
        .enter().append("circle")
        .attr("r", 5)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(pathway_node_class)
        .on("tick", ticked);

    simulation.force("link")
        .links(pathway_line_class);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
        // if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fixed = true;
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}

//////////////////////////////////////////////---------pathway---------//////////////////////////////////////////////////

//////////////////////////////////////////////---------sub_pathway---------///////////////////////////////////////////////
function read_sub_pathway_file() {
    //var sub_pathway_path= document.getElementById("path").value;
    var sub_pathway_path = "cel00785.xml";
    /*
     try {
         data = rf.readFileSync(sub_pathway_path, "utf-8");
     } catch (err) {
         error_handler();
     }
     console.log(data);
     console.log(data.getElementByTagName("title")[0].innerHTML);
    */
    d3.xml("/home/lightman/first/cel00785.xml", function(error, xmlDocument) {
        if (error) error_handler();
        console.log(xmlDocument);

    })
}

function test() {
    d3.json("https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048#miserables.json", function(error, data) {
        if (error)
            return console.log("error");
        console.log(data);
    })
}

function sub_pathway() {
    //read_sub_pathway_file();
    test();
    draw_svg();
}

//////////////////////////////////////////////---------PPI---------//////////////////////////////////////////////////
var map = d3.map(),
    interactor = 10,
    confidence = 0.4,
    ppi_elements,
    protein_name, begin, end, node_number, overall_node_number;


function read_ppi_file() {
    var ppi_path = $("#path").val(),
        ppi_data;
    protein_name = $("#Protein_name").val();
    protein_name = "574087.Acear_0001";
    ppi_path = "574087.protein.links.v10.5.txt";
    rf.readFile(ppi_path, "utf-8", function(err, ppi_data) {
        if (err) error_handler();
        else handle_ppi_file(ppi_data);
    });
}

function PPI() {
    draw_svg();
    read_ppi_file();
    $("#confidence,#interactors,#ppi_update").show();
}

function ppi_update() {
    interactor = $("#interactors").val();
    confidence = $("#confidence").val();
    var tmp = d3.select("body").selectAll("svg");
    tmp.remove();
    draw_svg();
    $("#confidence,#interactors,#ppi_update").show();
    ppi_graph();
}

function handle_ppi_file(data) {
    ppi_elements = data.toString().split("\n");
    for (var index = 0; index < ppi_elements.length; index++) {
        ppi_elements[index] = ppi_elements[index].toString().split(" ");
    }
    var ele = ppi_elements[1][0],
        ele_index = 1;
    for (i = 2; i < ppi_elements.length; i++) {
        if (ppi_elements[i][0] != ele) {
            map.set(ele, ele_index + " " + (i - 1));
            ele = ppi_elements[i][0];
            ele_index = i;
        }
    }
    map.set(ele, ele_index + " " + (i - 1));
    console.log(map);
    overall_node_number = Object.keys(map).length;
    console.log(overall_node_number);
    begin = parseInt(map.get(protein_name).split(" ")[0]);
    end = parseInt(map.get(protein_name).split(" ")[1]);
    quickSort(ppi_elements, begin, end, 2);
    ppi_graph();
}

function ppi_graph() {
    function ppi_node() {}
    ppi_node.prototype.id = "A";

    function ppi_line() {}
    ppi_line.prototype.source = "A";
    ppi_line.prototype.target = "B";
    ppi_line.prototype.value = 1;

    var ppi_line_class = new Array();
    var ppi_node_class = new Array();
    ppi_node_class[0] = new ppi_node();
    ppi_node_class[0].id = ppi_elements[begin][0];
    node_number = 1;
    for (var i = 1; i <= interactor; i++) {
        if (ppi_elements[begin + i - 1][2] < confidence * 1000) continue;
        ppi_node_class[node_number] = new ppi_node();
        ppi_node_class[node_number].id = ppi_elements[begin + node_number - 1][1];
        ppi_line_class[node_number - 1] = new ppi_line();
        ppi_line_class[node_number - 1].source = ppi_elements[begin + node_number - 1][0];
        ppi_line_class[node_number - 1].target = ppi_elements[begin + node_number - 1][1];
        ppi_line_class[node_number - 1].value = ppi_elements[begin + node_number - 1][2];
        node_number++;
    }
    var ppi_index = node_number - 1;
    for (var i = 1; i <= node_number - 1; i++) {
        var start = parseInt(map.get(ppi_node_class[i].id).split(" ")[0]),
            last = parseInt(map.get(ppi_node_class[i].id).split(" ")[1]);
        for (var index = start; index <= last; index++) {
            for (var j = i + 1; j <= node_number - 1; j++) {
                if (ppi_elements[index][1] == ppi_node_class[j].id && ppi_elements[index][2] >= confidence * 1000) {
                    ppi_line_class[ppi_index] = new ppi_line();
                    ppi_line_class[ppi_index].source = ppi_node_class[j].id;
                    ppi_line_class[ppi_index].target = ppi_elements[index][0];
                    ppi_line_class[ppi_index].value = ppi_elements[index][2];
                    ppi_index++;
                }
            }
        }
    }
    force_layout(ppi_node_class, ppi_line_class);
}



//////////////////////////////////////////////---------PPI---------//////////////////////////////////////////////////