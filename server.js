// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async (request, reply) => {
  return "HELLO RLD"
})
const avengers= ["Captain America", "Thor","Loki"]
fastify.get('/heroes', () => {
  return avengers
})
console.table(avengers)
// Run the server!
const start = async () => {
  try {
    await fastify.listen(4000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

const student ="Siham"
const age=18

const data={
  student,
  age,
}

fastify.get('/siham',()=>{
  return data
})