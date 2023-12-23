class StartEditor extends MarkingEditor {
    constructor(viewPort, world) {
        super(viewPort, world, world.laneGuides)
    }
    createMarking(center, direction) {
        return new Start(center, direction, this.world.roadWidth / 2, this.world.roadWidth / 2)
    }
}