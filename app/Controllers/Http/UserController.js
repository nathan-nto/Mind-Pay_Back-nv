"use strict";

const User = use("App/Models/User");
const Env = use("Env");

class UserController {
  async getAll({ request, response }) {
    // const users = await User.query().where('is_admin', null).forPage(1, 10).fetch();
    const users = await User.query().where("is_admin", null).fetch();

    response.send(users);
  }

  async getOne({ request, response, auth, params }) {
    const id = params.id || auth.jwtPayload.uid;
    const user = await User.find(id);

    if (auth.jwtPayload.uid === user.id) {
      const date = new Date(user.data_de_nascimento)
        .toLocaleString("PT-BR")
        .split(" ");

      user.data_de_nascimento = date[0];
    }

    return user;
  }

  async update({ request, response, auth, params }) {
    try {
      const id = params.id || auth.jwtPayload.uid;
      const user = await User.find(id);

      user.name = request.body.name;
      user.profile_image = request.body.file;
      user.profile_image = request.body.cpf;
      user.nickname = request.body.nickname;
      user.account = request.body.account;
      user.agency_number = request.body.agency_number;
      user.base_salary = request.body.base_salary;
      user.pix =  request.body.pix;
      user.data_de_nascimento = request.body.data_de_nascimento;
      if (request.body.data_de_nascimento) {
        user.data_de_nascimento = await request.body.data_de_nascimento
          .split("/")
          .reverse()
          .join("-");
      }
      user.bank = request.body.bank;
      user.token_user = request.body.token_user;
      user.password = request.body.password || undefined;

      if (params.id == undefined) {
        
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();

        let currentDate = (date + '-' + month + '-' + year);

        user.mindversario = currentDate;
        user.finished_registration = true;
      }
  
      user.save();

      response.send("Usuário atualizado com sucesso!");
    } catch (ex) {
      return response.status(500).send(ex.message);
    }
  }

  async destroy({ request, response, params }) {
    try {
      const { id } = params;

      const _user = await User.find(id);
      await _user.delete();

      response.send("Usuário excluido com sucesso!");
    } catch (ex) {
      response.status(500).send(ex.message);
    }
  }

  async updatePicture({ request, response, auth, params }) {
    try {
      const id = params.id || auth.jwtPayload.uid;

      const data = {
        profile_image: request.body.file,
      };

      await User.query().where("id", id).update(data);

      console.log(data);
      return response.status(200).send("Foto de perfil atualizado com sucesso");
    } catch (ex) {
      return response.status(500).send(ex.message);
    }
  }
}

module.exports = UserController;
