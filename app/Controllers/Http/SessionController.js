"use strict";

const User = use("App/Models/User");
const Helpers = use("Helpers");
const Encryption = use("Encryption");
const Mail = use("Mail");
const Env = use("Env");

class SessionController {
  async register({ request, response, auth }) {
    try {

      const pass = Math.random().toString(36).substring(3);
      //const pass = "123";


      const { name, email, password = pass, cpf } = request.body;
      let profile_image = request.body.file;

      const user = await User.create({
        name,
        email,
        password,
        cpf,
        profile_image,
      });

      const _auth = await auth.attempt(cpf, pass);
      console.log('chegou')
      const resp = await Mail.send(
        "emails.welcome",
        { name, pass },
        (message) => {
          message
            .to(user.email)
            .from("mindpay@mindconsulting.com.br")
            .subject("Bem vindo ao MindPay!");
        }
      );
      console.log(resp);
      return response.json({ user, token: `Bearer ${_auth.token}` });
    } catch (ex) {
      console.log(ex);
      response.status(405).send("Um usuário ja existe com esse Email ou CPF");
    }
  }

  async login({ request, response, auth }) {
    try {
      const { cpf, password, token_user } = request.body;

      const user = await User.query().where("cpf", cpf).first();
      if (token_user) {
        user.token_user = await request.body.token_user;
        user.save();
      }

      const _auth = await auth.attempt(cpf, password);

      if (user.data_de_nascimento) {
        user.data_de_nascimento = new Date(
          user.data_de_nascimento
        ).toLocaleString("PT-BR", { hour12: false });
      }
      return response.send({ user, token: `Bearer ${_auth.token}` });
    } catch (ex) {
      console.log(ex);
      response.status(401).send("Usuario ou senha incorretos!");
    }
  }

  async loginAsAdmin({ request, response, auth }) {
    try {
      const { cpf, password } = request.body;

      const user = await User.query().where("cpf", cpf).first();

      if (!user.is_admin) {
        throw new Error("CPF ou senha incorreta!");
      }

      const _auth = await auth.attempt(cpf, password, {
        isAdmin: Boolean(user.is_admin),
      });
      return response.send({ user, token: `Bearer ${_auth.token}` });
    } catch (ex) {
      response.status(401).send("Usuario ou senha incorretos!");
    }
  }
}

module.exports = SessionController;
