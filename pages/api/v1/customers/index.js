import database from "src/infra/database";
import { verifyServerToken } from "src/utils/auth.server";

export default async function handler(request, response) {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  try {
    await verifyServerToken(request);

    switch (request.method) {
      case "GET":
        await handleGet(request, response);
        break;
      case "POST":
        await handlePost(request, response);
        break;
      case "PUT":
        await handlePut(request, response);
        break;
      case "DELETE":
        await handleDelete(request, response);
        break;
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}

async function handleGet(request, response) {
  const { id, search } = request.query;

  // Se o parâmetro id for fornecido, busca por ID específico
  if (id) {
    const result = await database.query({
      text: "SELECT * FROM customers WHERE id = $1 AND is_active = true",
      values: [id],
    });

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "Customer not found" });
    }
    return response.status(200).json(result.rows[0]);
  } else {
    // Se o parâmetro search for fornecido, filtra por nome
    let queryText = "SELECT * FROM customers WHERE is_active = true";
    let queryValues = [];

    if (search) {
      queryText += " AND LOWER(name) LIKE LOWER($1)";
      queryValues.push(`%${search}%`);
    }

    const result = await database.query({
      text: queryText,
      values: queryValues,
    });

    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const { name, gender, email, phone, cell_phone, address } = request.body;

  if (!name) {
    return response.status(400).json({ error: "Name is required" });
  }

  const result = await database.query({
    text: `INSERT INTO customers (name, gender, email, phone, cell_phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    values: [
      name,
      gender || null,
      email || null,
      phone || null,
      cell_phone || null,
      address || null,
    ],
  });
  return response.status(201).json(result.rows[0]);
}

async function handlePut(request, response) {
  const { id } = request.query;
  const { name, gender, email, phone, cell_phone, address } = request.body;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  if (!Object.keys(request.body).length) {
    return response.status(400).json({ error: "No fields to update" });
  }

  if (name) {
    await database.query({
      text: "UPDATE customers SET name = $1 WHERE id = $2",
      values: [name, id],
    });
  }

  if (gender) {
    await database.query({
      text: "UPDATE customers SET gender = $1 WHERE id = $2",
      values: [gender, id],
    });
  }

  if (email) {
    await database.query({
      text: "UPDATE customers SET email = $1 WHERE id = $2",
      values: [email, id],
    });
  }

  if (phone) {
    await database.query({
      text: "UPDATE customers SET phone = $1 WHERE id = $2",
      values: [phone, id],
    });
  }

  if (cell_phone) {
    await database.query({
      text: "UPDATE customers SET cell_phone = $1 WHERE id = $2",
      values: [cell_phone, id],
    });
  }

  if (address) {
    await database.query({
      text: "UPDATE customers SET address = $1 WHERE id = $2",
      values: [address, id],
    });
  }

  const updatedCustomer = await database.query({
    text: "SELECT * FROM customers WHERE id = $1",
    values: [id],
  });

  return response.status(200).json({
    message: "Customer updated successfully",
    customer: updatedCustomer.rows[0],
  });
}

async function handleDelete(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  const result = await database.query({
    text: `UPDATE customers SET is_active = false WHERE id = $1 RETURNING *`,
    values: [id],
  });

  if (result.rows.length === 0) {
    return response.status(404).json({ error: "Customer not found" });
  }
  return response
    .status(200)
    .json({ message: "Customer successfully deactivated" });
}
