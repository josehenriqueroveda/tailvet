import retry from "async-retry";
import database from "src/infra/database.js";

async function waitForAllServices() {
  await waitForWebServer();
  await runMigrations();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }

  async function runMigrations() {
    return retry(
      async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        if (response.status !== 200) {
          throw Error();
        }
      },
      {
        retries: 50,
        minTimeout: 500,
        maxTimeout: 2000,
      },
    );
  }
}

async function waitForTable(tableName) {
  return retry(
    async () => {
      const result = await database.query({
        text: "SELECT to_regclass($1) AS exists",
        values: [tableName],
      });

      if (!result.rows[0] || !result.rows[0].exists) {
        throw new Error(`Table "${tableName}" not found`);
      }
    },
    {
      retries: 50,
      minTimeout: 500,
      maxTimeout: 2000,
    },
  );
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  waitForTable,
  clearDatabase,
};

export default orchestrator;
