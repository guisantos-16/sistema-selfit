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
        table.timestamps(true, true);

        // Rigidez: Apenas maiúsculas e sem espaços vazios
        table.check('nome = UPPER(nome) AND nome = TRIM(nome) AND LENGTH(TRIM(nome)) > 0');
        table.check('cnpj = UPPER(cnpj) AND cnpj = TRIM(cnpj) AND LENGTH(TRIM(cnpj)) > 0');
    });

    // 2. Tabela Usuarios
    await knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();
        table.string('usuario', 100).unique().notNullable();
        table.string('senha_hash', 255).notNullable();
        table.boolean('senha_provisoria').notNullable().defaultTo(true);
        table.timestamps(true, true);

        table.check('usuario = UPPER(usuario) AND usuario = TRIM(usuario) AND LENGTH(TRIM(usuario)) > 0');
    });

    // 3. Tabela Equipamentos
    await knex.schema.createTable('equipamentos', (table) => {
        table.bigIncrements('id').primary();

        table.integer('unidade_id').unsigned().notNullable()
            .references('id')
            .inTable('unidades')
            .onDelete('RESTRICT');

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

        // Soft Delete ativado
        table.timestamp('deleted_at').nullable();
        table.timestamps(true, true);

        // Regras de rigidez de dados
        table.check('nome_identificacao = UPPER(nome_identificacao) AND nome_identificacao = TRIM(nome_identificacao) AND LENGTH(TRIM(nome_identificacao)) > 0');
        table.check('categoria = UPPER(categoria) AND categoria = TRIM(categoria) AND LENGTH(TRIM(categoria)) > 0');
        table.check('marca = UPPER(marca) AND marca = TRIM(marca) AND LENGTH(TRIM(marca)) > 0');
        table.check('modelo = UPPER(modelo) AND modelo = TRIM(modelo) AND LENGTH(TRIM(modelo)) > 0');
        table.check('numero_serie = UPPER(numero_serie) AND numero_serie = TRIM(numero_serie) AND LENGTH(TRIM(numero_serie)) > 0');
        table.check('placa_patrimonio = UPPER(placa_patrimonio) AND placa_patrimonio = TRIM(placa_patrimonio) AND LENGTH(TRIM(placa_patrimonio)) > 0');
        table.check('localizacao = UPPER(localizacao) AND localizacao = TRIM(localizacao) AND LENGTH(TRIM(localizacao)) > 0');
        table.check('status = UPPER(status) AND status = TRIM(status) AND LENGTH(TRIM(status)) > 0');
    });

    // 4. Índices Parciais para Equipamentos Ativos (Performance para Soft Delete)
    // O banco indexará apenas os registros onde deleted_at é NULL, mantendo as buscas rápidas
    await knex.raw(`CREATE INDEX idx_equip_nome ON equipamentos (nome_identificacao) WHERE deleted_at IS NULL;`);
    await knex.raw(`CREATE INDEX idx_equip_serie ON equipamentos (numero_serie) WHERE deleted_at IS NULL;`);
    await knex.raw(`CREATE INDEX idx_equip_patrimonio ON equipamentos (placa_patrimonio) WHERE deleted_at IS NULL;`);
    await knex.raw(`CREATE INDEX idx_equip_categoria ON equipamentos (categoria) WHERE deleted_at IS NULL;`);
    await knex.raw(`CREATE INDEX idx_equip_garantia_cat ON equipamentos (categoria, data_garantia) WHERE deleted_at IS NULL;`);

    // 5. Tabela Manutenções
    await knex.schema.createTable('manutencoes', (table) => {
        table.bigIncrements('id').primary();

        table.bigInteger('equipamento_id').unsigned().notNullable()
            .references('id')
            .inTable('equipamentos')
            .onDelete('CASCADE');

        table.text('descricao').notNullable();
        table.date('data_envio').notNullable();
        table.date('data_retorno').nullable();
        table.decimal('custo', 10, 2).nullable();
        table.string('status_manutencao', 50).notNullable().defaultTo('ABERTA');

        table.timestamps(true, true);

        table.index(['status_manutencao', 'equipamento_id'], 'idx_manutencoes_status');

        table.check('descricao = UPPER(descricao) AND descricao = TRIM(descricao) AND LENGTH(TRIM(descricao)) > 0');
        table.check('status_manutencao = UPPER(status_manutencao) AND status_manutencao = TRIM(status_manutencao) AND LENGTH(TRIM(status_manutencao)) > 0');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('manutencoes');
    await knex.schema.dropTableIfExists('equipamentos');
    await knex.schema.dropTableIfExists('usuarios');
    await knex.schema.dropTableIfExists('unidades');
};