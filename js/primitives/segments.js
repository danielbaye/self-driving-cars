class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    equals(segment) {
        return (segment.p1.equals(this.p1) && segment.p2.equals(this.p2)) || (segment.p2.equals(this.p1) && segment.p1.equals(this.p2))
    }

    draw(ctx, { width = 2, color = "black", dash = [] } = {}) {

        ctx.beginPath();
        ctx.lineWidth = width
        ctx.strokeStyle = color;
        ctx.setLineDash(dash)
        ctx.moveTo(this.p1.x, this.p1.y)
        ctx.lineTo(this.p2.x, this.p2.y)
        ctx.stroke();
        ctx.setLineDash([])
    }


}