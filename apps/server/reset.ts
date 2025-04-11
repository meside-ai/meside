import { resetAgentDb } from "./agent/seed/reset";
import { resetWarehouseDb } from "./tools/warehouse/seed/reset";

export async function resetDb() {
  await resetAgentDb();
  await resetWarehouseDb();
}

resetDb()
  .then(async () => {
    console.info("reset finish");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    throw new Error("reset failed");
  });
