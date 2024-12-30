import orchestrator from "tests/orchestrator";
import database from "src/infra/database";
import bcrypt from "bcrypt";

let sessionToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("customers");
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

describe("POST /api/v1/customers", () => {
  describe("Authenticated user", () => {
    test("Creating a customer", async () => {
      const response = await fetch("http://localhost:3000/api/v1/customers", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          name: "Michael Kyle",
          gender: "masculino",
          cell_phone: "(99)99999-9999",
          address: "Rua St1, Numero 999, Centro, São Paulo-SP",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(responseBody.name).toBe("Michael Kyle");
      expect(responseBody.gender).toBe("masculino");
      expect(responseBody.email).toBe(null);
      expect(responseBody.phone).toBe(null);
      expect(responseBody.cell_phone).toBe("(99)99999-9999");
      expect(responseBody.address).toBe(
        "Rua St1, Numero 999, Centro, São Paulo-SP",
      );
    }, 5000);
  });
});
