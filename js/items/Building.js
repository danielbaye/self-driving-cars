class Building {
    constructor(poly, hightCoef = 0.3, maxHeight = 200) {
        this.base = poly
        this.hightCoef = hightCoef
        this.maxHeight = maxHeight * 10
        //also add roofs

    }

    draw(ctx, viewPoint) {
        const TopPoints = this.base.points.map(p => {
            const diff = subtract(p, viewPoint)
            // const norm = scale(normalize(sub), this.maxHight);
            // const coefficientSub = scale(sub, this.hightCoef)
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
        sides.sort((a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint))
        this.base.draw(ctx, { fill: "white", stroke: "grey" })
        for (const side of sides) {
            side.draw(ctx, { fill: "white", stroke: "grey" })
        }
        ceiling.draw(ctx, { fill: "white", stroke: "grey" })
    }


}