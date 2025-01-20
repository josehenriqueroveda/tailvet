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

  if (id) {
    const result = await database.query({
      text: `
        SELECT a.*, p.name AS pet_name, c.name AS owner_name
        FROM appointments a
        JOIN pets p ON a.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
        WHERE a.id = $1
      `,
      values: [id],
    });

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "Appointment not found" });
    }
    return response.status(200).json(result.rows[0]);
  } else if (search) {
    const result = await database.query({
      text: `
        SELECT a.*, p.name AS pet_name, c.name AS owner_name
        FROM appointments a
        JOIN pets p ON a.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
        WHERE c.name ILIKE $1
      `,
      values: [`%${search}%`],
    });

    return response.status(200).json(result.rows || []);
  } else {
    const result = await database.query({
      text: `
        SELECT a.*, p.name AS pet_name, c.name AS owner_name
        FROM appointments a
        JOIN pets p ON a.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
      `,
    });
    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const {
    pet_id,
    appointment_date,
    appointment_type,
    main_complaint,
    anamnesis,
    temperature,
    weight,
    neurological_system,
    digestive_system,
    cardiorespiratory_system,
    urinary_system,
    diagnosis,
    observations,
    return_date,
  } = request.body;

  if (!pet_id || !appointment_type) {
    return response.status(400).json({
      error: "Pet ID and appointment type are required",
    });
  }

  const result = await database.query({
    text: `
      INSERT INTO appointments
      (pet_id, appointment_date, appointment_type, main_complaint, anamnesis, temperature, weight, neurological_system, digestive_system, cardiorespiratory_system, urinary_system, diagnosis, observations, return_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `,
    values: [
      pet_id,
      appointment_date || null,
      appointment_type,
      main_complaint || null,
      anamnesis || null,
      temperature || null,
      weight || null,
      neurological_system || null,
      digestive_system || null,
      cardiorespiratory_system || null,
      urinary_system || null,
      diagnosis || null,
      observations || null,
      return_date || null,
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
    text: `UPDATE appointments SET ${updates.join(", ")} WHERE id = $${index}`,
    values,
  });

  const updatedAppointment = await database.query({
    text: `
      SELECT a.*, p.name AS pet_name, c.name AS owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN customers c ON p.owner_id = c.id
      WHERE a.id = $1
    `,
    values: [id],
  });

  return response.status(200).json({
    message: "Appointment updated successfully",
    appointment: updatedAppointment.rows[0],
  });
}

async function handleDelete(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  const result = await database.query({
    text: "DELETE FROM appointments WHERE id = $1 RETURNING *",
    values: [id],
  });

  if (result.rows.length === 0) {
    return response.status(404).json({ error: "Appointment not found" });
  }

  return response.status(200).json({
    message: "Appointment successfully deleted",
    appointment: result.rows[0],
  });
}
