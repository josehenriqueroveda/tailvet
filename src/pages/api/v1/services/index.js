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
  const { id, search, category } = request.query;

  if (id) {
    const result = await database.query({
      text: "SELECT * FROM services WHERE id = $1",
      values: [id],
    });

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "Service not found" });
    }
    return response.status(200).json(result.rows[0]);
  } else {
    let queryText = "SELECT * FROM services WHERE is_active = true";
    let queryValues = [];

    if (search) {
      queryText += " AND LOWER(name) LIKE LOWER($1)";
      queryValues.push(`%${search}%`);
    }

    if (category) {
      queryText += " AND LOWER(category) LIKE LOWER($1)";
      queryValues.push(`%${category}%`);
    }

    const result = await database.query({
      text: queryText,
      values: queryValues,
    });

    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const { name, price, amount, unit, category } = request.body;

  if (!name) {
    return response.status(400).json({ error: "Name is required" });
  }

  const result = await database.query({
    text: `INSERT INTO services (name, price, amount, unit, category) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    values: [
      name,
      price || null,
      amount || null,
      unit || null,
      category || null,
    ],
  });
  return response.status(201).json(result.rows[0]);
}

async function handlePut(request, response) {
  const { id } = request.query;
  const { name, price, amount, unit, category } = request.body;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  if (!Object.keys(request.body).length) {
    return response.status(400).json({ error: "No fields to update" });
  }

  if (name) {
    await database.query({
      text: "UPDATE services SET name = $1 WHERE id = $2",
      values: [name, id],
    });
  }

  if (price) {
    await database.query({
      text: "UPDATE services SET price = $1 WHERE id = $2",
      values: [price, id],
    });
  }

  if (amount) {
    await database.query({
      text: "UPDATE services SET amount = $1 WHERE id = $2",
      values: [amount, id],
    });
  }

  if (unit) {
    await database.query({
      text: "UPDATE services SET unit = $1 WHERE id = $2",
      values: [unit, id],
    });
  }

  if (category) {
    await database.query({
      text: "UPDATE services SET category = $1 WHERE id = $2",
      values: [category, id],
    });
  }

  const updatedService = await database.query({
    text: "SELECT * FROM services WHERE id = $1",
    values: [id],
  });

  return response.status(200).json({
    message: "Service updated successfully",
    service: updatedService.rows[0],
  });
}

async function handleDelete(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  const result = await database.query({
    text: `UPDATE services SET is_active = false WHERE id = $1 RETURNING *`,
    values: [id],
  });

  if (result.rows.length === 0) {
    return response.status(404).json({ error: "Service not found" });
  }
  return response
    .status(200)
    .json({ message: "Service successfully deactivated" });
}
