exports.up = function (knex) {
    return knex.schema.createTable('usuarios', (table) => {
        table.increments('id_usuario').primary();
        table.string('nome', 50).notNullable();
        table.string('sobrenome', 50).notNullable();
        table.string('usuario', 50).notNullable().unique();
        table.text('senha_hash').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('usuarios');
};
