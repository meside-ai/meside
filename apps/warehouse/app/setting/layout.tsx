import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  Button,
  NavLink,
} from "@mantine/core";
import Link from "next/link";
import { warehouseService } from "../../services/warehouse";
export default async function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const warehouses = await warehouseService.getWarehouseList();

  return (
    <AppShell navbar={{ width: 300, breakpoint: "sm" }} padding="md">
      <AppShellNavbar p="md">
        <AppShellSection grow>
          {warehouses.map((warehouse) => (
            <NavLink
              key={warehouse.warehouseId}
              component={Link}
              href={`/setting/warehouse/${warehouse.warehouseId}`}
              label={warehouse.name}
              variant="filled"
            />
          ))}
        </AppShellSection>
        <AppShellSection>
          <Button component={Link} href="/setting/warehouse/create">
            Create Warehouse
          </Button>
        </AppShellSection>
      </AppShellNavbar>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
