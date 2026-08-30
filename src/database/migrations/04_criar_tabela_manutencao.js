exports.up = function (knex) {
    return knex.schema.createTable('manutencao', (table) => {
        table.increments('id_manutencao').primary();

        // Chave Estrangeira para equipamentos
        table.integer('id_equipamento').unsigned().notNullable();
        table.foreign('id_equipamento').references('id_equipamento').inTable('equipamentos');

        // Chave Estrangeira para usuarios
        table.integer('id_usuario_abertura').unsigned().nullable();
        table.foreign('id_usuario_abertura').references('id_usuario').inTable('usuarios');

        table.string('descricao_problema', 255).notNullable();
        table.datetime('data_abertura').notNullable().defaultTo(knex.fn.now());
        table.datetime('data_conclusao');
        table.string('status_manutencao', 25).notNullable().defaultTo('aberto');
        table.decimal('custo', 10, 2).defaultTo(0.00);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('manutencao');
};
