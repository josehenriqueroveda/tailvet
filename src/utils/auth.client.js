import jwt from "jsonwebtoken";

export function verifyClientToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.decode(token);
    return decoded; // Retorna payload básico do token
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
