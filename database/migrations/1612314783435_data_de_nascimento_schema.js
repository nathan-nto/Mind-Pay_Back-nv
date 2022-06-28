"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DataDeNascimentoSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.date("data_de_nascimento");
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.dropColumn("data_de_nascimento");
    });
  }
}

module.exports = DataDeNascimentoSchema;
