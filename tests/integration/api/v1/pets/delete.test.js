import orchestrator from "tests/orchestrator";

let sessionToken;
let petId;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("pets");
  await orchestrator.waitForTable("customers");

  sessionToken = await getToken();
  const owner_id = await createCustomer();
  petId = await createPet(owner_id);
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

async function createPet(ownerId) {
  const response = await fetch("http://localhost:3000/api/v1/pets", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      name: "Buddy",
      gender: "male",
      species: "dog",
      owner_id: ownerId,
    }),
  });

  const pet = await response.json();
  return pet.id;
}

describe("PUT /api/v1/pets", () => {
  test("Update a pet's details", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/pets?id=${petId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ name: "Buddy Jr." }),
      },
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.pet).toHaveProperty("name", "Buddy Jr.");
  });
});
