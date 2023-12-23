class CrossingEditor extends MarkingEditor {
    constructor(viewPort, world) {
        super(viewPort, world, world.graph.segments)

    }
    createMarking(center, direction) { return new Crossing(center, direction, this.world.roadWidth, this.world.roadWidth / 2) }
}