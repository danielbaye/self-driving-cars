class Building {
    constructor(poly, hightCoef = 0.3, maxHeight = 200) {
        this.base = poly
        this.hightCoef = hightCoef
        this.maxHeight = maxHeight * 10
        //also add roofs

    }

    static load(info){
        return new Building(Polygon.load(info.base),info.hightCoef,info.maxHeight)
    }

    draw(ctx, viewPoint) {
        const TopPoints = this.base.points.map(p => {
            const diff = subtract(p, viewPoint)

            return add(p, tanhScale(diff, this.hightCoef, this.maxHeight))
        })
        // const TopPoints = this.base.points.map(p => add(p, scale(subtract(p, viewPoint), this.hightCoef)))
        const ceiling = new Polygon(TopPoints)
        const sides = [];
        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon([this.base.points[i], this.base.points[nextI], TopPoints[nextI], TopPoints[i]])
            sides.push(poly)
        }
        const roof = []
        const roofAverage = average(average(ceiling.points[0], ceiling.points[1]), average(ceiling.points[2], ceiling.points[3]))
        const roofTop = add(roofAverage, tanhScale(subtract(roofAverage, viewPoint), this.hightCoef, this.maxHeight / 2))

        for (let i = 0; i < ceiling.points.length; i++) {
            const nextI = (i + 1) % ceiling.points.length;
            const poly = new Polygon([ceiling.points[i], ceiling.points[nextI], roofTop])
            roof.push(poly)
        }

        sides.sort((a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint))
        this.base.draw(ctx, { fill: "white", stroke: "grey" })
        for (const side of sides) {
            side.draw(ctx, { fill: "white", stroke: "grey" })
        }
        for (const rof of roof)
            rof.draw(ctx, { fill: "red", stroke: "grey" })
        // ceiling.draw(ctx, { fill: "white", stroke: "grey" })
    }


}