// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const argon2 = require("argon2");
const createError = require("http-errors"); // https://www.npmjs.com/package/http-errors
const jwt = require("fastify-jwt");

/* //connexion à la bande de données.
fastify.register(require("fastify-mongodb"), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,

  url: "mongodb://localhost:27017/superheroes",
}); */

fastify.register(require("fastify-jwt"), {
  secret: "monsupersecretamoi",
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

//connexion a base de donnée apres decoupe
fastify.register(require('./connector.js'))

fastify.register(require('./src/routes/heroes'))

fastify.register(require('./src/routes/users'))


fastify.post("/login", async (request, reply) => {
  // je récupère l'email et le mot de passe entré dans request
  // je cherche si l'utilisateur posssède cet email
  //s'il existe: on vérifie que les passwords correspondent
  //sinon, on génère une erreur
  const { email, password } = request.body
  const collection = fastify.mongo.db.collection("users");
  const userExists = await collection.findOne({ email: email });

  if (!userExists) {
    return createError(400, "Email et/ou mot de passe incorrect");
  }

  console.log(userExists.password);
  const match = await argon2.verify(userExists.password, password);
  if (!match) {
    return createError(400, "Email et/ou mot de passe incorrect");
  }
  // je sais que l'email et le mdp sont corrects, j'envoie un token au client permettant l'authentification

    const token = fastify.jwt.sign({id:userExists._id,role:userExists.role  })

  
  return  {token};
});

fastify.get("/protected", async (request, reply) => {
// si l'utilisateur ne m'envoie pas de token, je dois lui retourner une erreur
//sinon je lui retourneun objet contenant la propriété message avec Bienvenue comme valeur
try {
 const result= await request.jwtVerify()
} catch (err) {
  reply.send(err)
}
return {message:"Bienvenue"}

})

// Une route qui me permette de mettre à jour un utilisateur par son id
// PUT Patch
fastify.patch("/users/:id", async (request, reply) => {
  const collection = fastify.mongo.db.collection("users");
  const { id } = request.params;
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: request.body },
    { returnDocument: "after" }
  );
  return result;
});

// Une route qui me permette de supprimer un utilisateur par son id

fastify.delete("/users/:Id", async (request, reply) => {
  const collection = fastify.mongo.db.collection("users");
  const { Id } = request.params;
  const result = await collection.findOneAndDelete({
    _id: new ObjectId(Id),
  });
  return result;
});

// FIN EXERCICE//

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
