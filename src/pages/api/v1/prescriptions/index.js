import database from "src/infra/database";
import { verifyServerToken } from "src/utils/auth.server";

export default async function handler(request, response) {
  const allowedMethods = ["GET", "POST"];
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
    const prescriptionResult = await database.query({
      text: `
        SELECT 
          p.*, 
          c.name AS owner_name,
          pet.name AS pet_name
        FROM prescriptions p
        JOIN customers c ON p.owner_id = c.id
        JOIN pets pet ON p.pet_id = pet.id
        WHERE p.id = $1
      `,
      values: [id],
    });

    if (prescriptionResult.rows.length === 0) {
      return response.status(404).json({ error: "Prescription not found" });
    }

    const medicinesResult = await database.query({
      text: `
        SELECT id, medicine_name, quantity, instructions
        FROM prescription_items
        WHERE prescription_id = $1
      `,
      values: [id],
    });

    const prescription = prescriptionResult.rows[0];
    prescription.medicines = medicinesResult.rows;

    return response.status(200).json(prescription);
  } else {
    const result = await database.query({
      text: `
        SELECT 
          p.*, 
          c.name AS owner_name,
          pet.name AS pet_name
        FROM prescriptions p
        JOIN customers c ON p.owner_id = c.id
        JOIN pets pet ON p.pet_id = pet.id
      `,
    });

    return response.status(200).json(result.rows || []);
  }
}

async function handlePost(request, response) {
  const { owner_id, pet_id, prescription_date, medicines } = request.body;

  if (
    !owner_id ||
    !pet_id ||
    !prescription_date ||
    !Array.isArray(medicines) ||
    medicines.length === 0
  ) {
    return response
      .status(400)
      .json({ error: "Required fields missing or invalid medicines list" });
  }

  try {
    await database.query("BEGIN");
    const prescriptionResult = await database.query({
      text: `
        INSERT INTO prescriptions (owner_id, pet_id, prescription_date)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      values: [owner_id, pet_id, prescription_date],
    });

    const prescriptionId = prescriptionResult.rows[0].id;
    const insertMedicineQuery = `
      INSERT INTO prescription_items (prescription_id, medicine_name, quantity, instructions)
      VALUES ($1, $2, $3, $4)
    `;

    for (const medicine of medicines) {
      await database.query({
        text: insertMedicineQuery,
        values: [
          prescriptionId,
          medicine.medicine_name,
          medicine.quantity,
          medicine.instructions,
        ],
      });
    }
    await database.query("COMMIT");
    return response.status(201).json({
      message: "Prescription created successfully",
      prescription_id: prescriptionId,
    });
  } catch (error) {
    await database.query("ROLLBACK");
    console.error(error);
    return response
      .status(500)
      .json({ error: "Failed to create prescription" });
  }
}
