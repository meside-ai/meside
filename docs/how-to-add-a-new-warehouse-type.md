How to add a new warehouse type

1. add new warehouse type to the warehouse type enum

```
./server/db/schema/warehouse.ts
```

2. generate database changes

``` bash
bun run generate
```

3. run database migrations

``` bash
bun run migrate
```

4. Copy the postgres.ts to mysql.ts

``` bash
cp server/warehouse/warehouse/postgres.ts server/warehouse/warehouse/mysql.ts
```

5. Implement the mysql version
> server/warehouse/warehouse/mysql.ts

6. mount the mysql.ts to warehouse factory

> server/warehouse/warehouse.ts

7. update frontend to add the new warehouse type

> frontend/src/components/warehouse/choose-warehouse.tsx
