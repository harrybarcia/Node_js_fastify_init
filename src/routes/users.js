async function routes(fastify,options){

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
}); */

// Une route qui me permette de récupérer tout les utilisateurs
fastify.get('/users', async () => {
  
  const collection=fastify.mongo.db.collection("users")
  
  const result=await collection.find({}).toArray()
  return result
})

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
  })
}
  module.exports=routes