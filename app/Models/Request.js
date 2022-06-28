"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Env = use("Env");

class Request extends Model {
  // static get computed() {
  //   return ["url"];
  // }

  // getUrl({ receipt_location }) {
  //   return `${Env.get("APP_URL")}/media/${receipt_location}`;
  // }

  users() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Request;
