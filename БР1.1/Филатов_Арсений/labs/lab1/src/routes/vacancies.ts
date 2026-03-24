import { Elysia, t } from "elysia";
import {
  ApiError,
  SkillDto,
  VacancyDto,
  VacancyListItem,
  paginated,
} from "../schemas";

const vacancy = {
  id: 1,
  companyId: 1,
  industryId: 1,
  experienceLevelId: 2,
  title: "Middle Backend",
  description: "Разработка API",
  requirements: "TypeScript, PostgreSQL",
  salaryMin: 150000,
  salaryMax: 250000,
  currency: "RUB",
  employmentType: "full_time" as const,
  status: "published" as const,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const vacanciesRoutes = new Elysia({ name: "vacancies" })
  .get(
    "/vacancies",
    ({ query }) => ({
      items: [
        {
          id: 1,
          companyId: 1,
          companyName: "ООО Ромашка",
          title: "Middle Backend",
          salaryMin: 150000,
          salaryMax: 250000,
          currency: "RUB",
          industryId: 1,
          experienceLevelId: 2,
          status: "published" as const,
          publishedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
    }),
    {
      detail: {
        summary: "Поиск вакансий",
        description:
          "Фильтры: отрасль, диапазон зарплаты, уровень опыта, текстовый поиск. Соответствует полям Vacancy и Industry/ExperienceLevel.",
        tags: ["vacancies"],
      },
      query: t.Object({
        industryId: t.Optional(t.Numeric()),
        experienceLevelId: t.Optional(t.Numeric()),
        salaryMin: t.Optional(t.Numeric()),
        salaryMax: t.Optional(t.Numeric()),
        q: t.Optional(t.String()),
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
      }),
      response: {
        200: paginated(VacancyListItem),
        400: ApiError,
      },
    }
  )
  .get(
    "/vacancies/:vacancyId",
    ({ params }) => ({ ...vacancy, id: params.vacancyId }),
    {
      detail: {
        summary: "Детали вакансии",
        tags: ["vacancies"],
      },
      params: t.Object({ vacancyId: t.Numeric() }),
      response: {
        200: VacancyDto,
        404: ApiError,
      },
    }
  )
  .post(
    "/companies/:companyId/vacancies",
    ({ params, body }) => ({
      ...vacancy,
      id: 2,
      companyId: params.companyId,
      title: body.title,
      description: body.description,
      requirements: body.requirements,
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      currency: body.currency,
      employmentType: body.employmentType,
      industryId: body.industryId,
      experienceLevelId: body.experienceLevelId,
      status: body.status ?? "draft",
    }),
    {
      detail: {
        summary: "Создать вакансию",
        tags: ["vacancies"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ companyId: t.Numeric() }),
      body: t.Object({
        title: t.String(),
        description: t.String(),
        requirements: t.Optional(t.String()),
        salaryMin: t.Optional(t.Numeric()),
        salaryMax: t.Optional(t.Numeric()),
        currency: t.String(),
        employmentType: t.Union([
          t.Literal("full_time"),
          t.Literal("part_time"),
          t.Literal("contract"),
        ]),
        industryId: t.Numeric(),
        experienceLevelId: t.Numeric(),
        status: t.Optional(
          t.Union([t.Literal("draft"), t.Literal("published"), t.Literal("closed")])
        ),
      }),
      response: {
        201: VacancyDto,
        400: ApiError,
        401: ApiError,
        403: ApiError,
      },
    }
  )
  .patch(
    "/vacancies/:vacancyId",
    ({ params, body }) => ({
      ...vacancy,
      id: params.vacancyId,
      ...body,
      updatedAt: new Date().toISOString(),
    }),
    {
      detail: {
        summary: "Обновить вакансию",
        tags: ["vacancies"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ vacancyId: t.Numeric() }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        requirements: t.Optional(t.String()),
        salaryMin: t.Optional(t.Numeric()),
        salaryMax: t.Optional(t.Numeric()),
        currency: t.Optional(t.String()),
        employmentType: t.Optional(
          t.Union([
            t.Literal("full_time"),
            t.Literal("part_time"),
            t.Literal("contract"),
          ])
        ),
        industryId: t.Optional(t.Numeric()),
        experienceLevelId: t.Optional(t.Numeric()),
        status: t.Optional(
          t.Union([t.Literal("draft"), t.Literal("published"), t.Literal("closed")])
        ),
      }),
      response: {
        200: VacancyDto,
        401: ApiError,
        403: ApiError,
        404: ApiError,
      },
    }
  )
  .delete(
    "/vacancies/:vacancyId",
    ({ params }) => ({ deleted: true, id: params.vacancyId }),
    {
      detail: {
        summary: "Удалить вакансию (или закрыть)",
        tags: ["vacancies"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ vacancyId: t.Numeric() }),
      response: {
        200: t.Object({ deleted: t.Boolean(), id: t.Number() }),
        401: ApiError,
        403: ApiError,
        404: ApiError,
      },
    }
  )
  .put(
    "/vacancies/:vacancyId/skills",
    ({ params, body }) => ({
      vacancyId: params.vacancyId,
      skillIds: body.skillIds,
      skills: body.skillIds.map((id) => ({ id, name: "Skill" })),
    }),
    {
      detail: {
        summary: "Заменить требуемые навыки вакансии",
        description: "Связь M:N Vacancy — Skill.",
        tags: ["vacancies"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ vacancyId: t.Numeric() }),
      body: t.Object({
        skillIds: t.Array(t.Number()),
      }),
      response: {
        200: t.Object({
          vacancyId: t.Number(),
          skillIds: t.Array(t.Number()),
          skills: t.Array(SkillDto),
        }),
        400: ApiError,
        401: ApiError,
        404: ApiError,
      },
    }
  );
