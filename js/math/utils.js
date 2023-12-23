function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, loc)
        if (dist < minDist && dist < threshold) {
            minDist = dist
            nearest = point
        }
    }
    return nearest;
}
function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const seg of segments) {
        const dist = seg.distanceToPoint(loc)
        if (dist < minDist && dist < threshold) {
            minDist = dist
            nearest = seg
        }
    }
    return nearest;
}


function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)

}

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler)
}

function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset,
    )
}

function getIntersection(a, b, c, d) {
    const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
    const uTop = (a.x - b.x) * (c.y - a.y) - (a.y - b.y) * (c.x - a.x)
    const bottom = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)
    const eps = 0.001
    if (Math.abs(bottom) > eps) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1)
            return {
                x: lerp(a.x, b.x, t),
                y: lerp(a.y, b.y, t),
                offset: t
            }
    }
    return null;
}

function normalize(p) {
    return scale(p, 1 / magnitude(p))
}

function magnitude(p) {
    return Math.hypot(p.x, p.y)
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y

}

// distance is a point representing a distnace, rate is the rate of change, maxDistance is the distance cap as a scalar,
// returning a ranh scaled point for the maximal distance 
function tanhScale(distance, rate, maxDistance) { 
    const dist = magnitude(distance)
    const precentage = 1 - (Math.tanh(dist / maxDistance))
    const new_t = rate * precentage
    return scale(distance, new_t)
}

function tanhScalarScale(distance, rate, maxDistance) { 
    const precentage = (Math.tanh(Math.abs(distance) / maxDistance))
    const new_t = rate * precentage

    return distance *new_t
}

function lerp(a, b, t) {
    
    return a + (b - a) * t
}

function lerp2D(a, b, t) {
    return new Point(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ",100%,60%)"
}

function angle(point) {
    return Math.atan2(point.y, point.x);
}

function prependicular(point){
    return new Point(-point.y,point.x)
}

function angleToPoint(a){
    return new Point(Math.cos(a),Math.sin(a))
}

function angleDiff(a,b){ //b is to the right of A if position
    angle1_rad = a % (2 * Math.PI);
    angle2_rad = b % (2 * Math.PI);

    // Calculate the signed difference
    let diff_rad = angle1_rad - angle2_rad;

    // Adjust to the range [-pi, pi)
    if (diff_rad >= Math.PI) {
        diff_rad -= 2 * Math.PI;
    } else if (diff_rad < -Math.PI) {
        diff_rad += 2 * Math.PI;
    }
    // console.log(angle1_rad,angle2_rad,diff_rad)

    return diff_rad;
}