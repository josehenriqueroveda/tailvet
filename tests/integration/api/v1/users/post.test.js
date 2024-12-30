import orchestrator from "tests/orchestrator.js";
import database from "src/infra/database";
import bcrypt from "bcrypt";

let sessionToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("users");
  await dummyUser();
  sessionToken = await getToken();
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

async function getToken() {
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

  const responseBody = await response.json();
  return responseBody.token;
}

describe("POST /api/v1/users", () => {
  describe("Authenticated user", () => {
    test("Creating an user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "jd@test.com",
          password: "jd-PWD01",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(responseBody.user.name).toBe("John Doe");
      expect(responseBody.user.email).toBe("jd@test.com");
    }, 5000);
  });
});
