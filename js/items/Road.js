class Road {
    constructor(x, width, roundness = 9, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        this.roundness = roundness
        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        this.lanes = []
        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            );
            this.lanes.push(new Segment(new Point(x, this.top), new Point(x, this.bottom)))
        }

        const middle = new Segment(new Point(this.x, this.top), new Point(this.x, this.bottom));
        this.borders = new Envelope(middle, width, this.roundness)
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 +
            Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }

    draw(ctx) {

        this.borders.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 })
        for (const seg of this.lanes) {
            seg.draw(ctx, { color: "white", width: 4, dash: [20, 20] })

        }


    }
}