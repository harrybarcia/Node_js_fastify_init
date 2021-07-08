// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const { ObjectId } = require("mongodb");
const argon2 = require("argon2");
const createError = require("http-errors"); // https://www.npmjs.com/package/http-errors
const jwt = require("fastify-jwt");

//connexion à la bande de données.
fastify.register(require("fastify-mongodb"), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,

  url: "mongodb://localhost:27017/superheroes",
});

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
  const result = await collection.findOneAndDelete({
    _id: new ObjectId(heroesId),
  });
  return result;
});

// PUT Patch
fastify.patch("/heroes/:id", async (request, reply) => {
  const collection = fastify.mongo.db.collection("heroes");
  const { id } = request.params;
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: request.body },
    { returnDocument: "after" }
  );
  return result;
});

// Exercice

// Je souhaite:
// Une route qui me permette de créer un nouvel utilisateur (user) dans une collection users
// 		- email
// 		- password
// 		- role (user/admin)
// Une route qui me permette de récupérer tout les utilisateurs
// Une route qui me permette de récupérer un utilisateur par son id
// Une route qui me permette de mettre à jour un utilisateur par son id
// Une route qui me permette de supprimer un utilisateur par son id

// Une route qui me permette de créer un nouvel utilisateur (user) dans une collection users

/* fastify.get("/users", async (request, reply) => {
  return "HELLO RLD";
});
 */
/* 
fastify.post("/users", async (request, reply) => {
  console.log(request.body);
  const collection = fastify.mongo.db.collection("users");
  console.log(collection);
  const result = await collection.insertOne(request.body);
  return result.ops[0];
});

// Une route qui me permette de récupérer tout les utilisateurs
fastify.get('/users', async () => {
  
  const collection=fastify.mongo.db.collection("users")
  
  const result=await collection.find({}).toArray()
  return result
})
 */
//password

fastify.post("/users", async (request, reply) => {
  try {
    const collection = fastify.mongo.db.collection("users");
    const { email, password, role } = request.body;

    // On récupère l'adresse email dans la request, puis on va chercher dans la bdd si cette derniere existe
    // Si elle existe, on genere une erreur indiquant que l'email existe deja
    // Si non, on ajoute l'utilisateur à notre bdd

    const userExist = await collection.findOne({ email });

    if (userExist) {
      // ⛔️ STOP
      return createError(409, "Cet email est déjà pris");
      // return createError.Conflict(err.message)
    }

    if (password.length < 3) {
      // throw new Error("Mot de passe trop court - au moins 3 caractères")
      return createError.NotAcceptable(
        "Mot de passe trop court - au moins 3 caractères"
      );
    }

    // const password = request.body.password
    const hash = await argon2.hash(password);
    const newUser = {
      email: request.body.email,
      password: hash,
      role: request.body.role,
    };
    const result = await collection.insertOne(newUser);
    // return result.ops[0]
    reply.code(201).send(result.ops[0]);
  } catch (err) {
    console.error(err);
    // reply.code(409).send({
    // 	statusCode: 409,
    // 	error: true,
    // 	message: err.message
    // })
    return createError(500, err.message);
  }
});

// Une route qui me permette de récupérer un utilisateur par son id

//obtiens le héros ayant un id 69
fastify.get("/users/:id", async (request, reply) => {
  //   const heroesId=request.params.heroesId

  const collection = fastify.mongo.db.collection("users");
  const { id } = request.params;
  //const id =request.params.id
  const result = await collection.findOne({
    _id: new ObjectId(id), //transforme ma chaine de caractère. C'est une "classe", instance d'un objet.
  });
  return result.email;
});

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
