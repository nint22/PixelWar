function add2d(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

function scale2d(v, s) {
    return [v[0] * s, v[1] * s];
}

function sub2d(v1, v2) {
    return add2d(v1, scale2d(v2, -1));
}

function magnitude2d(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function normalize2d(v) {
    return scale2d(v, 1/magnitude2d(v));
}
