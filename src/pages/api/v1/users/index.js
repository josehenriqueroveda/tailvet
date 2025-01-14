import database from "src/infra/database";
import bcrypt from "bcrypt";
// import { verifyServerToken } from "src/utils/auth.server";

export default async function handler(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  try {
    //const authenticatedUser = await verifyServerToken(request);
    const authenticatedUser = { id: 1 };

    switch (request.method) {
      case "GET":
        await handleGet(request, response, authenticatedUser);
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

async function handleGet(request, response, authenticatedUser) {
  try {
    const result = await database.query({
      text: "SELECT id, name, email FROM users WHERE id = $1",
      values: [authenticatedUser.id],
    });

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Error fetching user" });
  }
}

async function handlePost(request, response) {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
      values: [name, email, hashedPassword],
    };

    const result = await database.query(query);

    return response.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return response.status(409).json({ message: "Email already exists" });
    }
    return response.status(500).json({ message: "Error registering user" });
  }
}
