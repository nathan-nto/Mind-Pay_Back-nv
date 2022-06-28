"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("name", 80).notNullable();
      table.string("nickname", 80).unique();
      table.string("email", 254).notNullable().unique();
      table.string("password", 60).notNullable();
      table.string("cpf").unique();
      table.text("profile_image");
      table.string("agency_number");
      table.string("account");
      table.string("bank");
      table.boolean("is_admin");
      table.boolean("finished_registration").defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
