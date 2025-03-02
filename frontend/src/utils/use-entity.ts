import { useMap } from "ahooks";
import { useCallback, useMemo, useState } from "react";

export type EntitiesState<Entity extends Record<string, unknown>> = Entity[];
export type EntitiesAction<Entity extends Record<string, unknown>> = {
  setAll: (entities: Entity[]) => void;
  add: (entity: Entity) => void;
  update: (entity: Entity) => void;
  remove: (id: Entity[keyof Entity]) => void;
  move: (id: Entity[keyof Entity], index: number) => void;
};

export const useEntity = <Entity extends Record<string, unknown>>(
  initial: Entity[] | undefined | null,
  idName: keyof Entity,
): [EntitiesState<Entity>, EntitiesAction<Entity>] => {
  const [map, actions] = useMap<Entity[keyof Entity], Entity>(
    initial?.map((entity) => [entity[idName], entity]) ?? [],
  );
  const [ids, setIds] = useState<Array<Entity[keyof Entity]>>(
    initial?.map((entity) => entity[idName]) ?? [],
  );

  const entities = useMemo<Entity[]>(() => {
    return ids.map((id) => map.get(id) as Entity).filter(Boolean);
  }, [map, ids]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const setAll = useCallback(
    (entities: Entity[]) => {
      actions.setAll(entities.map((entity) => [entity[idName], entity]));
      setIds(entities.map((entity) => entity[idName]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idName],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const add = useCallback(
    (entity: Entity | Entity[]) => {
      if (Array.isArray(entity)) {
        for (const e of entity) {
          add(e);
        }
      } else {
        const id = entity[idName];
        actions.set(id, entity);
        setIds((prev) => [...prev, id]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idName],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const update = useCallback(
    (entity: Entity) => {
      actions.set(entity[idName], entity);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idName],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const remove = useCallback((id: Entity[keyof Entity]) => {
    actions.remove(id);
    setIds((prev) => prev.filter((currentId) => currentId !== id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = useCallback((id: Entity[keyof Entity], index: number) => {
    setIds((prev) => {
      const newIds = [...prev];
      newIds.splice(prev.indexOf(id), 1);
      newIds.splice(index, 0, id);
      return newIds;
    });
  }, []);

  const newAction = useMemo(() => {
    return {
      setAll,
      add,
      update,
      remove,
      move,
    };
  }, [add, move, remove, setAll, update]);

  return [entities, newAction];
};
