/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('manutencao', function (table) {
        table.increments('manutencao_id').primary();
        table.integer('unidade_id').unsigned().notNullable();
        table.integer('tv_id').unsigned().nullable();
        table.integer('camera_id').unsigned().nullable();
        table.integer('equipamento_id').unsigned().nullable();
        table.string('estado', 50).notNullable();
        table.string('tipo', 50).notNullable();
        table.date('data').notNullable();
        table.decimal('custo', 10, 2).defaultTo(0.00);
        table.text('descricao').notNullable();

        // Chaves estrangeiras
        table.foreign('unidade_id')
            .references('unidade_id')
            .inTable('unidades')
            .onDelete('CASCADE');

        table.foreign('tv_id')
            .references('tv_id')
            .inTable('tv')
            .onDelete('CASCADE');

        table.foreign('camera_id')
            .references('camera_id')
            .inTable('cameras')
            .onDelete('CASCADE');

        table.foreign('equipamento_id')
            .references('equipamento_id')
            .inTable('equipamentos')
            .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('manutencao');
};