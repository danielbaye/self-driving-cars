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

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function average(p1,p2){
    return new Point((p1.x + p2.x)/2,(p1.y + p2.y)/2)

}

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler)
}

function transate(loc, angle, offset) {
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

function normalize(p){
    return scale(p,1/magnitude(p))
}

function magnitude(p){
    return Math.hypot(p.x,p.y)
}

function dot(p1,p2){
    return p1.x*p2.x + p1.y*p2.y

}


function lerp(a, b, t) {
    return a + (b - a) * t
}

function getRandomColor(){
    const hue = 290 + Math.random()*260;
    return "hsl("+hue+",100%,60%)"
}

function angle(point) {
    return Math.atan2(point.y, point.x);
}
