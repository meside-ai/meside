import { getDrizzle } from "../../../db/db";
import { cuid } from "../../../utils/cuid";
import { catalogTable } from "../table/catalog";
import { warehouseTable } from "../table/warehouse";

export async function seedWarehouseDb() {
  const db = getDrizzle();

  const orgId = "hkwgx29khaflgmm5c8ipp79r";
  const ownerId = "io56027z7qwd25mzq6upq947";
  const warehouseId = "zhl0ec34cda00wgufqsqe80d";

  await db.insert(warehouseTable).values({
    warehouseId,
    name: "Chinook",
    provider: {
      type: "postgresql",
      host: "localhost",
      port: 25435,
      database: "chinook",
      username: "postgres",
      password: "postgres",
    },
    ownerId,
    orgId,
  });

  await db.insert(catalogTable).values([
    {
      catalogId: cuid(),
      warehouseId,
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
