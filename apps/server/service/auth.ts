import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { environment } from "../configs/environment";
import { getDrizzle } from "../db/db";
import { sessionTable } from "../db/schema/session";
import { type UserEntity, userTable } from "../db/schema/user";
import { cuid } from "../utils/cuid";
import { firstOrNotCreated, firstOrNotFound } from "../utils/toolkit";

const JWT_SECRET = new TextEncoder().encode(environment.JWT_SECRET);
const GOOGLE_CLIENT_ID = environment.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Create functions instead of static class methods to avoid linter errors
export async function registerUser(
  email: string,
  username: string,
  password: string,
): Promise<UserEntity> {
  // Use SubtleCrypto for password hashing
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
  const salt = Buffer.from(saltBuffer).toString("hex");

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    Buffer.concat([passwordBuffer, saltBuffer]),
  );
  const hashedPassword = `${Buffer.from(hashBuffer).toString("hex")}.${salt}`;

  const user = firstOrNotCreated(
    await getDrizzle()
      .insert(userTable)
      .values({
        userId: cuid(),
        email,
        name: username,
        passwordHash: hashedPassword,
        googleId: null,
        avatar: null,
      })
      .returning(),
    `Failed to create user ${email}`,
  );

  return user;
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<{
  user: UserEntity;
  token: string;
  refreshToken: string;
}> {
  const users = await getDrizzle()
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));
  const user = firstOrNotFound(users, `User ${email} not found`);

  if (!user.passwordHash) {
    throw new Error("No password found for user");
  }

  // Verify password using SubtleCrypto
  const [hash, salt] = user.passwordHash.split(".");
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = Buffer.from(salt || "", "hex");

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    Buffer.concat([passwordBuffer, Buffer.from(saltBuffer)]),
  );
  const computedHash = Buffer.from(hashBuffer).toString("hex");

  if (computedHash !== hash) {
    throw new Error("Password is incorrect");
  }

  const { token, refreshToken } = await generateTokens(user);

  await getDrizzle()
    .insert(sessionTable)
    .values({
      sessionId: cuid(),
      userId: user.userId,
      refreshToken: refreshToken,
      expiresAt: addDays(new Date(), 7).toISOString(),
    });

  return {
    user,
    token,
    refreshToken,
  };
}

export async function loginWithGoogle(idToken: string): Promise<{
  user: UserEntity;
  token: string;
  refreshToken: string;
}> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  let user: UserEntity = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(userTable)
      .where(eq(userTable.email, payload.email)),
    `User ${payload.email} not found`,
  );

  if (!user) {
    const newUser = firstOrNotCreated(
      await getDrizzle()
        .insert(userTable)
        .values({
          userId: cuid(),
          passwordHash: null,
          avatar: null,
          email: payload.email,
          name: `${payload.email.split("@")[0]}_${cuid()}`,
          googleId: payload.sub,
        })
        .returning(),
      `Failed to create user ${payload.email}`,
    );
    user = newUser;
  }

  const { token, refreshToken } = await generateTokens(user);

  await getDrizzle()
    .insert(sessionTable)
    .values({
      sessionId: cuid(),
      userId: user.userId,
      refreshToken: refreshToken,
      expiresAt: addDays(new Date(), 7).toISOString(),
    });

  return {
    user,
    token,
    refreshToken,
  };
}

export async function refreshToken(refreshToken: string): Promise<{
  token: string;
  refreshToken: string;
}> {
  const session = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.refreshToken, refreshToken)),
    `Session ${refreshToken} not found`,
  );

  if (new Date() > new Date(session.expiresAt)) {
    throw new Error("Invalid or expired refresh token");
  }

  const { token: newToken, refreshToken: newRefreshToken } =
    await generateTokens({ userId: session.userId });

  await getDrizzle()
    .update(sessionTable)
    .set({
      refreshToken: newRefreshToken,
      expiresAt: addDays(new Date(), 7).toISOString(),
    })
    .where(eq(sessionTable.sessionId, session.sessionId));

  return {
    token: newToken,
    refreshToken: newRefreshToken,
  };
}

async function generateTokens(user: { userId: string }): Promise<{
  token: string;
  refreshToken: string;
}> {
  const jose = await import("jose");
  const jwt = await new jose.SignJWT({ userId: user.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET);

  const refreshToken = crypto.randomUUID();

  return {
    token: jwt,
    refreshToken,
  };
}

export const getUserById = async (userId: string): Promise<UserEntity> => {
  const user = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(userTable)
      .where(eq(userTable.userId, userId))
      .limit(1),
    `User ${userId} not found`,
  );

  return user;
};

/**
 * Verifies a JWT token and returns the payload
 */
export const verifyToken = async (
  token: string,
): Promise<{ userId: string }> => {
  const jose = await import("jose");
  const { payload } = await jose.jwtVerify(token, JWT_SECRET);
  return payload as { userId: string };
};
