import orchestrator from "tests/orchestrator";

let sessionToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("pets");
  await orchestrator.waitForTable("customers");

  sessionToken = await getToken();
});

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

async function createCustomer() {
  const response = await fetch("http://localhost:3000/api/v1/customers", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      name: "Michael Kyle",
      gender: "male",
    }),
  });

  const customer = await response.json();
  return customer.id;
}

describe("POST /api/v1/pets", () => {
  test("Create a new pet", async () => {
    const ownerId = await createCustomer();

    const response = await fetch("http://localhost:3000/api/v1/pets", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        name: "Max",
        gender: "male",
        species: "cat",
        owner_id: ownerId,
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toHaveProperty("name", "Max");
  });
});
