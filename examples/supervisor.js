let { Actor, ActorSystem, ActorSystemConfigurationBuilder } = require('../dist/index')

class Clock extends Actor {
    constructor(times, message) {
        super()

        this.times = times
        this.timer = this.schedule(250, this.tick, [message])
    }

    async tick(message) {
        console.log(this.times, "From clock ", this.id, " message:", message)
        if (Math.random() < 0.5) {
            throw 'random failure'
        }

        if (--this.times <= 0) {
            this.cancel(this.timer)
        }
    }
}

let system = ActorSystem.for(ActorSystemConfigurationBuilder.define()
    .withTopSupervisor(() => "retry-message")
    .done())

system.actorOf(Clock, [10, "Actors are cool"])

setTimeout(() => {
    system.free()
}, 3000)