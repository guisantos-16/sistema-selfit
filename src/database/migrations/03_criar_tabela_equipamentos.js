exports.up = function (knex) {
    return knex.schema.createTable('equipamentos', (table) => {
        table.increments('id_equipamento').primary();
        table.string('nome_equipamento', 100).notNullable();
        table.string('marca', 100).notNullable();

        // Chave Estrangeira ligada à tabela 'unidades'
        table.integer('id_unidade').unsigned().notNullable();
        table.foreign('id_unidade').references('id_unidade').inTable('unidades');

        table.string('numero_serie', 50);
        table.string('numero_patrimonio', 50).notNullable().unique();
        table.string('status_equipamento', 25).notNullable().defaultTo('ativo');
        table.string('categoria', 25).notNullable();
        table.string('localizacao_interna', 50).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('equipamentos');
};
