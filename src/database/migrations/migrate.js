/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Tabela Unidades
    await knex.schema.createTable('unidades', (table) => {
        table.increments('id').primary();
        table.string('nome', 100).notNullable();
        table.string('cnpj', 20).unique().notNullable();
        table.string('cep', 10);
        table.string('uf', 2);
        table.string('bairro', 100);
        table.string('rua', 150);
        table.string('numero', 20);
    });

    // 2. Tabela Usuarios
    await knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();
        table.string('usuario', 100).notNullable();
        table.string('senha_hash', 255).notNullable();
        // Feature futura mantida comentada conforme o schema
        // table.boolean('senha_provisoria').notNullable().defaultTo(true);
    });

    // 3. Tabela Equipamentos
    await knex.schema.createTable('equipamentos', (table) => {
        table.bigIncrements('id').primary();
        table.integer('unidade_id').unsigned().notNullable();
        table.string('nome_identificacao', 100).notNullable();
        table.string('categoria', 50).notNullable();
        table.string('marca', 50).notNullable();
        table.string('modelo', 50).notNullable();
        table.string('numero_serie', 100).unique().notNullable();
        table.string('placa_patrimonio', 100).unique().notNullable();
        table.string('localizacao', 100).notNullable();
        table.string('status', 50).notNullable().defaultTo('ATIVO');
        table.date('data_garantia').notNullable();
        table.string('endereco_ip', 45);
        table.string('mac_address', 17);

        // Chave estrangeira
        table.foreign('unidade_id').references('unidades.id');
    });

    // 4. Tabela Manutenções
    await knex.schema.createTable('manutencoes', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('equipamento_id').unsigned().notNullable();
        table.text('descricao').notNullable();
        table.date('data_envio').notNullable();
        table.date('data_retorno');
        table.string('status_manutencao', 50).notNullable().defaultTo('ABERTA');

        // Chave estrangeira
        table.foreign('equipamento_id').references('equipamentos.id');
    });

    // 5. Índices de Otimização
    await knex.schema.alterTable('equipamentos', (table) => {
        table.index('categoria', 'idx_equip_categoria');
        table.index(['categoria', 'data_garantia'], 'idx_equip_garantia');
    });

    await knex.schema.alterTable('manutencoes', (table) => {
        table.index(['status_manutencao', 'equipamento_id'], 'idx_manutencoes_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Ordem reversa para exclusão correta respeitando as FKs
    await knex.schema.alterTable('manutencoes', (table) => {
        table.dropIndex([], 'idx_manutencoes_status');
    });

    await knex.schema.alterTable('equipamentos', (table) => {
        table.dropIndex([], 'idx_equip_garantia');
        table.dropIndex([], 'idx_equip_categoria');
    });

    await knex.schema.dropTableIfExists('manutencoes');
    await knex.schema.dropTableIfExists('equipamentos');
    await knex.schema.dropTableIfExists('usuarios');
    await knex.schema.dropTableIfExists('unidades');
};