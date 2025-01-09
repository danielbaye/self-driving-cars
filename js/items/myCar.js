class Car {
    constructor(location, width, height, world, viewPort, maxSpeed = 12, angle = 0, controlType = "DUMMY") {
        this.location = location
        this.world = world;
        this.viewPort = viewPort;
        this.height = height
        this.width = width
        this.speed = new Point(0, 0);
        this.destAngle = angle
        this.maxAngle = Math.PI * 0.2
        this.angle = angle;
        this.acceleration = 0.5;
        this.maxSpeed = maxSpeed
        this.torque = Math.PI * 0.01
        this.changeAngleRate = 0.02
        this.damaged = false;
        this.friction = this.acceleration / maxSpeed

        this.sensor = new Sensor(this)
        this.showSensor = false
        this.envelope = new Envelope(new Segment(new Point(location.x, location.y + height / 2), new Point(location.x, location.y - height / 2)), width, 1)
        this.controlType = controlType
        if (this.controlType == "DUMMY")
            this.color = getRandomColor()
        else {
            this.controls = new Controls(this.controlType)
            if (this.controlType == "AI") {
                this.color = "blue"
                this.brain = new NeuralNetwork(
                    [this.sensor.rayCount, 6, 4]
                )
            }
            else {
                this.color = "black"
            }
        }

    }


    #move() {
        if (this.controlType == "DUMMY")
            this.speed = { x: 0, y: -this.maxSpeed }

        else {
            if (this.controls.forward) this.speed = vectorSize(this.speed) < this.maxSpeed ? add(this.speed, scale(angleToPoint(this.angle), this.acceleration)) : this.speed
            if (this.controls.reverse) this.speed = vectorSize(this.speed) < this.maxSpeed ? subtract(this.speed, scale(angleToPoint(this.angle), this.acceleration)) : this.speed

            if (this.controls.left && angleDiff(this.angle, this.destAngle) < this.maxAngle) this.destAngle -= this.torque
            if (this.controls.right && angleDiff(this.angle, this.destAngle) > -this.maxAngle) this.destAngle += this.torque
        }
        this.location = add(this.speed, this.location)
        // if (Math.abs(this.location.x) / 2 > this.viewPort.canvas.width) {
        //     this.location = new Point(-this.location.x, this.location.y)
        // }
        // if (Math.abs(this.location.y) / 2 > this.viewPort.canvas.height) {
        //     this.location = new Point(this.location.x, -this.location.y)
        // }
        this.angle -= angleDiff(this.angle, this.destAngle) * this.changeAngleRate * magnitude(this.speed)
        // const angleFriction = Math.min(Math.abs(angleDiff(this.angle, angle(this.speed))), Math.abs(angleDiff(Math.PI + this.angle, angle(this.speed))))

        // console.log(Math.abs(angleDiff(this.angle, angle(this.speed))), Math.abs(angleDiff(Math.PI + this.angle, angle(this.speed))), angleFriction)

        // this.speed.x -= tanhScalarScale(this.speed.x, this.friction, this.maxSpeed) //* (1 + 10 * angleFriction)
        // this.speed.y -= tanhScalarScale(this.speed.y, this.friction, this.maxSpeed) //* (1 + 10 * angleFriction)
        this.speed.x -= this.speed.x != 0 ? (vectorSize(this.speed) < this.friction ? this.speed.x : Math.sign(this.speed.x) * this.friction) : 0
        this.speed.y -= this.speed.y != 0 ? (vectorSize(this.speed) < this.friction ? this.speed.y : Math.sign(this.speed.y) * this.friction) : 0

    }

    #createEnvelope() {
        this.envelope = new Envelope(new Segment(
            translate(this.location, this.angle, this.height),
            translate(this.location, this.angle, -this.height)),
            this.width,
            1)
    }

    #assessDamage(roadBorders, traffic) {
        let damaged = false
        if (traffic)
            for (const trcf of traffic) {
                if (this.envelope.poly.intesectsPoly(trcf.envelope.poly))
                    damaged = true
            }
        if (this.envelope.poly.intesectsPoly(roadBorders)) {
            damaged = true
        }
        this.damaged = damaged
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move()
            this.#createEnvelope()
            this.#assessDamage(roadBorders, traffic)
        }
        if (this.controlType != "DUMMY") {
            this.sensor.update(roadBorders, traffic)
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset)

            if (this.controlType == "AI") {
                const outputs = NeuralNetwork.FeedForward(offsets, this.brain)

                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]

            }
        }

    }

    draw(ctx, drawSensors = false) {
        // this.location.draw(ctx, { size: 40, color: "purple" })
        if (this.damaged)
            this.envelope.draw(ctx, { fill: "grey", stroke: "black", lineWidth: 2 })
        else
            this.envelope.draw(ctx, { fill: this.color, stroke: "black", lineWidth: 1 })

        const destAngle = translate(this.location, this.destAngle, this.height * 2)
        if (this.sensor && this.showSensor) {
            destAngle.draw(ctx, { size: 5, color: "blue" })
            this.sensor.draw(ctx)
        }
    }
}