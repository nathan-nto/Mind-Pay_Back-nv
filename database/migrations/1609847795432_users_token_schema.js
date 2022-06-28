"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UsersTokenSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.string("token_user", 120);
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.dropColumn("token_user");
    });
  }
}

module.exports = UsersTokenSchema;
