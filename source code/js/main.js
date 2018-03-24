var arr = 0,
    N = 0,
    ele_map = 0,
    locate_map = 0,
    sort_number = 6,
    data = 0,
    k_means_map = 0,
    k_means_map2 = 0,
    file_name = 0,
    file_path = 0;
$("#input_data").change(function() {
    $('#spectrum,#k_means').prop('disabled', false).css('opacity', 1);

    const input = document.querySelector('input[type="file"]')
    file_path = input.files[0].path;
    file_name = input.files[0].name;
    [data, arr, N, ele_map, locate_map, k_means_map, k_means_map2] = file_process(file_path);
    initial();
    $("#file_name").val(file_name);
});


function initial() {
    $("#back").unbind();
    var [o_group, h_map] = generate_hc(arr, _.range(0, N), sort_number, 0);
    // console.log([o_group, h_map]);
    $("#SVG").remove();
    draw_svg();
    draw_hierarchy_graph(o_group, sort_number, ele_map, h_map, k_means_map2);
}

$("#spectrum").click(function() {
    $("#left_top_sort_div").hide();
    $("#back").unbind();
    $(this).css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0.05, red), color-stop(1, #FF4040))")
        .css("background-color", "red")
        .prop('disabled', true);
    $("#k_means").css("background", " -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1))")
        .css("background-color", "#0061a7")
        .prop('disabled', false);

    // var [arr, N, ele_map] = file_process();
    var [o_group, h_map, gl_map] = generate_hc(arr, _.range(0, N), 20, 1);
    //  console.log([o_group, h_map, gl_map]);
    $("#SVG").remove();
    draw_svg();
    draw_sp_hierarchy_graph(o_group, ele_map, h_map, gl_map, k_means_map2);
})

$("#k_means").click(function() {
    $("#left_top_sort_div").show();

    $(this).css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0.05, red), color-stop(1, #FF4040))")
        .css("background-color", "red")
        .prop('disabled', true);
    $("#spectrum").css("background", " -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1))")
        .css("background-color", "#0061a7")
        .prop('disabled', false);
    initial();
})

$("#range_slider").change(function() {
    // console.log($(this).val());
    sort_number = $(this).val();
    initial();
    $("#sort_group").val(sort_number);
})
$("#sort_group").change(function() {
    sort_number = $(this).val();
    initial();
    $("#range_slider").val(sort_number);
})

function generate_hc(arr, group, sort_groups, flag) {
    var i, j, index,
        hierarchy_map = d3.map(),
        overall_group = new Array(14);
    for (i = 0; i < 100; i++) {
        overall_group[i] = new Array();
    }
    if (flag == 0)
        overall_group[0] = new_k_means_cluster(arr, group, sort_groups);
    else {
        overall_group[0] = Spectrum_Cluster(arr, group);
        var group_length_map = d3.map();
    }

    var hierarchy_group_index, hierarchy_flag = 1,
        tmp_group = 0;

    for (index = 0; index < 99; index++) {　
        if (hierarchy_flag == 0) { console.log(index); break; }
        hierarchy_group_index = 0;
        hierarchy_flag = 0;
        tmp_group = [];
        for (i = 0; i < overall_group[index].length; i++) {
            if (overall_group[index][i].length <= sort_groups) continue;
            if (flag == 0)
                tmp_group = new_k_means_cluster(arr, overall_group[index][i], sort_groups);
            else tmp_group = Spectrum_Cluster(arr, overall_group[index][i]);

            if ((flag == 1) && (tmp_group.length == 1)) continue;
            hierarchy_flag = 1;
            hierarchy_map.set(index + " " + i, hierarchy_group_index);
            if (flag == 1)
                group_length_map.set(index + " " + i, tmp_group.length);
            for (j = 0; j < tmp_group.length; j++) {
                overall_group[index + 1][hierarchy_group_index++] = tmp_group[j];
            }
        }
    }
    if (flag == 1)
        return [overall_group, hierarchy_map, group_length_map];
    return [overall_group, hierarchy_map];
}

function sp_generate_hc(arr, group, min_group) {
    var i, j, index,
        hierarchy_map = d3.map(),
        overall_group = new Array(20);
    for (i = 0; i < 100; i++) {
        overall_group[i] = new Array();
    }
    overall_group[0] = Spectrum_Cluster(arr, group);
    var hierarchy_group_index, hierarchy_flag = 1,
        tmp_group = 0,
        ii;
    for (index = 0; index < 99; index++) {　
        if (hierarchy_flag == 0) { console.log(index); break; }
        hierarchy_group_index = 0;
        hierarchy_flag = 0;
        tmp_group = [];
        for (ii = 0; ii < overall_group[index].length; ii++) {
            if (overall_group[index][ii].length <= min_group) continue;
            tmp_group = Spectrum_Cluster(arr, overall_group[index][ii]);
            if (tmp_group.length == 1) continue;
            hierarchy_flag = 1;
            hierarchy_map.set(index + " " + ii, hierarchy_group_index);
            for (j = 0; j < tmp_group.length; j++) {
                overall_group[index + 1][hierarchy_group_index++] = tmp_group[j];
            }
        }
    }
    return [overall_group, hierarchy_map];
}


$("#element_select").chosen().change(function() {
    $('#graph_return').prop('disabled', false).css('opacity', 1);
    $('#spectrum,#k_means').prop('disabled', true).css('opacity', 0.5);

    // console.log($(this).val());
    $("#right_graph_div").hide();
    $("#sub_right_graph_div").show();
    draw_sub_graph(data, $(this).val(), locate_map, k_means_map, k_means_map2, $("#number").val(), $("#confidence").val());

});

$("#confidence, #number").change(function() {
    // console.log($("#number").val());
    // console.log($("#confidence").val());
    draw_sub_graph(data, $("#element_select").val(), locate_map, k_means_map, k_means_map2, $("#number").val(), $("#confidence").val());
});
// $("#demo1").click(function() {
//     demo_click("data/demo1.txt", "demo1.txt");
// });
// $("#demo2").click(function() {
//     demo_click("src/data/demo2.txt", "demo2.txt");
// });
$("#download").click(function() {
    rf.writeFile(file_path + ".txt", download_data, function(err) {
        if (err) {
            return console.log(err);
        }
        alert("File was saved as " + file_path + ".txt");
    });
})

function demo_click(path, name) {
    file_name = name;
    file_path = path;
    $("#spectrum").css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1))")
        .css("background-color", "#0061a7")
        .prop('disabled', false);

    $("#k_means").css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0.05, red), color-stop(1, #FF4040))")
        .css("background-color", "red")
        .prop('disabled', true);

    [data, arr, N, ele_map, locate_map, k_means_map, k_means_map2] = file_process(file_path);
    initial();
    $("#file_name").val(file_name);
}