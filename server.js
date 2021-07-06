// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
//connexion à la bande de données.
fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  
  url: 'mongodb://localhost:27017/superheroes'
})

// Declare a route
fastify.get('/', async (request, reply) => {
  return "HELLO RLD"
})
const avengers= ["Captain America", "Thor","Loki"]
fastify.get('/heroes', () => {
  return avengers
})

const moi={prenom:"harry",nom:"brcia",profession:"dev"}
fastify.get('/me', () => {
  return moi
})


fastify.post('/heroes', (request,reply) => {
  console.log(request.body)
  const collection=fastify.mongo.db.collection("heroes")
  console.log(collection)
  collection.insertOne(request.body)
  return null
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