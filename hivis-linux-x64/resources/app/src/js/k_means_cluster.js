function k_means_cluster(run_group, arr, sort_groups) {
    console.log(arguments)
    var group = 0,
        random_select = 0;
    recurring(run_group);
    return group;

    function recurring(test_group) {
        var sub_random_chosen = new Array(sort_groups);


        // sub_random_chosen[0] = test_group[0];
        // for (var i = 1; i < sort_groups; i++) {
        //     sub_random_chosen[i] = test_group[i * Math.floor(test_group.length / (sort_groups - 1)) - 1];
        // }
        // sub_random_chosen.sort(function(a, b) { return Math.random() > 0.5 ? -1 : 1; }); //乱序
        //console.log(_.union(sub_random_chosen).length);

        var copy_test_group = _.shuffle(test_group);
        for (var i = 0; i < sort_groups; i++) {
            sub_random_chosen[i] = copy_test_group[i];
        }

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
            // flag = 0;
            // for (var j = 0; j < sort_groups; j++) {
            //     if (element == random[j]) {
            //         flag = 1;
            //         break;
            //     }q
            // }
            // if (flag == 1) continue;
            if (_.some(random, function(d) {
                    return element == d;
                })) continue;

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

}