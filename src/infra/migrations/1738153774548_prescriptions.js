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
  pgm.createTable("prescriptions", {
    id: { type: "serial", primaryKey: true },
    owner_id: {
      type: "integer",
      notNull: true,
      references: '"customers"(id)',
      onDelete: "CASCADE",
    },
    pet_id: {
      type: "integer",
      notNull: true,
      references: '"pets"(id)',
      onDelete: "CASCADE",
    },
    prescription_date: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("prescription_items", {
    id: { type: "serial", primaryKey: true },
    prescription_id: {
      type: "integer",
      notNull: true,
      references: '"prescriptions"(id)',
      onDelete: "CASCADE",
    },
    medicine_name: { type: "text", notNull: true },
    quantity: { type: "text", notNull: true },
    instructions: { type: "text", notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
