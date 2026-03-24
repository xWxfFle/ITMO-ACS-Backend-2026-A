import { Elysia, t } from "elysia";
import { ApiError, TokenPair, UserPublic } from "../schemas";

const exampleUser = {
  id: 1,
  email: "user@example.com",
  roleId: 1,
  roleCode: "candidate" as const,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const authRoutes = new Elysia({ name: "auth" }).group("/auth", (app) =>
  app
    .post(
      "/register",
      () => ({
        user: exampleUser,
        ...{
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
          refreshToken: "refresh.example",
          tokenType: "Bearer" as const,
          expiresIn: 3600,
        },
      }),
      {
        detail: {
          summary: "Регистрация",
          description:
            "Создание пользователя с ролью соискателя или работодателя. Пароль передаётся в теле и не возвращается.",
          tags: ["auth"],
        },
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String({ minLength: 8, description: "Пароль (в БД хранится только хэш)" }),
          roleCode: t.Union([t.Literal("candidate"), t.Literal("employer")]),
        }),
        response: {
          201: t.Object({
            user: UserPublic,
            accessToken: t.String(),
            refreshToken: t.String(),
            tokenType: t.Literal("Bearer"),
            expiresIn: t.Number(),
          }),
          400: ApiError,
          409: ApiError,
        },
      }
    )
    .post(
      "/login",
      () => ({
        user: exampleUser,
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
        refreshToken: "refresh.example",
        tokenType: "Bearer" as const,
        expiresIn: 3600,
      }),
      {
        detail: {
          summary: "Вход",
          description: "Выдача пары access/refresh токенов при верных учётных данных.",
          tags: ["auth"],
        },
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String(),
        }),
        response: {
          200: t.Object({
            user: UserPublic,
            accessToken: t.String(),
            refreshToken: t.String(),
            tokenType: t.Literal("Bearer"),
            expiresIn: t.Number(),
          }),
          401: ApiError,
          422: ApiError,
        },
      }
    )
    .post(
      "/refresh",
      () => ({
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refreshed",
        refreshToken: "refresh.new",
        tokenType: "Bearer" as const,
        expiresIn: 3600,
      }),
      {
        detail: {
          summary: "Обновление access-токена",
          tags: ["auth"],
        },
        body: t.Object({
          refreshToken: t.String(),
        }),
        response: {
          200: TokenPair,
          401: ApiError,
        },
      }
    )
);
