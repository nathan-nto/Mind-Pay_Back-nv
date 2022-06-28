"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SalaryBaseUserSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.string("pix", 120);
      table.double("base_salary");
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.dropColumn("pix");
      table.dropColumn("base_salary");
    });
  }
}

module.exports = SalaryBaseUserSchema;
