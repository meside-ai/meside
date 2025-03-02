declare global {
  namespace PrismaJson {
    type MessageStructure = {
      sql: string;
      structure: {
        columns: {
          tableName: string;
          columnName: string;
          columnType: string;
          description: string;
        }[];
      };
    };
  }
}
