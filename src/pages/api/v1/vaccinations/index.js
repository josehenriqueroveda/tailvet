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
    dose,
    application_date,
    next_dose_date,
    notes,
    extra_services = [],
  } = request.body;

  if (!pet_id || !vaccine_id || !dose || !application_date) {
    return response.status(400).json({ error: "Required fields missing" });
  }

  const vaccineResult = await database.query({
    text: "SELECT price FROM services WHERE id = $1",
    values: [vaccine_id],
  });

  if (vaccineResult.rows.length === 0) {
    return response.status(404).json({ error: "Vaccine not found" });
  }

  const vaccinePrice = vaccineResult.rows[0].price;
  let totalValue = parseFloat(vaccinePrice);

  const vaccinationResult = await database.query({
    text: `
      INSERT INTO vaccinations (pet_id, vaccine_id, dose, application_date, next_dose_date, notes, total_value)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    values: [
      pet_id,
      vaccine_id,
      dose,
      application_date,
      next_dose_date,
      notes,
      totalValue,
    ],
  });

  const vaccinationId = vaccinationResult.rows[0].id;

  for (const extra of extra_services) {
    const serviceResult = await database.query({
      text: "SELECT price FROM services WHERE id = $1",
      values: [extra.service_id],
    });

    if (serviceResult.rows.length === 0) continue;

    const servicePrice = serviceResult.rows[0].price;
    totalValue += parseFloat(servicePrice);

    await database.query({
      text: `
        INSERT INTO vaccination_extra_services (vaccination_id, service_id, service_value)
        VALUES ($1, $2, $3)
      `,
      values: [vaccinationId, extra.service_id, servicePrice],
    });
  }

  await database.query({
    text: "UPDATE vaccinations SET total_value = $1 WHERE id = $2",
    values: [totalValue, vaccinationId],
  });

  return response
    .status(201)
    .json({ message: "Vaccination created successfully" });
}

async function handlePut(request, response) {
  return response.status(501).json({ error: "PUT not implemented yet" });
}

async function handleDelete(request, response) {
  return response.status(501).json({ error: "DELETE not implemented yet" });
}
