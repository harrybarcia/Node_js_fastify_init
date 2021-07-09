const fastifyPlugin = require ('fastify-plugin')

async function dbConnector (fastify,options){



//connexion à la bande de données.
fastify.register(require("fastify-mongodb"), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
  
    url: "mongodb://localhost:27017/superheroes",
  })

}

module.exports=fastifyPlugin(dbConnector)