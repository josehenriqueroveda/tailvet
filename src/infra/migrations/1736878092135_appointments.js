/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("appointments", {
    id: "id",
    pet_id: {
      type: "integer",
      notNull: true,
      references: "pets",
      onDelete: "RESTRICT",
    },
    appointment_date: {
      type: "date",
      notNull: true,
      default: pgm.func("current_date"),
    },
    appointment_type: {
      type: "varchar(50)",
      notNull: true,
      comment: "Consulta ou Retorno",
    },
    main_complaint: { type: "text" },
    anamnesis: { type: "text" },
    temperature: { type: "decimal(4, 1)" },
    weight: { type: "decimal(4, 1)" },
    neurological_system: { type: "text" },
    digestive_system: { type: "text" },
    cardiorespiratory_system: { type: "text" },
    urinary_system: { type: "text" },
    diagnosis: { type: "text" },
    observations: { type: "text" },
    return_date: { type: "date" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("appointment_services", {
    id: "id",
    appointment_id: {
      type: "integer",
      notNull: true,
      references: "appointments",
      onDelete: "CASCADE",
    },
    service_name: { type: "varchar(255)", notNull: true },
    service_price: { type: "decimal(6, 2)", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
