import { inputKey, seedAgentDb } from "./agent/seed/seed";
import { seedWarehouseDb } from "./tools/warehouse/seed/seed";

export async function main() {
  const { llmProvider, toolUrl } = await inputKey();
  await seedAgentDb({ llmProvider, toolUrl });
  await seedWarehouseDb();
}

main()
  .then(async () => {
    console.info("seed finish");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    throw new Error("seed failed");
  });
