/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('cameras', function (table) {
        table.increments('camera_id').primary();
        table.integer('unidade_id').unsigned().notNullable();
        table.string('estado', 50).notNullable();
        table.string('nome', 150).notNullable();
        table.string('tipo', 50).notNullable();
        table.string('setor', 100).notNullable();
        table.string('status', 30).notNullable();
        table.string('marca', 50);
        table.string('modelo', 50);

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
    return knex.schema.dropTable('cameras');
};