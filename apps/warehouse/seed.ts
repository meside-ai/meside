import { environment } from "./configs/environment";
import { getDrizzle } from "./db/db";
import { catalogTable } from "./db/schema/catalog";
import { warehouseTable } from "./db/schema/warehouse";
import { cuid } from "./utils/cuid";
import type { WarehouseQueryColumn } from "./warehouse";

export async function main() {
  const db = getDrizzle();

  const orgId = "hkwgx29khaflgmm5c8ipp79r";
  const userId = "io56027z7qwd25mzq6upq947";
  const warehouseId = "zhl0ec34cda00wgufqsqe80d";
  const questionId = "cwh5pv4nxuh3xlhnlouz95q7";

  const sql = "SELECT * FROM artist LIMIT 10";
  const fields: WarehouseQueryColumn[] = [
    {
      tableName: "artists",
      columnName: "artist_id",
      columnType: "number",
      description: "The ID of the artist",
    },
    {
      tableName: "artists",
      columnName: "name",
      columnType: "string",
      description: "The name of the artist",
    },
  ];

  await db.insert(warehouseTable).values({
    warehouseId,
    name: "Chinook",
    type: "postgresql",
    host: environment.SEED_WAREHOUSE_HOST ?? "localhost",
    port: environment.SEED_WAREHOUSE_PORT ?? 25435,
    database: environment.SEED_WAREHOUSE_DATABASE ?? "chinook",
    username: environment.SEED_WAREHOUSE_USERNAME ?? "postgres",
    password: environment.SEED_WAREHOUSE_PASSWORD ?? "postgres",
    ownerId: userId,
    orgId,
  });

  await db.insert(catalogTable).values([
    {
      catalogId: cuid(),
      warehouseId,
      warehouseType: "postgresql",
      fullName: "public.album.album_id",
      schemaName: "public",
      tableName: "album",
      columnName: "album_id",
      columnType: "INTEGER",
      description: "The ID of the album",
      orgId,
    },
    {
      catalogId: cuid(),
      warehouseId,
      warehouseType: "postgresql",
      fullName: "public.album.title",
      schemaName: "public",
      tableName: "album",
      columnName: "title",
      columnType: "VARCHAR",
      description: "The title of the album",
      orgId,
    },
    {
      catalogId: cuid(),
      warehouseId,
      warehouseType: "postgresql",
      fullName: "public.album.artist_id",
      schemaName: "public",
      tableName: "album",
      columnName: "artist_id",
      columnType: "INTEGER",
      description: "The ID of the artist",
      orgId,
    },
    {
      catalogId: cuid(),
      warehouseId,
      warehouseType: "postgresql",
      fullName: "public.artist.artist_id",
      schemaName: "public",
      tableName: "artist",
      columnName: "artist_id",
      columnType: "INTEGER",
      description: "The ID of the artist",
      orgId,
    },
    {
      catalogId: cuid(),
      warehouseId,
      warehouseType: "postgresql",
      fullName: "public.artist.name",
      schemaName: "public",
      tableName: "artist",
      columnName: "name",
      columnType: "VARCHAR",
      description: "The name of the artist",
      orgId,
    },
  ]);
}

main()
  .then(async () => {
    console.info("seed finish");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
