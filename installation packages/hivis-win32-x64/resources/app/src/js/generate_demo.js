var data;
data_generate();
rf.writeFile('k_means.txt', data, 'utf8', function(err) {
    if (err) throw err;
    console.log('DONE');
});

function data_generate() {
    var num = 5;
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            if (i == j) continue;
            data += i + ' ' + j + ' ' + 1 + '\n';
        }
    }
}