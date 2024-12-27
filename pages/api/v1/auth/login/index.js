import database from "src/infra/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET = process.env.JWT_SECRET || "testsecret";

export default async function handler(request, response) {
  const allowedMethods = ["POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const query = {
      text: `SELECT id, name, email, password FROM users WHERE email = $1`,
      values: [email],
    };

    const result = await database.query(query);

    if (result.rowCount === 0) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "30d",
    });

    response.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      }),
    );

    return response.status(200).json({ token });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}
