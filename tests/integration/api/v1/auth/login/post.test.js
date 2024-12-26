import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("users");
});

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
          email: "jd@test.com",
          password: "jd-PWD01",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(responseBody).toHaveProperty("token");
    }, 5000);
  });
});
