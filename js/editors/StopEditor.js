class StopEditor {
    constructor(viewPort, world) {
        this.viewPort = viewPort
        this.canvas = this.viewPort.canvas;
        this.world = world
        this.markings = world.markings
        this.ctx = this.canvas.getContext("2d")
        this.mouse = null
        this.intent = null

        this.mouseDownFunction = () => { }
        this.mouseUpFunction = () => { }
        this.mouseMoveFunction = () => { }
    }

    #handleMouseUp(event) {
        this.dragging = false;
        if (event.button == 2) {
            if (this.toBeRemoved && this.hovered) {
                this.graph.removePoint(this.hovered)
            }
            else {
                this.hovered = null
                this.selected = null
            }
            this.hovered = null
            this.toBeRemoved = null;
        }
    }

    #removeEventListeners() {

        this.canvas.removeEventListener("mousedown", this.mouseDownFunction);
        this.canvas.removeEventListener("mousemove", this.mouseMoveFunction)
        this.canvas.removeEventListener("mouseup", this.mouseUpFunction)
        this.mouseDownFunction = () => { }
        this.mouseUpFunction = () => { }
        this.mouseMoveFunction = () => { }
    }

    #selectPoint(point) {
        if (this.selected) {
            const s = new Segment(this.selected, point)
            this.graph.tryAddSegment(s)
        }
        this.selected = point;
    }

    #handleMouseMove(event) {
        this.mouse = this.viewPort.getMouse(event, true)
        const seg = getNearestSegment(this.mouse, this.world.laneGuides, 10 * this.viewPort.zoom)
        if (seg) {
            const proj = seg.projectPoint(this.mouse)
            if (proj.offset >= 0 || proj.offset <= 1)
                this.intent = new Stop(proj.point, seg.directionVector(), this.world.roadWidth / 2, this.world.roadWidth / 2)
            else
                this.intent = null
        }

        else
            this.intent = null

        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }

    }
    #handleMouseDown(event) {
        if (event.button == 0) {
            if (this.intent) {
                this.markings.push(this.intent)
                this.intent = null
            }
        }
        if (event.button == 2) {
            for (let i = 0; i < this.markings.length; i++) {
                const poly = this.markings[i].poly;
                if (poly.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1)
                    return
                }
            }
        }


    }
    //     this.mouse = this.viewPort.getMouse(event)
    //     if (event.button == 2) {
    //         //right button click
    //         if (this.selected)
    //             this.selected = null
    //         else if (this.hovered) {
    //             this.toBeRemoved = this.hovered;
    //         }
    //     }
    //     if (event.button == 0) {
    //         //left button click
    //         if (this.hovered) {
    //             this.#selectPoint(this.hovered)
    //             this.dragging = true
    //             return
    //         }
    //         this.graph.addPoint(this.mouse)
    //         this.#selectPoint(this.mouse)
    //         this.hovered = this.mouse;
    //     }
    // }



    #addEventListeners() {
        this.mouseDownFunction = this.#handleMouseDown.bind(this)
        this.mouseUpFunction = this.#handleMouseUp.bind(this)
        this.mouseMoveFunction = this.#handleMouseMove.bind(this)
        this.canvas.addEventListener("mousedown", this.mouseDownFunction);
        this.canvas.addEventListener("mousemove", this.mouseMoveFunction)
        this.canvas.addEventListener("mouseup", this.mouseUpFunction)

    }

    enable() {
        this.#addEventListeners()
    }
    disable() {
        this.#removeEventListeners()
        this.hovered = false
        this.selected = false
    }

    display() {
        if (this.intent) {
            this.intent.draw(this.ctx)
        }
    }


}