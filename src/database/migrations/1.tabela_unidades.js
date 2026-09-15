/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('unidades', function (table) {
    table.increments('unidade_id').primary();
    table.string('nome', 150).notNullable();
    table.string('cep', 10).notNullable();
    table.string('uf', 2).notNullable();
    table.string('cidade', 100).notNullable();
    table.string('rua', 150).notNullable();
    table.string('numero', 20).notNullable();
    table.string('bairro', 100).notNullable();
    table.string('cnpj', 20).unique().notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('unidades');
};