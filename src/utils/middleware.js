import jwt from "jsonwebtoken";
import database from "src/infra/database";

const SECRET = process.env.JWT_SECRET || "testsecret";

export async function verifyToken(request) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, SECRET);
    const query = {
      text: `SELECT id, name, email FROM users WHERE id = $1`,
      values: [decoded.id],
    };

    const result = await database.query(query);

    if (result.rowCount === 0) throw new Error("User not found");

    return result.rows[0];
  } catch (error) {
    throw new Error("Invalid token");
  }
}
