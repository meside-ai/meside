import { Stack, Text } from "@mantine/core";
import { type IdSchema, errorId } from "@rjsf/utils";
import type { ReactNode } from "react";
/**
 * Create error components from errors array
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function createErrors<T = any>(
  errors: (string | ReactNode)[] | undefined | null,
  hideError: boolean | undefined | null, // it's okay to pass undefined here, but do not omit it
  idSchema?: IdSchema<T>,
): ReactNode | null {
  if (hideError || !errors || errors.length === 0) {
    return null;
  }
  return (
    <Stack id={idSchema && errorId(idSchema.$id)}>
      {errors.map((error, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Text key={index} c="red" size="xs">
          {error}
        </Text>
      ))}
    </Stack>
  );
}
