function file_process() {
    var file_path = 0,
        file_name = 0;
    if (arguments.length == 0) {
        const input = document.querySelector('input[type="file"]')
        file_path = input.files[0].path;
        file_name = input.files[0].name;
    } else file_path = arguments[0];

    var M = 0,
        i, j,
        N = 0,
        data = 0,
        k_means_map = d3.map(),
        k_means_map2 = d3.map(),
        element_map = 0,
        locate_map = d3.map();
    Read_File(file_path);
    return [data, M, N, element_map, locate_map, k_means_map, k_means_map2, file_name];

    function Read_File(file_path) {
        data = rf.readFileSync(file_path, "utf-8");
        // rf.readFile(file_path, "utf-8", function(err, data) {
        //     if (err) error_handler();
        //     file_handler(data);
        // });
        file_handler();
    }

    function file_handler() {
        data = data.toString().split("\n");
        for (var index in data) {
            data[index] = data[index].toString().split(" ");
        }

        var element_group = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].length < 3) continue;
            if (isNaN(parseFloat(data[i][2]))) continue;
            if (!(_.last(element_group) == data[i][0])) {
                element_group.push(data[i][0]);
                locate_map.set(data[i][0], i);
            }
        }
        console.log(element_group);

        N = element_group.length;

        for (var i = 0; i < N; i++) {
            k_means_map.set(element_group[i], i);
            k_means_map2.set(i, element_group[i]);
        }

        console.log(N)
        M = new Array(N);
        for (i = 0; i < N; i++) {
            M[i] = new Array(N);
            for (j = 0; j < N; j++)
                M[i][j] = 0;
        }
        element_map = new Array(N + 10);
        for (var i = 0; i < element_map.length; i++) {
            element_map[i] = d3.map();
        }

        for (i = 0; i < data.length; i++) {
            if (data[i].length < 3) continue;
            if (isNaN(parseFloat(data[i][2]))) continue;
            var tmp1 = k_means_map.get(data[i][0]),
                tmp2 = k_means_map.get(data[i][1]);
            M[tmp1][tmp2] = parseFloat(data[i][2]);
            if (tmp1 > tmp2) M[tmp2][tmp1] = parseFloat(data[i][2]);
            element_map[tmp1].set(tmp2, (data[i][2]));
        }
    }


    // var k_means_ele = data[1][0],
    //     k_means_index = 0;
    // k_means_map.set(k_means_ele, k_means_index);
    // k_means_map2.set(k_means_index, k_means_ele);
    // for (i = 2; i < data.length; i++) {
    //     if (data[i][0] != k_means_ele) {
    //         k_means_index++;
    //         k_means_map.set(data[i][0], k_means_index);
    //         k_means_map2.set(k_means_index, (data[i][0]));
    //         k_means_ele = data[i][0];
    //     }
    // }

}