import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("users");
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("Creating an user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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