class Stop extends Marking{
    constructor(center, direction, width, height) {
        super(center, direction, width, height) 

        this.border = this.poly.segments[2]
        this.type = "stop"
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
