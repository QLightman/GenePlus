function Spectrum_Cluster(arr, group) {
    var result = fast_spectrum_cluster(arr, group);
    return result;

    function fast_spectrum_cluster(arr, group) {
        var sp_threshold = 60;
        if (group.length <= sp_threshold) return spectrum_cluster(arr, group);
        else {
            var group_divide = new_k_means_cluster(arr, group, sp_threshold);
            var respresent_group = new Array(sp_threshold);
            for (var i = 0; i < sp_threshold; i++) {
                respresent_group[i] = group_divide[i][0];
            }
            var group_sub = spectrum_cluster(arr, respresent_group);
            var tmp = 0;
            var result = new Array(group_sub.length);
            for (var i in group_sub) {
                tmp = [];
                for (var j in group_sub[i]) {
                    tmp = tmp.concat(group_divide[_.indexOf(respresent_group, group_sub[i][j])]);
                }
                result[i] = tmp;
            }
            return result;
        }
    }

    function spectrum_cluster(arr, group) {
        var represent_point = 0,
            N = group.length,
            eigen = 0,
            returned_group = 0;
        sorting_preiod();
        return returned_group;

        function sorting_preiod() {
            var D = 0,
                L = 0,
                M = 0,
                eigenvalue = 0,
                sort = 0;

            for (i = 0; i < N; i++) {
                D = new Array(N);
                M = new Array(N);

                for (var j = 0; j < N; j++) {
                    D[j] = new Array(N);
                    M[j] = new Array(N);
                    for (var index = 0; index < N; index++) D[j][index] = 0;
                    for (var index = 0; index < N; index++) M[j][index] = 0;
                }
            }

            for (i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    M[i][j] = arr[group[i]][group[j]];
                }
            }
            for (i = 0; i < N; i++) {
                var tmp = 0;
                for (var j = 0; j < N; j++) {
                    tmp += M[j][i];
                }
                D[i][i] = tmp;
            }
            L = numeric.sub(D, M);
            // for (var i in L) {
            //     for (var j in L[i]) {
            //         //if (L[i][j] == 0) L[i][j] = (i == j) ? 0.01 : -0.01;
            //         if (L[i][j] != 0) L[i][j] *= 10;
            //         else {
            //             if (i == j) L[i][j] = 0.1;
            //             else L[i][j] = -0.1;
            //         }
            //     }
            // }

            var tmp_a = [];

            var SVD = (numeric.svd(L));


            eigen = new Array(N);
            eigen[0] = new Array(N);
            eigen[1] = new Array(N);
            var eigen_vector = new Array(N);
            var flag = 1;
            for (var i = 0; i < N; i++) {
                eigen_vector = [];
                eigen[i] = new Array(2);
                if (SVD.S[i] < 0) {
                    SVD.S[i] = -1 * SVD.S[i];
                    flag = -1;
                }
                eigen[i][0] = parseFloat(SVD.S[i].toFixed(2));

                for (var j = 0; j < N; j++) {
                    eigen_vector[j] = flag * parseFloat(SVD.U[j][i].toFixed(2));
                }
                eigen[i][1] = eigen_vector;
                flag = 1;
            }
            quickSort(eigen, 0, N - 1, 0);
            var tmp = 0;
            for (var i = 0; i < Math.round((N - 1) / 2); i++) {
                tmp = eigen[i];
                eigen[i] = eigen[N - i - 1];
                eigen[N - i - 1] = tmp;
            }
            var sort_group = SP_sort_number(eigen);
            matrix_calu(sort_group);
        }

        function SP_sort_number(sort) {
            var result = 0,
                ratio = 0,
                max = 0,
                index = 0;
            for (var i = 0; i < N - 1; i++) {
                ratio = sort[i + 1][0] / sort[i][0];
                if (isNaN(ratio)) continue;
                if (ratio == Infinity) return i + 1;
                if (ratio > max) {
                    max = ratio;
                    index = i;
                }
            }
            return index + 1;
        }

        function matrix_calu(sp_number) {
            var NK = new Array(N);
            for (var i = 0; i < N; i++) {
                NK[i] = new Array(sp_number);
                for (var j = 0; j < sp_number; j++) {
                    NK[i][j] = eigen[j][1][i];
                }
            }
            var sort_matrix = new Array(N);
            for (var i = 0; i < N; i++) {
                sort_matrix[i] = new Array(N);
            }
            for (var i = 0; i < N; i++) {
                sort_matrix[i][i] = 0;
            }
            var tmp = 0;
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < i; j++) {
                    tmp = 0;
                    for (var k = 0; k < sp_number; k++) {
                        tmp += (NK[i][k] - NK[j][k]) * (NK[i][k] - NK[j][k]);
                    }
                    tmp = Math.sqrt(tmp);
                    tmp = -parseFloat(tmp.toFixed(2));
                    sort_matrix[i][j] = tmp;
                    sort_matrix[j][i] = sort_matrix[i][j];
                }
            }

            returned_group = new_k_means_cluster(sort_matrix, _.range(0, sort_matrix.length), sp_number);
            for (var i in returned_group) {
                for (var j in returned_group[i])
                    returned_group[i][j] = group[returned_group[i][j]];
            }
        }
    }
}