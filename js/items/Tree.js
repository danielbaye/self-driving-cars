class Tree {
    constructor(center, size = 10, highCoef = 0.3, maxHeight = 150) {
        this.center = center
        this.size = size;
        this.highCoef = highCoef
        this.maxHeight = maxHeight * 10
        this.base = this.#generateLevel(this.center, size)
    }


    #generateLevel(point, size) {
        const points = []
        const rad = size / 2
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
            const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2
            const noisyRadius = rad * lerp(0.5, 1, kindOfRandom)
            points.push(translate(point, a, noisyRadius))
        }
        return new Polygon(points)
    }
    draw(ctx, viewPoint) {
        const diff = subtract(this.center, viewPoint)

        const top = add(this.center, tanhScale(diff, this.highCoef, this.maxHeight))
        const levelCount = 7;
        for (let level = 0; level < levelCount; level++) {
            const t = level / (levelCount - 1)
            const point = lerp2D(this.center, top, t)
            const color = "rgb(30," + lerp(50, 200, t) + ",70)"
            const size = lerp(this.size, 40, t)
            const poly = this.#generateLevel(point, size)
            // point.draw(ctx, { size: size, color: color })
            poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0)" })

        }

    }
}