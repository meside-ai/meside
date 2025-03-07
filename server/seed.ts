import { MessageRole, WarehouseType } from "@prisma/client";
import { inArray } from "drizzle-orm";
import type { UserContentMessageStructure } from "./agents/content";
import type {
  AssistantDbMessageStructure,
  SystemDbMessageStructure,
} from "./agents/db";
import type {
  AssistantEchartsMessageStructure,
  SystemEchartsMessageStructure,
} from "./agents/echarts";
import { environment } from "./configs/environment";
import { getDrizzle } from "./db/db";
import { catalogTable } from "./db/schema/catalog";
import { messageTable } from "./db/schema/message";
import { orgTable } from "./db/schema/org";
import { threadTable } from "./db/schema/thread";
import { userTable } from "./db/schema/user";
import { warehouseTable } from "./db/schema/warehouse";
import { cuid } from "./utils/cuid";
import type { WarehouseQueryColumn } from "./warehouse";

export async function main() {
  const db = getDrizzle();

  const orgId = "hkwgx29khaflgmm5c8ipp79r";
  const userId = "io56027z7qwd25mzq6upq947";
  const warehouseId = "zhl0ec34cda00wgufqsqe80d";
  const level1ThreadId = cuid();
  const level1SystemMessageId = cuid();
  const level1UserMessageId = cuid();
  const level1AssistantMessageId = cuid();
  const level2ThreadId = cuid();
  const level2SystemMessageId = cuid();
  const level2UserMessageId = cuid();
  const level2AssistantMessageId = cuid();

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

  await db.insert(threadTable).values([
    {
      threadId: level1ThreadId,
      parentMessageId: null,
      ownerId: userId,
      orgId,
      name: "list all artists",
    },
    {
      threadId: level2ThreadId,
      parentMessageId: level1AssistantMessageId,
      ownerId: userId,
      orgId,
      name: "generate a bar chart of artist ids",
    },
  ]);

  await db.insert(messageTable).values([
    {
      messageId: level1SystemMessageId,
      threadId: level1ThreadId,
      orgId,
      ownerId: userId,
      messageRole: MessageRole.SYSTEM,
      structure: {
        type: "systemDb",
        warehouseId,
      } as SystemDbMessageStructure,
    },
    {
      messageId: level1UserMessageId,
      threadId: level1ThreadId,
      orgId,
      ownerId: userId,
      messageRole: MessageRole.USER,
      structure: {
        type: "userContent",
        content: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "list all artists" }],
            },
          ],
        }),
      } as UserContentMessageStructure,
    },
    {
      messageId: level1AssistantMessageId,
      threadId: level1ThreadId,
      orgId,
      ownerId: userId,
      messageRole: MessageRole.ASSISTANT,
      structure: {
        type: "assistantDb",
        warehouseId,
        sql,
        fields,
      } as AssistantDbMessageStructure,
    },

    {
      messageId: level2SystemMessageId,
      threadId: level2ThreadId,
      orgId,
      ownerId: userId,
      messageRole: MessageRole.SYSTEM,
      structure: {
        type: "systemEcharts",
        warehouseId,
        sql,
        fields,
      } as SystemEchartsMessageStructure,
    },
    {
      messageId: level2UserMessageId,
      threadId: level2ThreadId,
      orgId,
      ownerId: userId,
      messageRole: MessageRole.USER,
      structure: {
        type: "userContent",
        content: "list all albums",
      } as UserContentMessageStructure,
    },
    {
      messageId: level2AssistantMessageId,
      threadId: level2ThreadId,
      orgId,
      ownerId: userId,
      messageRole: MessageRole.ASSISTANT,
      structure: {
        type: "assistantEcharts",
        echartsOptions: `
          return {
            tooltip: {},
            xAxis: {
              type: "category",
              data: data.rows.map((row) => {
                return row.name;
              }),
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                data: data.rows.map((row) => {
                  return row.artist_id;
                }),
                type: "bar",
              },
            ],
          };
        `,
        warehouseId,
        sql,
        fields: [
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
        ],
      } as AssistantEchartsMessageStructure,
    },
  ]);

  await db
    .update(threadTable)
    .set({
      hasQuestions: true,
    })
    .where(inArray(threadTable.threadId, [level1ThreadId, level2ThreadId]));

  await db.insert(warehouseTable).values({
    warehouseId,
    name: "Chinook",
    type: WarehouseType.postgresql,
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
      warehouseType: WarehouseType.postgresql,
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
      warehouseType: WarehouseType.postgresql,
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
      warehouseType: WarehouseType.postgresql,
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
      warehouseType: WarehouseType.postgresql,
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
      warehouseType: WarehouseType.postgresql,
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
