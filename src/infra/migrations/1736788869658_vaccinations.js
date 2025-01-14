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
  pgm.createTable("vaccinations", {
    id: "id",
    pet_id: {
      type: "integer",
      notNull: true,
      references: '"pets"',
      onDelete: "CASCADE",
    },
    vaccine_id: {
      type: "integer",
      notNull: true,
      references: '"services"',
      onDelete: "CASCADE",
    },
    price: {
      type: "decimal(10, 2)",
      notNull: true,
    },
    dose: {
      type: "varchar(20)",
      notNull: true,
      comment: "Ex.: 1, 2, 3, 4a, Semestral, Anual",
    },
    application_date: {
      type: "date",
      notNull: true,
    },
    next_dose_date: {
      type: "date",
      notNull: false,
    },
    notes: {
      type: "text",
      notNull: false,
    },
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
