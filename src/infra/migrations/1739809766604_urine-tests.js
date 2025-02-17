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
  pgm.createTable("urine_tests", {
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
    test_date: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    material: { type: "text" },
    method: { type: "text" },
    color: { type: "text" },
    aspect: { type: "text" },
    filament: { type: "text" },
    deposit: { type: "text" },
    smell: { type: "text" },
    ph: { type: "decimal(2, 1)" },
    density: { type: "integer" },
    proteins: { type: "text" },
    glycose: { type: "text" },
    ketone: { type: "text" },
    bilirubin: { type: "text" },
    hemoglobin: { type: "text" },
    nitrite: { type: "text" },
    urobilinogen: { type: "text" },
    ascorbic_acid: { type: "text" },
    cells: { type: "text" },
    leukocytes: { type: "text" },
    haemias: { type: "text" },
    cylindricals: { type: "text" },
    crystals: { type: "text" },
    other_elements: { type: "text" },
    comments: { type: "text" },
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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
