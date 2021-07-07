// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const { ObjectId } = require("mongodb");

//connexion à la bande de données.
fastify.register(require("fastify-mongodb"), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,

  url: "mongodb://localhost:27017/superheroes",
});

// Declare a route
fastify.get("/", async (request, reply) => {
  return "HELLO RLD";
});
/* const avengers= ["Captain America", "Thor","Loki"]
fastify.get('/heroes', () => {
  return avengers
}) */

const moi = { prenom: "harry", nom: "brcia", profession: "dev" };
fastify.get("/me", () => {
  return moi;
});

/* fastify.get('/heroes', async () => {
  
  const collection=fastify.mongo.db.collection("heroes")
  
  const result=await collection.find({}).toArray()
  return result
}) */

//obtiens le héros ayant un id 69
/* fastify.get('/heroes/:heroesId', async (request,reply) => {
  console.log({
    id:request.id,
    params:request.params
  
  })
//   const heroesId=request.params.heroesId
 
const {heroesId}=request.params
const collection=fastify.mongo.db.collection("heroes")
const result=await collection.findOne({
    _id:new ObjectId(heroesId)//transforme ma chaine de caractère. C'est une "classe", instance d'un objet.
  })
  return result
}) */

//heroes/bio/id
// cette route devra retourner: nomduhero connu sous le nom de vrainom.
// je suis né à lieu de naissance. J'ai xx en intelligence et yy en vitesse

fastify.get("/heroes/bio/:heroesId", async (request, reply) => {
  const collection = fastify.mongo.db.collection("heroes");
  const { heroesId } = request.params;
  const result = await collection.findOne({
    _id: new ObjectId(heroesId), // je crée une nouvelle instance de la classe
  });
  const {
    name,
    biography,
    powerstats: { intelligence, speed },
  } = result; // equivalent à
  // const name=result.name
  // const biography= result.biography etc

  // template literals
  return `${name} connu sous le nom de ${biography["full-name"]} . Je suis né à ${biography["place-of-birth"]}J'ai ${intelligence} en intelligence et ${speed} en vitesse`;
});

fastify.post("/heroes", async (request, reply) => {
  console.log(request.body);
  const collection = fastify.mongo.db.collection("heroes");
  console.log(collection);
  const result = await collection.insertOne(request.body);
  return result.ops[0];
});



fastify.delete("/heroes/bio/:heroesId", async (request, reply) => {
  const collection = fastify.mongo.db.collection("heroes");
  const { heroesId } = request.params;
const result= await collection.findOneAndDelete({
  _id:new ObjectId(heroesId)
})
return result
  });

  // PUT Patch
  fastify.patch("/heroes/:id", async (request, reply) => {
    const collection=fastify.mongo.db.collection("heroes")
    const {id} =request.params
    const result=await collection.findOneAndUpdate({_id:new ObjectId(id)},{$set:request.body},{returnDocument:'after'})
return result
    })


/* console.table(avengers)
 */ // Run the server!
const start = async () => {
  try {
    await fastify.listen(4000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

const student = "Siham";
const age = 18;

const data = {
  student,
  age,
};

fastify.get("/siham", () => {
  return data;
});
