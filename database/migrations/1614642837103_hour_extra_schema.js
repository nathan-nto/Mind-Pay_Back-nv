"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class HourExtraSchema extends Schema {
  up() {
    this.table("requests", (table) => {
      // alter table
      table.double("extra_hour");
    });
  }

  down() {
    this.table("requests", (table) => {
      // reverse alternations
      table.dropColumn("extra_hour");
    });
  }
}

module.exports = HourExtraSchema;
