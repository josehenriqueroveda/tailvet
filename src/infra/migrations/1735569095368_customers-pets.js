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
  pgm.createTable("customers", {
    id: "id",
    name: { type: "varchar(255)", notNull: true },
    gender: { type: "varchar(255)" },
    email: { type: "varchar(255)", unique: true },
    phone: { type: "varchar(20)" },
    cell_phone: { type: "varchar(20)" },
    address: { type: "text" },
    is_active: {
      type: "boolean",
      notNull: true,
      default: true,
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

  pgm.createTable("pets", {
    id: "id",
    name: { type: "varchar(255)", notNull: true },
    gender: { type: "varchar(255)", notNull: true },
    species: { type: "varchar(100)", notNull: true },
    breed: { type: "varchar(100)" },
    birth_date: { type: "date" },
    age: { type: "int" },
    weight: { type: "decimal(5, 2)" },
    color: { type: "varchar(100)" },
    is_neutered: { type: "boolean", notNull: true, default: false }, // Castrado ou não
    owner_id: {
      type: "integer",
      notNull: true,
      references: '"customers"',
      onDelete: "CASCADE",
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

  pgm.createIndex("pets", ["name", "owner_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
