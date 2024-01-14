import { Router } from "express";
import userModel from "../daos/models/user.model.js";
import cookieParser from "cookie-parser";
import session from "express-session";
const router = Router();

//Register
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  console.log("Registrando usuario:");
  console.log(req.body);

  //Validamos si el user existe en la DB
  const exist = await userModel.findOne({ email });
  if (exist) {
    return res
      .status(400)
      .send({ status: "error", message: "Usuario ya existe!" });
  }
  const user = {
    first_name,
    last_name,
    email,
    age,
    password, //se encriptara despues...
  };

  const result = await userModel.create(user);
  res.send({
    status: "success",
    message: "Usuario creado con extito con ID: " + result.id,
  });
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, password });

  if (!user) {
      // Si las credenciales son incorrectas, enviar una respuesta de error.
      return res.status(401).send({ status: 'error', error: "Incorrect credentials" });
  } 

  // Si el usuario se autentica correctamente, establecer una cookie y luego redirigir o renderizar.
  
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age
  }

  res.redirect('/products');
});





export default router;