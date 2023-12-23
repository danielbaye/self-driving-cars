class Marking {
    constructor(center, direction, width, height) {
        this.center = center
        this.direction = direction
        this.width = width
        this.height = height
        this.support = new Segment(translate(center, angle(direction), height / 2), translate(center, angle(direction), -height / 2));
        this.poly = new Envelope(this.support, width, 0).poly
        this.type = "marking"
    }

    static load(info) {
        const point = new Point(info.center.x, info.center.y)
        const direction = new Point(info.direction.x, info.direction.y)
        switch (info.type) {
            case "crossing":
                return new Crossing(point, direction, info.width, info.height)
            case "stop":
                return new Stop(point, direction, info.width, info.height)
            case "start":
                return new Start(point, direction, info.width, info.height)
                default:
                    return new Marking(point, direction, info.width, info.height)

            
        }
    }

    draw(ctx) {
        this.poly.draw(ctx)


    }

}
