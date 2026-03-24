import { Elysia, t } from "elysia";
import { ApiError, ApplicationDto, paginated } from "../schemas";

const application = {
  id: 1,
  vacancyId: 10,
  userId: 1,
  resumeId: 1,
  status: "new" as const,
  createdAt: new Date().toISOString(),
};

export const applicationsRoutes = new Elysia({ name: "applications" })
  .post(
    "/vacancies/:vacancyId/applications",
    ({ params, body }) => ({
      ...application,
      id: 2,
      vacancyId: params.vacancyId,
      resumeId: body.resumeId,
    }),
    {
      detail: {
        summary: "Откликнуться на вакансию",
        description: "Создаёт Application с ссылкой на выбранное резюме.",
        tags: ["applications"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ vacancyId: t.Numeric() }),
      body: t.Object({
        resumeId: t.Numeric(),
      }),
      response: {
        201: ApplicationDto,
        400: ApiError,
        401: ApiError,
        404: ApiError,
        409: ApiError,
      },
    }
  )
  .get(
    "/me/applications",
    ({ query }) => ({
      items: [application],
      total: 1,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
    }),
    {
      detail: {
        summary: "Мои отклики",
        tags: ["applications"],
        security: [{ bearerAuth: [] }],
      },
      query: t.Object({
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
      }),
      response: {
        200: paginated(ApplicationDto),
        401: ApiError,
      },
    }
  )
  .get(
    "/vacancies/:vacancyId/applications",
    ({ params, query }) => ({
      items: [application],
      total: 1,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
    }),
    {
      detail: {
        summary: "Отклики на вакансию (работодатель)",
        tags: ["applications"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ vacancyId: t.Numeric() }),
      query: t.Object({
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
      }),
      response: {
        200: paginated(ApplicationDto),
        401: ApiError,
        403: ApiError,
        404: ApiError,
      },
    }
  )
  .patch(
    "/applications/:applicationId",
    ({ params, body }) => ({
      ...application,
      id: params.applicationId,
      status: body.status,
    }),
    {
      detail: {
        summary: "Обновить статус отклика",
        description: "Действие работодателя: viewed / rejected / invited.",
        tags: ["applications"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ applicationId: t.Numeric() }),
      body: t.Object({
        status: t.Union([
          t.Literal("new"),
          t.Literal("viewed"),
          t.Literal("rejected"),
          t.Literal("invited"),
        ]),
      }),
      response: {
        200: ApplicationDto,
        400: ApiError,
        401: ApiError,
        403: ApiError,
        404: ApiError,
      },
    }
  );
