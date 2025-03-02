import type { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  type EntitiesAction,
  type EntitiesState,
  useEntity,
} from "./use-entity";

export const useQueryEntity = <
  Entity extends Record<string, unknown>,
  TError = unknown, // TODO: fix this
>(
  queryResult: UseQueryResult<Entity[], TError>,
  idName: keyof Entity,
): [EntitiesState<Entity>, EntitiesAction<Entity>] => {
  const [entitiesState, entitiesAction] = useEntity<Entity>([], idName);

  const { data } = queryResult;

  useEffect(() => {
    if (data) {
      entitiesAction.setAll(data);
    }
  }, [data, entitiesAction]);

  return [entitiesState, entitiesAction];
};
