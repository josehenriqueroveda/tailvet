import orchestrator from "tests/orchestrator.js";
import database from "src/infra/database";
import bcrypt from "bcrypt";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("users");
  await dummyUser();
});

async function dummyUser() {
  const user = {
    name: "Jane Doe",
    email: "jane@test.com",
    password: "jane-PWD01",
  };

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const query = {
      text: `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
      values: [user.name, user.email, hashedPassword],
    };

    const result = await database.query(query);

    return result.rows[0];
  } catch (error) {
    console.error(error);
  }
}

describe("POST /api/v1/auth/login", () => {
  describe("Anonymous user", () => {
    test("Sign in", async () => {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "jane@test.com",
          password: "jane-PWD01",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(responseBody).toHaveProperty("token");
    }, 5000);
  });
});
