class Envelope {
    constructor(skeleton, width, roundness = 9) {
        this.skeleton = skeleton;
        this.poly = this.#generatepolygon(width, roundness)
    }

    #generatepolygon(width, roundness) {
        const { p1, p2 } = this.skeleton;
        const radius = width / 2;
        const alpha = angle(subtract(p1, p2))
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;
        const points = [];
        const step = Math.PI / Math.max(roundness, 1)
        const eps = step / 2

        for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
            points.push(transate(p1, i, radius))

        }
        for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
            points.push(transate(p2, Math.PI + i, radius))

        }
        return new Polygon(points)
    }

    draw(ctx, options) {
        this.poly.draw(ctx, options)
    }

}