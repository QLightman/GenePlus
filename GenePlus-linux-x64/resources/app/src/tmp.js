  function durA() {
      for (var i = 0; i < sort_groups; i++) {
          if (start_number[i] == undefined) continue;
          center[0] = k_means_node_class[i].x;
          center[1] = k_means_node_class[i].y;

          for (var j = 0; j < sort_groups; j++) {
              k_means_sub_node_class[i][j].x = k_means_sub_node_class[i][j].x + center[0];
              k_means_sub_node_class[i][j].y = k_means_sub_node_class[i][j].y + center[1];
          }
          rearrange_position(k_means_sub_node_class[i], center, graph_sub_r, k_means_node_class[i].radius);
      }
      console.log(k_means_sub_line_class);
      console.log(k_means_sub_node_class);

      for (var j = 0; j < sort_groups; j++) {
          if (start_number[j] == undefined) continue;
          for (var i = 0; i < sort_groups; i++) {
              k_means_sub_node_class[j][i].fx = k_means_sub_node_class[j][i].x - k_means_node_class[j].x;
              k_means_sub_node_class[j][i].fy = k_means_sub_node_class[j][i].y - k_means_node_class[j].y;
          }
      }
      for (var i = 0; i < sort_groups; i++) {
          if (start_number[i] == undefined) continue;
          sub_node[i] = svg.append("g")
              .attr("opacity", 0.1)
              .style("fill", function(d) { return "steelblue"; })
              .selectAll("circle")
              .data(k_means_sub_node_class[i])
              .enter().append("circle")
              .attr("cx", function(d) {
                  return d.x;
              })
              .attr("cy", function(d) {
                  return d.y;
              })
              .attr("r", function(d) {
                  return d.radius;
              })
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

      }
      for (var index = 0; index < sort_groups; index++) {
          if (start_number[index] == undefined) continue;
          sub_line[index] = svg.append("g")
              .attr("opacity", 0.5)
              .attr("stroke", line_color)
              .selectAll("line")
              .data(k_means_sub_line_class[index])
              .enter().append("line")
              .attr("stroke-width", function(d) {
                  return d.width;
              })
              .attr("opacity", 0.5)
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
      for (var index = 0; index < sort_groups; index++) {
          if (start_number[index] == undefined) continue;
          sub_text[index] = svg.append("g")
              .selectAll("text")
              .data(k_means_sub_node_class[index])
              .enter().append("text")
              .attr("x", function(d) {
                  return d.x;
              })
              .attr("y", function(d) {
                  return d.y - d.radius;
              })
              .text(function(d) {
                  return "size " + d.size;
              })
              .attr("opacity", 0.5)

      }

      graph_node = svg.append("g")
          .attr("opacity", 0.3)
          .selectAll("circle")
          .data(k_means_node_class)
          .enter().append("circle")
          .attr("cx", function(d) {
              return d.x;
          })
          .attr("cy", function(d) {
              return d.y;
          })
          .attr("r", function(d, i) {
              return d.radius;
          })
          .style("fill", function(d) { return line_color; })
          // .on("mouseover", function(d) {
          //     d3.select(this)
          //         .attr("stroke", "yellow");
          //     tooptip.html("size:" + d.size)
          //         .style("left", (d3.event.pageX) + "px")
          //         .style("top", (d3.event.pageY + 20) + "px")
          //         .style("background-color", "Ivory")
          //         .style("opacity", 1);
          // })
          // .on("mouseout", function() {
          //     d3.select(this)
          //         .attr("stroke", line_color);
          //     tooptip.style("opacity", 0.0);
          // })
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))
          .on("dblclick", graph_zoom_test);

      text = svg.append("g")
          .selectAll("text")
          .data(k_means_node_class)
          .enter().append("text")
          .attr("x", function(d) {
              return d.x;
          })
          .attr("y", function(d) {
              return d.y + d.radius;
          })
          .text(function(d) {
              return "size " + d.size;
          })

      graph_line = svg.append("g")
          .attr("opacity", 0.3)
          .attr("stroke", line_color)
          .selectAll("line")
          .data(k_means_line_class)
          .enter().append("line")
          .attr("stroke-width", function(d) {
              return d.width;
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
          // .on("mouseover", function(d) {
          //     d3.select(this)
          //         .attr("stroke", "yellow");
          //     tooptip.html("number:" + d.number + "  " + "value:" + d.value)
          //         .style("left", (d3.event.pageX) + "px")
          //         .style("top", (d3.event.pageY + 20) + "px")
          //         .style("background-color", "Ivory")
          //         .style("opacity", 1);
          // })
          // .on("mouseout", function() {
          //     d3.select(this)
          //         .attr("stroke", line_color);
          //     tooptip.style("opacity", 0.0);
          // })

      function graph_zoom_test(d) {
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
              sub_text[i]
                  .transition()
                  .duration(2000)
                  .attr("opacity", function(d) {
                      return 0;
                  })
          }

          for (var i = 0; i < sort_groups; i++) {
              k_means_sub_node_class[d.id][i].x = k_means_sub_node_class[d.id][i].x + width / 2 - prev_x;
              k_means_sub_node_class[d.id][i].y = k_means_sub_node_class[d.id][i].y + height / 2 - prev_y;
          }

          rearrange_position(k_means_sub_node_class[d.id], 0, graph_r, 0);

          sub_node[d.id]
              .transition()
              .duration(2000)
              .attr("cx", function(d, i) {
                  return d.x;
              })
              .attr("cy", function(d, i) {
                  return d.y;
              })
              .attr("r", function(d) {
                  return d.radius;
              });

          sub_line[d.id]
              .transition()
              .duration(2000)
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
              .attr("stroke-width", function(d) {
                  return d.width;
              })

          pre_chosen_sort = chosen_sort;
          chosen_sort = start_number[d.id];
          k_means_drawing();

      }



      function dragstarted(d) {
          d3.select(this).raise().classed("active", true);
      }
      var tmpx, tmpy, tmp;

      function dragged(d) {
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
              sub_text[d.id]
                  .attr("x", function(d, i) {
                      return d.x;
                  })
                  .attr("y", function(d, i) {
                      return d.y - d.radius;
                  })

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
          var tmp = (classA[i].x - center[0]) * (classA[i].x - center[0]) + (classA[i].y - center[1]) * (classA[i].y - center[1]);
          if (max < tmp) max = tmp;
      }
      max = Math.sqrt(max);
      var valiance = (over_size - radius / 2) / (max);
      console.log(valiance);
      for (i = 0; i < sort_groups; i++) {
          classA[i].x = (classA[i].x - center[0]) * valiance + center[0];
          classA[i].y = (classA[i].y - center[1]) * valiance + center[1];
      }
  }

  function k_means_sub_drawing(node_class) {
      k_means_line_class = new Array();
      k_means_node_class = new Array();

      for (var i = 0; i < node_class.length; i++) {
          k_means_node_class[i] = new k_means_node();
          k_means_node_class[i].id = i;
          k_means_node_class[i].x = node_class[i].x;
          k_means_node_class[i].y = node_class[i].y;
          k_means_node_class[i].size = node_class[i].size;
      }

      generate_line_class(k_means_line_class, start_number[chosen_sort]);
      for (var i = 0; i < sort_groups; i++) {
          var tmp = number_of_floor + " " + parseInt(chosen_sort + i);
          console.log(tmp)
          start_number[i] = hierarchy_map.get(tmp);
      }
      console.log(start_number);
      center = [width / 2, height / 2];

      k_means_force_layout(k_means_node_class, k_means_line_class, center);
      setTimeout(dur, 0);
  }

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
      graph_line
          .transition()
          .duration(2000)
          .attr("opacity", 0);
      text
          .transition()
          .duration(2000)
          .attr("opacity", 0);
      for (var i = 0; i < sort_groups; i++) {
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
          sub_text[i]
              .transition()
              .duration(2000)
              .attr("opacity", function(d) {
                  return 0;
              })
      }

      for (var i = 0; i < sort_groups; i++) {
          k_means_sub_node_class[d.id][i].x = k_means_sub_node_class[d.id][i].x + width / 2 - prev_x;
          k_means_sub_node_class[d.id][i].y = k_means_sub_node_class[d.id][i].y + height / 2 - prev_y;
      }

      rearrange_position(k_means_sub_node_class[d.id], 0, graph_r, 0);

      sub_node[d.id]
          .transition()
          .duration(2000)
          .attr("cx", function(d, i) {
              return d.x;
          })
          .attr("cy", function(d, i) {
              return d.y;
          })
          .attr("r", graph_r / 2);

      sub_line[d.id]
          .transition()
          .duration(2000)
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
          .attr("stroke-width", function(d) {
              return d.width;
          })
      pre_chosen_sort = chosen_sort;
      chosen_sort = d.id;
      k_means_drawing(k_means_sub_node_class[d.id]);
  }