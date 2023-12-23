class Start extends Marking{
    constructor(center, direction, width, height) {
        super(center, direction, width, height) 
        this.img = new Image()
        this.img.src = "car.png"
        this.type = "start"

    }

    

    draw(ctx) {
        ctx.save()
        ctx.translate(this.center.x, this.center.y)
        ctx.rotate(angle(this.direction));
        ctx.drawImage(this.img,-this.img.width/2,-this.img.height/2)
        ctx.restore()

    }

}
