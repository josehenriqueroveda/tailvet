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
        SELECT bt.*, p.name AS pet_name, c.name AS owner_name
        FROM blood_tests bt
        JOIN pets p ON bt.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
        WHERE bt.id = $1
      `,
      values: [id],
    });

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "Blood test not found" });
    }
    return response.status(200).json(result.rows[0]);
  } else if (search) {
    const result = await database.query({
      text: `
        SELECT bt.*, p.name AS pet_name, c.name AS owner_name
        FROM blood_tests bt
        JOIN pets p ON bt.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
        WHERE c.name ILIKE $1
      `,
      values: [`%${search}%`],
    });

    return response.status(200).json(result.rows || []);
  } else {
    const result = await database.query({
      text: `
        SELECT bt.*, p.name AS pet_name, c.name AS owner_name
        FROM blood_tests bt
        JOIN pets p ON bt.pet_id = p.id
        JOIN customers c ON p.owner_id = c.id
      `,
    });
    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const {
    owner_id,
    pet_id,
    test_date,
    material,
    method,
    erythrocytes,
    hemoglobin,
    hematocrit,
    hcm,
    chcm,
    vcm,
    leukocytes,
    total_neutrophils,
    metamyelocytes,
    rods,
    segments,
    basophiles,
    eosinophils,
    total_lymphocytes,
    typical,
    atypical,
    monocytes,
    platelet_count,
    hematozoa_research,
    plasma_protein,
    comments,
  } = request.body;

  if (!pet_id || !owner_id) {
    return response.status(400).json({
      error: "Pet ID and Owner ID are required",
    });
  }

  const result = await database.query({
    text: `INSERT INTO blood_tests (
        pet_id,
        owner_id,
        test_date,
        material,
        method,
        erythrocytes,
        hemoglobin,
        hematocrit,
        hcm,
        chcm,
        vcm,
        leukocytes,
        total_neutrophils,
        metamyelocytes,
        rods,
        segments,
        basophiles,
        eosinophils,
        total_lymphocytes,
        typical,
        atypical,
        monocytes,
        platelet_count,
        hematozoa_research,
        plasma_protein,
        comments,
        created_at,
        updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *`,
    values: [
      owner_id,
      pet_id,
      test_date,
      material,
      method,
      erythrocytes || null,
      hemoglobin || null,
      hematocrit || null,
      hcm || null,
      chcm || null,
      vcm || null,
      leukocytes || null,
      total_neutrophils || null,
      metamyelocytes || null,
      rods || null,
      segments || null,
      basophiles || null,
      eosinophils || null,
      total_lymphocytes || null,
      typical || null,
      atypical || null,
      monocytes || null,
      platelet_count || null,
      hematozoa_research || null,
      plasma_protein || null,
      comments || null,
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
    text: `UPDATE blood_tests SET ${updates.join(", ")} WHERE id = $${index}`,
    values,
  });

  const updatedBloodTest = await database.query({
    text: `
      SELECT bt.*, p.name AS pet_name, c.name AS owner_name
      FROM blood_tests bt
      JOIN pets p ON bt.pet_id = p.id
      JOIN customers c ON p.owner_id = c.id
      WHERE bt.id = $1
    `,
    values: [id],
  });

  return response.status(200).json({
    message: "Blood test updated successfully",
    appointment: updatedBloodTest.rows[0],
  });
}

async function handleDelete(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  const result = await database.query({
    text: "DELETE FROM blood_tests WHERE id = $1 RETURNING *",
    values: [id],
  });

  if (result.rows.length === 0) {
    return response.status(404).json({ error: "Blood test not found" });
  }

  return response.status(200).json({
    message: "Blood test successfully deleted",
    appointment: result.rows[0],
  });
}
