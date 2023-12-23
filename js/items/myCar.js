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
        this.envelope = new Envelope(new Segment(new Point(location.x, location.y + height / 2), new Point(location.x, location.y - height / 2)), width, 1)
        this.controlType = controlType
        if (this.controlType == "DUMMY")
            this.color = getRandomColor()
        else {
            this.controls = new Controls()
            this.color = "blue"
        }

    }


    #move() {
        if (this.controlType == "DUMMY")
            this.speed = add(this.speed, scale(angleToPoint(this.angle), this.acceleration))
        else {
            if (this.controls.forward) this.speed = add(this.speed, scale(angleToPoint(this.angle), this.acceleration))
            if (this.controls.reverse) this.speed = subtract(this.speed, scale(angleToPoint(this.angle), this.acceleration))

            if (this.controls.left && angleDiff(this.angle, this.destAngle) < this.maxAngle) this.destAngle -= this.torque
            if (this.controls.right && angleDiff(this.angle, this.destAngle) > -this.maxAngle) this.destAngle += this.torque
        }
        this.location = add(this.speed, this.location)
        if (Math.abs(this.location.x) / 2 > this.viewPort.canvas.width) {
            this.location = new Point(-this.location.x, this.location.y)
        }
        if (Math.abs(this.location.y) / 2 > this.viewPort.canvas.height) {
            this.location = new Point(this.location.x, -this.location.y)
        }
        this.angle -= angleDiff(this.angle, this.destAngle) * this.changeAngleRate * magnitude(this.speed)
        // const angleFriction = Math.min(Math.abs(angleDiff(this.angle, angle(this.speed))), Math.abs(angleDiff(Math.PI + this.angle, angle(this.speed))))

        // console.log(Math.abs(angleDiff(this.angle, angle(this.speed))), Math.abs(angleDiff(Math.PI + this.angle, angle(this.speed))), angleFriction)

        this.speed.x -= tanhScalarScale(this.speed.x, this.friction, this.maxSpeed) //* (1 + 10 * angleFriction)
        this.speed.y -= tanhScalarScale(this.speed.y, this.friction, this.maxSpeed) //* (1 + 10 * angleFriction)
    }

    #createEnvelope() {
        this.envelope = new Envelope(new Segment(
            translate(this.location, this.angle, this.height),
            translate(this.location, this.angle, -this.height)),
            this.width,
            1)
    }

    #assessDamage(roadBorders,traffic) {
        let damaged = false
        if (traffic)
        for (const trcf of traffic){
            if (this.envelope.poly.intesectsPoly(trcf.envelope.poly))
            damaged = true
        }
        if (this.envelope.poly.intesectsPoly(roadBorders)){
            damaged = true
        }
        this.damaged =  damaged 
    }

    update(roadBorders,traffic) {
        if (!this.damaged) {
            this.#move()
            this.#createEnvelope()
            this.#assessDamage(roadBorders,traffic)
        }
        this.sensor.update(roadBorders,traffic)


    }

    draw(ctx) {
        // this.location.draw(ctx, { size: 40, color: "purple" })
        if (this.damaged)
            this.envelope.draw(ctx, { fill: "grey", stroke: "black", lineWidth: 2 })
        else
            this.envelope.draw(ctx, { fill: this.color, stroke: "black", lineWidth: 1 })

        const destAngle = translate(this.location, this.destAngle, this.height * 2)
        if (this.controlType != "DUMMY") {
            destAngle.draw(ctx, { size: 5, color: "blue" })
            this.sensor.draw(ctx)
        }
    }
}