'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReceiptsSchema extends Schema {
  up () {
    this.create('requests', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.double('amount');
      table.text('receipt_location')
      table.text('description').notNullable();
      table.boolean('request_finished');
      table.timestamps()
    })
  }

  down () {
    this.drop('requests')
  }
}

module.exports = ReceiptsSchema
