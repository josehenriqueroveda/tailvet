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
  const { id } = request.query;

  if (id) {
    const vaccinationResult = await database.query({
      text: `
        SELECT 
          v.*, 
          p.name AS pet_name,
          c.name AS customer_name,
          s.name AS vaccine_name
        FROM vaccinations v
        JOIN pets p ON v.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
        JOIN services s ON v.vaccine_id = s.id
        WHERE v.id = $1
      `,
      values: [id],
    });

    if (vaccinationResult.rows.length === 0) {
      return response.status(404).json({ error: "Vaccination not found" });
    }

    const extrasResult = await database.query({
      text: `
        SELECT es.*, s.name AS service_name
        FROM vaccination_extra_services es
        JOIN services s ON es.service_id = s.id
        WHERE es.vaccination_id = $1
      `,
      values: [id],
    });

    const vaccination = vaccinationResult.rows[0];
    vaccination.extra_services = extrasResult.rows;

    return response.status(200).json(vaccination);
  } else {
    const result = await database.query({
      text: `
        SELECT 
          v.*, 
          p.name AS pet_name,
          c.name AS customer_name,
          s.name AS vaccine_name
        FROM vaccinations v
        JOIN pets p ON v.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
        JOIN services s ON v.vaccine_id = s.id
      `,
    });

    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const {
    pet_id,
    vaccine_id,
    price,
    dose,
    application_date,
    next_dose_date,
    notes,
    pet_weight,
  } = request.body;

  if (!pet_id || !vaccine_id || !dose || !application_date) {
    return response.status(400).json({ error: "Required fields missing" });
  }

  await database.query({
    text: `
      INSERT INTO vaccinations (pet_id, vaccine_id, price, dose, application_date, next_dose_date, notes, pet_weight)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    values: [
      pet_id,
      vaccine_id,
      price,
      dose,
      application_date,
      next_dose_date,
      notes,
      pet_weight,
    ],
  });

  return response
    .status(201)
    .json({ message: "Vaccination created successfully" });
}

async function handlePut(request, response) {
  const { id } = request.query;
  const updates = request.body;

  if (!id) {
    return response.status(400).json({ error: "Vaccination ID is required" });
  }

  const result = await database.query({
    text: `
      UPDATE vaccinations 
      SET pet_id = $1, vaccine_id = $2, dose = $3, application_date = $4, next_dose_date = $5, notes = $6, pet_weight = $7
      WHERE id = $8
      RETURNING *
    `,
    values: [
      updates.pet_id,
      updates.vaccine_id,
      updates.dose,
      updates.application_date,
      updates.next_dose_date,
      updates.notes,
      updates.pet_weight,
      id,
    ],
  });

  if (result.rows.length === 0) {
    return response.status(404).json({ error: "Vaccination not found" });
  }

  return response.status(200).json(result.rows[0]);
}

async function handleDelete(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "Vaccination ID is required" });
  }

  const result = await database.query({
    text: `DELETE FROM vaccinations WHERE id = $1 RETURNING *`,
    values: [id],
  });

  if (result.rows.length === 0) {
    return response.status(404).json({ error: "Vaccination not found" });
  }

  return response
    .status(200)
    .json({ message: "Vaccination deleted successfully" });
}
