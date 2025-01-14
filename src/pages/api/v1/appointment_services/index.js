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
  const { appointment_id, service_id } = request.query;

  if (appointment_id) {
    const result = await database.query({
      text: `
        SELECT 
          aps.*,
          s.name AS service_name,
          s.price AS service_price,
          SUM(aps.price) OVER () AS total_price
        FROM appointment_services aps
        JOIN services s ON aps.service_id = s.id
        WHERE aps.appointment_id = $1
      `,
      values: [appointment_id],
    });

    const totalPrice = result.rows[0]?.total_price || 0;

    return response.status(200).json({
      services: result.rows,
      total_price: parseFloat(totalPrice),
    });
  } else if (service_id) {
    const result = await database.query({
      text: `
        SELECT aps.*, s.name AS service_name, s.price AS service_price
        FROM appointment_services aps
        JOIN services s ON aps.service_id = s.id
        WHERE aps.service_id = $1
      `,
      values: [service_id],
    });

    return response.status(200).json(result.rows || []);
  } else {
    const result = await database.query({
      text: `
        SELECT aps.*, s.name AS service_name, s.price AS service_price
        FROM appointment_services aps
        JOIN services s ON aps.service_id = s.id
      `,
    });

    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const { appointment_id, service_id, name, price } = request.body;

  if (!appointment_id || !service_id || !name || price === undefined) {
    return response.status(400).json({
      error: "Appointment ID, Service ID, Name, and Price are required",
    });
  }

  const result = await database.query({
    text: `
      INSERT INTO appointment_services
      (appointment_id, service_id, name, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    values: [appointment_id, service_id, name, price],
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
    text: `UPDATE appointment_services SET ${updates.join(", ")} WHERE id = $${index}`,
    values,
  });

  const updatedService = await database.query({
    text: `
      SELECT aps.*, s.name AS service_name, s.price AS service_price
      FROM appointment_services aps
      JOIN services s ON aps.service_id = s.id
      WHERE aps.id = $1
    `,
    values: [id],
  });

  return response.status(200).json({
    message: "Appointment Service updated successfully",
    appointment_service: updatedService.rows[0],
  });
}

async function handleDelete(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  const result = await database.query({
    text: "DELETE FROM appointment_services WHERE id = $1 RETURNING *",
    values: [id],
  });

  if (result.rows.length === 0) {
    return response
      .status(404)
      .json({ error: "Appointment Service not found" });
  }

  return response.status(200).json({
    message: "Appointment Service successfully deleted",
    appointment_service: result.rows[0],
  });
}
