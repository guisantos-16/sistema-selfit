/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('tv', function (table) {
        table.increments('tv_id').primary();
        table.integer('unidade_id').unsigned().notNullable();
        table.string('estado', 50).notNullable();
        table.string('nome', 150).notNullable();
        table.string('id_eletromidia', 100).unique().notNullable();
        table.string('marca', 50).notNullable();
        table.string('modelo', 50).notNullable();
        table.date('data_garantia').notNullable();
        table.string('status', 30).notNullable();

        // Chave estrangeira
        table.foreign('unidade_id')
            .references('unidade_id')
            .inTable('unidades')
            .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('tv');
};