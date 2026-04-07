import type { Prisma } from "@prisma/client";
import { db } from "../db/client";

export type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>;

export const userWithoutPassword = (user: UserWithRole) => {
  const { passwordHash: _, ...rest } = user;
  return rest;
};

const parseUserId = (authorization?: string, xUserId?: string) => {
  if (xUserId) {
    const fromHeader = Number(xUserId);
    if (Number.isInteger(fromHeader) && fromHeader > 0) return fromHeader;
  }

  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice(7);
  const match = /^access-(\d+)-/.exec(token);
  if (!match) return null;
  return Number(match[1]);
};

export const getAuthUser = async (headers: Record<string, string | undefined>) => {
  const userId = parseUserId(headers.authorization, headers["x-user-id"]) ?? 1;
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  return user;
};

export const createAccessToken = (userId: number) =>
  `access-${userId}-${Math.random().toString(36).slice(2)}`;

export const createRefreshToken = (userId: number) =>
  `refresh-${userId}-${Math.random().toString(36).slice(2)}`;
