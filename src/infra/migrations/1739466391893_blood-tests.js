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
  pgm.createTable("blood_tests", {
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
    erythrocytes: { type: "decimal(5, 2)" },
    hemoglobin: { type: "decimal(5, 2)" },
    hematocrit: { type: "decimal(5, 2)" },
    hcm: { type: "decimal(5, 2)" },
    chcm: { type: "decimal(5, 2)" },
    vcm: { type: "decimal(5, 2)" },
    leukocytes: { type: "integer" },
    total_neutrophils: { type: "integer" },
    metamyelocytes: { type: "integer" },
    rods: { type: "integer" },
    segments: { type: "integer" },
    basophiles: { type: "integer" },
    eosinophils: { type: "integer" },
    total_lymphocytes: { type: "integer" },
    typical: { type: "integer" },
    atypical: { type: "integer" },
    monocytes: { type: "integer" },
    platelet_count: { type: "integer" },
    hematozoa_research: { type: "text" },
    plasma_protein: { type: "integer" },
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
