import { Elysia, t } from "elysia";
import { ApiError, UserPublic } from "../schemas";

const me = {
  id: 1,
  email: "user@example.com",
  roleId: 1,
  roleCode: "candidate" as const,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const usersRoutes = new Elysia({ name: "users" })
  .get(
    "/me",
    () => me,
    {
      detail: {
        summary: "Текущий пользователь",
        description: "Данные учётной записи без пароля и хэша.",
        tags: ["users"],
        security: [{ bearerAuth: [] }],
      },
      response: {
        200: UserPublic,
        401: ApiError,
      },
    }
  )
  .patch(
    "/me",
    ({ body }) => ({ ...me, ...body, updatedAt: new Date().toISOString() }),
    {
      detail: {
        summary: "Обновление email / активности",
        description: "Частичное обновление полей пользователя (смена пароля — отдельная операция).",
        tags: ["users"],
        security: [{ bearerAuth: [] }],
      },
      body: t.Object({
        email: t.Optional(t.String({ format: "email" })),
        isActive: t.Optional(t.Boolean()),
      }),
      response: {
        200: UserPublic,
        400: ApiError,
        401: ApiError,
        409: ApiError,
      },
    }
  );
