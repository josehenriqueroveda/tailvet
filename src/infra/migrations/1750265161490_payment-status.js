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
  pgm.addColumn("appointments", {
    payment_status: {
      type: "varchar(255)",
      notNull: false,
      comment:
        "Status de pagamento: A Pagar, Pago em Dinheiro, Pago no Pix, Pago no Cartão",
    },
  });

  pgm.addColumn("appointment_services", {
    quantity: {
      type: "decimal(6, 2)",
      notNull: false,
      comment: "Quantidade do serviço, material ou medicamento.",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
