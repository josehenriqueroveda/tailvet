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
  const { id, owner_id } = request.query;

  if (id) {
    const result = await database.query({
      text: `
        SELECT pets.*, customers.name AS owner_name
        FROM pets
        LEFT JOIN customers ON pets.owner_id = customers.id
        WHERE pets.id = $1
      `,
      values: [id],
    });

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "Pet not found" });
    }
    return response.status(200).json(result.rows[0]);
  } else if (owner_id) {
    const result = await database.query({
      text: `
        SELECT pets.*, customers.name AS owner_name
        FROM pets
        LEFT JOIN customers ON pets.owner_id = customers.id
        WHERE pets.owner_id = $1
      `,
      values: [owner_id],
    });

    return response.status(200).json(result.rows || []);
  } else {
    const result = await database.query({
      text: `
        SELECT pets.*, customers.name AS owner_name
        FROM pets
        LEFT JOIN customers ON pets.owner_id = customers.id
      `,
    });

    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const {
    name,
    gender,
    species,
    breed,
    birth_date,
    age,
    weight,
    color,
    is_neutered,
    owner_id,
  } = request.body;

  if (!name || !gender || !species || !owner_id) {
    return response.status(400).json({
      error: "Name, gender, species and owner_id are required",
    });
  }

  const result = await database.query({
    text: `INSERT INTO pets
    (name, gender, species, breed, birth_date, age, weight, color, is_neutered, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    values: [
      name,
      gender,
      species,
      breed || null,
      birth_date || null,
      age || null,
      weight || null,
      color || null,
      is_neutered || false,
      owner_id,
    ],
  });

  return response.status(201).json(result.rows[0]);
}

async function handlePut(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  if (!Object.keys(request.body).length) {
    return response.status(400).json({ error: "No fields to update" });
  }

  const updates = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(request.body)) {
    updates.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  values.push(id);

  await database.query({
    text: `UPDATE pets SET ${updates.join(", ")} WHERE id = $${index}`,
    values,
  });

  const updatedPet = await database.query({
    text: "SELECT * FROM pets WHERE id = $1",
    values: [id],
  });

  return response.status(200).json({
    message: "Pet updated successfully",
    pet: updatedPet.rows[0],
  });
}

async function handleDelete(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  const result = await database.query({
    text: "DELETE FROM pets WHERE id = $1 RETURNING *",
    values: [id],
  });

  if (result.rows.length === 0) {
    return response.status(404).json({ error: "Pet not found" });
  }

  return response
    .status(200)
    .json({ message: "Pet successfully deleted", pet: result.rows[0] });
}
