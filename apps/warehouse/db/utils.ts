import { timestamp, varchar } from "drizzle-orm/pg-core";

export const useCreatedAt = (name = "created_at") => {
  return timestamp(name, {
    precision: 3,
    mode: "string",
  })
    .notNull()
    .defaultNow();
};

export const useUpdatedAt = (name = "updated_at") => {
  return timestamp(name, {
    precision: 3,
    mode: "string",
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString());
};

export const useDeletedAt = (name = "deleted_at") => {
  return timestamp(name, {
    precision: 3,
    mode: "string",
  });
};

export const useTimestamp = () => {
  return {
    createdAt: useCreatedAt(),
    updatedAt: useUpdatedAt(),
    deletedAt: useDeletedAt(),
  };
};

export const primaryKeyCuid = (columnName: string) => {
  return varchar(columnName, { length: 128 }).primaryKey();
  // .$defaultFn(() => cuid());
};

export const foreignCuid = (columnName: string) => {
  return varchar(columnName, { length: 128 });
};
