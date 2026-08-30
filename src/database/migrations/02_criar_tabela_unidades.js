exports.up = function (knex) {
    return knex.schema.createTable('unidades', (table) => {
        table.increments('id_unidade').primary();
        table.string('nome_unidade', 100).notNullable();
        table.string('uf', 2).notNullable();
        table.string('cnpj', 18).notNullable().unique();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('unidades');
};
