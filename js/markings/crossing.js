class Crossing extends Marking {
    constructor(center, direction, width, height) {
        super(center, direction, width, height) 

        this.border = [this.poly.segments[2],this.poly.segments[0]]
        this.type = "crossing"

    }


    draw(ctx) {
        const perp = prependicular(this.direction)
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
            )


        line.draw(ctx,{width:this.height,color:"white",dash:[11,11]})
        
    }

}
