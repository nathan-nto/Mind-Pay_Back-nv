"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");
const Env = use("Env");

class User extends Model {
  // static get computed() {
  //   return ["url"];
  // }

  // getUrl({ profile_image }) {
  //   return `${Env.get("APP_URL")}/media/${profile_image}`;
  // }

  static boot() {
    super.boot();

    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  receipts() {
    return this.belongsTo("App/Models/Receipt");
  }
}

module.exports = User;
