class Stop {
    constructor(center, direction, width, height) {
        this.center = center
        this.direction = direction
        this.width = width
        this.height = height
        this.support = new Segment(translate(center, angle(direction), height / 2), translate(center, angle(direction), -height / 2));
        this.poly = new Envelope(this.support, width, 0).poly
        this.border = this.poly.segments[2]
    }


    draw(ctx) {
        // this.poly.draw(ctx, { fill: "red" })
        this.border.draw(ctx, { width: 5, color: "white" })
        ctx.save()
        ctx.translate(this.center.x, this.center.y)
        ctx.rotate(angle(this.direction) - Math.PI / 2);
        ctx.scale(1, 4)
        ctx.beginPath();
        ctx.textBaseLine = "middle"
        ctx.textAlign = "center"
        ctx.fillStyle = "white"
        ctx.fontSize = "bold" + this.height * 0.3 + "px Arial"
        ctx.fillText("STOP", 0, 3)
        ctx.restore()

    }

}
