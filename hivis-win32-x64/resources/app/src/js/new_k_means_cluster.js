function new_k_means_cluster(arr, initial_group, sort_groups) {
    var group = 0,
        random_select = 0,
        N = initial_group.length;
    return (recurring(initial_group));

    function recurring(group) {
        var sub_random_chosen = locate_inital_point(group),
            new_random_chosen = new Array(sort_groups),
            new_group = 0,
            tmp_array = [],
            i, j;

        var times = 0;
        while (true) {
            new_group = group_locate(sub_random_chosen);
            for (i = 0; i < sort_groups; i++) {
                new_random_chosen[i] = (center_locate(new_group[i]));
                tmp_array[i] = (new_random_chosen[i] == sub_random_chosen[i]);
            }

            if ((_.contains(tmp_array, false))) {
                sub_random_chosen = new_random_chosen;
            } else {
                return new_group;
            }
            times++;
        }
    }

    function center_locate(group) {
        var result = 0,
            i, j,
            number = group.length,
            count = 0,
            index = 0,
            max = 0;

        for (i = 0; i < number; i++) {
            count = 0;
            for (j = 0; j < number; j++) {
                if (i == j) continue;
                count += parseFloat(arr[group[i]][group[j]]);
            }
            if (count > max) {
                max = count;
                index = i;
            }
        }
        return group[index];
    }



    function locate_inital_point(group) {
        var result = [],
            next_point = 0,
            tmp_array1 = [],
            tmp_array2 = [],
            i, j;
        result[0] = _.sample(group);
        for (i = 1; i < sort_groups; i++) {
            tmp_array2 = [];
            for (j = 0; j < N; j++) {
                if (_.contains(result, group[j])) continue;
                tmp_array1 = [];
                for (var index = 0; index < i; index++) {
                    tmp_array1.push(parseFloat(arr[group[j]][result[index]]));
                }
                tmp_array2[j] = _.max(tmp_array1);
            }
            result[i] = group[_.indexOf(tmp_array2, _.min(tmp_array2))];
        }
        return result;
    }

    function group_locate(random) {
        var result = new Array(sort_groups),
            tmp_array1 = [],
            tmp = 0,
            i, j;
        for (i = 0; i < sort_groups; i++) {
            result[i] = new Array();
            result[i].push(random[i]);
        }
        for (i = 0; i < N; i++) {
            tmp_array1 = [];
            if (_.contains(random, initial_group[i])) continue;
            for (j = 0; j < sort_groups; j++) {
                tmp_array1.push(parseFloat(arr[initial_group[i]][random[j]]));
            }
            tmp = _.indexOf(tmp_array1, _.max(tmp_array1));
            result[tmp].push(initial_group[i]);
        }
        return result;
    }
}