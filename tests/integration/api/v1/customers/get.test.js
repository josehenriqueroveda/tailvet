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

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const query = {
    text: `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
    values: [user.name, user.email, hashedPassword],
  };

  await database.query(query);
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

describe("GET /api/v1/customers", () => {
  let customerId;

  beforeAll(async () => {
    const postResponse = await fetch("http://localhost:3000/api/v1/customers", {
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

    const postResponseBody = await postResponse.json();
    customerId = postResponseBody.id;
  });

  test("List all customers", async () => {
    const response = await fetch("http://localhost:3000/api/v1/customers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  });

  test("Get a single customer by ID", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/customers?id=${customerId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty("id", customerId);
    expect(responseBody).toHaveProperty("name", "Michael Kyle");
  });
});
