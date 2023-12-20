class GraphEditor {
    constructor(viewPort, graph) {
        this.viewPort = viewPort
        this.canvas = this.viewPort.canvas;
        this.graph = graph
        this.ctx = this.canvas.getContext("2d")
        this.mouse = null;
        this.toBeRemoved = null;
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.canvas.addEventListener("contextmenu", event => {
            event.preventDefault()
        })
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

    #handleMouseDown(event) {
        this.mouse = this.viewPort.getMouse(event)
        if (event.button == 2) {
            //right button click
            if (this.selected)
                this.selected = null
            else if (this.hovered) {
                this.toBeRemoved = this.hovered;
            }
        }
        if (event.button == 0) {
            //left button click
            if (this.hovered) {
                this.#selectPoint(this.hovered)
                this.dragging = true
                return
            }
            this.graph.addPoint(this.mouse)
            this.#selectPoint(this.mouse)
            this.hovered = this.mouse;
        }
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

    #handleMouseMove(event) {
        this.mouse = this.viewPort.getMouse(event, true)
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewPort.zoom)

        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }

    }

    #addEventListeners() {
        this.mouseDownFunction = this.#handleMouseDown.bind(this)
        this.mouseUpFunction = this.#handleMouseUp.bind(this)
        this.mouseMoveFunction = this.#handleMouseMove.bind(this)
        this.canvas.addEventListener("mousedown", this.mouseDownFunction);
        this.canvas.addEventListener("mousemove", this.mouseMoveFunction)
        this.canvas.addEventListener("mouseup", this.mouseUpFunction)

    }

    dispose() {
        this.selected = null;
        this.hovered = null;
        this.graph.dispose();
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
        this.graph.draw(this.ctx)
        if (this.toBeRemoved) {
            this.toBeRemoved.draw(this.ctx, { fill: true, color: "red" })
        }
        else if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true })
        }

        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse
            new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true })
        }
    }
}