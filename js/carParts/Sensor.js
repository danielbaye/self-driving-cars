class Sensor {

    constructor(car) {
        this.car = car
        this.rayCount = 5
        this.rayLength = 100
        this.raySpread = Math.PI / 2

        this.rays = []
        this.touches = []


    }

    #castRays() {
        this.rays = []
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(this.car.angle + this.raySpread / 2, this.car.angle - this.raySpread / 2, i / (this.rayCount - 1))
            const start = this.car.location
            const end = translate(start, rayAngle, this.rayLength)
            this.rays.push(new Segment(start, end))

        }
    }

    #getReadings(roadBorders,traffic) {
        this.touches.length = 0
        for (const ray of this.rays) {
            let touches = [];
            for (const brdr of roadBorders.segments) {
                const touch = getIntersection(ray.p1,ray.p2, brdr.p1,brdr.p2)
                if (touch)
                    touches.push(touch)
            }
            if (traffic)
            for (const trcf of traffic){
                for (const trfcSeg of trcf.envelope.poly.segments) {
                    const touch = getIntersection(ray.p1,ray.p2, trfcSeg.p1,trfcSeg.p2)
                    if (touch)
                        touches.push(touch)
                }
            }
            if (touches.length > 0) {
                const minOffset = Math.min(...touches.map(t => t.offset))
                this.touches.push(touches.find(t => t.offset == minOffset))
            }
        }

    }

    update(roadBorders,traffic) {
        this.#castRays()
        this.#getReadings(roadBorders,traffic)

    }
    draw(ctx) {
        // console.log(this.car.angle,this.rays.map(e=>angle(subtract(e.p1,e.p2))))
        for (const seg of this.rays) {
            seg.draw(ctx, { color: "yellow", })
        }
        for (const touch of this.touches) {
            const touchPoint = new Point(touch.x, touch.y)
            touchPoint.draw(ctx, { color: "orange", size: 5 })
        }
    }
}