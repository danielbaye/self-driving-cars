
class Graph {

    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    addPoint(point) {
        this.points.push(point)
        return true;
    }

    containsPoint(point) {
        return this.points.find(p => p.equals(point))
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }

        return false;
    }

    addSegment(segment) {
        this.segments.push(segment)
    }
    containsSegment(segment) {
        return this.segments.find(s => s.equals(segment))
    }

    differentPoints(segment) {
        return !segment.p1.equals(segment.p2)
    }

    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1)
    }

    tryAddSegment(segment) {

        if (!this.containsSegment(segment) && this.differentPoints(segment)) {
            this.addSegment(segment)
            return true
        }
        return false
    }

    static load(info) {
        const points = [];
        const segments = [];
        for (const pointInfo of info.points)
            points.push(new Point(pointInfo.x, pointInfo.y))
        for (const segmentInfo of info.segments)
            segments.push(new Segment(points.find(p => p.equals(segmentInfo.p1)),
                points.find(p => p.equals(segmentInfo.p2))))

        return new Graph(points, segments)
    }

    removePoint(point) {
        this.segments = this.segments.filter(s => !s.p1.equals(point) && !s.p2.equals(point))
        this.points.splice(this.points.indexOf(point), 1)
    }

    dispose() {
        this.points = [];
        this.segments = [];
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }
        for (const point of this.points) {
            point.draw(ctx);
        }


    }
}