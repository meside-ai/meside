import { type RedisClientType, createClient } from "redis";
import { environment } from "../configs/environment";

let client: RedisClientType | null = null;

export const getRedis = async () => {
  if (client) {
    return client;
  }

  client = createClient({
    url: environment.REDIS_URL,
  });

  client.on("error", (err) => console.error("Redis Client Error", err));

  await client.connect();

  return client;
};
