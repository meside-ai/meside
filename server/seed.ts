import { environment } from "./configs/environment";
import { getDrizzle } from "./db/db";
import { catalogTable } from "./db/schema/catalog";
import { orgTable } from "./db/schema/org";
import { questionTable } from "./db/schema/question";
import { userTable } from "./db/schema/user";
import { warehouseTable } from "./db/schema/warehouse";
import type { QuestionPayload } from "./questions";
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

  await db.insert(orgTable).values({
    orgId,
    name: "chinook",
  });

  await db.insert(userTable).values({
    userId,
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password",
  });

  await db.insert(questionTable).values([
    {
      questionId,
      versionId: questionId,
      ownerId: userId,
      orgId,
      shortName: "list all artists",
      userContent: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "list all artists" }],
          },
        ],
      }),
      assistantReason: "OK, I will list all artists for you.",
      assistantContent: "list all artists",
      assistantStatus: "success",

      parentQuestionId: null,
      payload: {
        type: "sql",
        sql,
        warehouseId,
        fields,
      } as QuestionPayload,
    },
    {
      questionId: cuid(),
      versionId: questionId,
      activeVersion: true,
      ownerId: userId,
      orgId,
      shortName: "list all albums",
      userContent: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "list all albums" }],
          },
        ],
      }),
      assistantReason: "OK, I will list all albums for you.",
      assistantContent: "list all albums",
      assistantStatus: "success",

      parentQuestionId: null,
      payload: {
        type: "sql",
        sql,
        warehouseId,
        fields,
      } as QuestionPayload,
    },

    {
      questionId: cuid(),
      versionId: questionId,
      ownerId: userId,
      orgId,
      shortName: "list all tracks",
      userContent: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "list all tracks" }],
          },
        ],
      }),
      assistantReason: "OK, I will list all tracks for you.",
      assistantContent: "list all tracks",

      parentQuestionId: null,
      payload: {
        type: "sql",
        sql,
        warehouseId,
        fields,
      } as QuestionPayload,
    },
  ]);

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
