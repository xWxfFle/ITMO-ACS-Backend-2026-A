import { Elysia, t } from "elysia";
import {
  ApiError,
  ExperienceLevelDto,
  IndustryDto,
  SkillDto,
  paginated,
} from "../schemas";

export const catalogRoutes = new Elysia({ name: "catalog" })
  .get(
    "/industries",
    () => ({
      items: [{ id: 1, name: "IT" }],
    }),
    {
      detail: {
        summary: "Список отраслей",
        tags: ["catalog"],
      },
      response: {
        200: t.Object({ items: t.Array(IndustryDto) }),
      },
    }
  )
  .get(
    "/experience-levels",
    () => ({
      items: [
        { id: 1, code: "junior", name: "Junior", sortOrder: 10 },
        { id: 2, code: "middle", name: "Middle", sortOrder: 20 },
      ],
    }),
    {
      detail: {
        summary: "Уровни опыта",
        description: "Справочник для фильтра вакансий и полей резюме.",
        tags: ["catalog"],
      },
      response: {
        200: t.Object({ items: t.Array(ExperienceLevelDto) }),
      },
    }
  )
  .get(
    "/skills",
    ({ query }) => ({
      items: [{ id: 1, name: "TypeScript" }],
      total: 1,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
    }),
    {
      detail: {
        summary: "Каталог навыков",
        description: "Пагинация и поиск по подстроке в названии.",
        tags: ["catalog"],
      },
      query: t.Object({
        q: t.Optional(t.String()),
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
      }),
      response: {
        200: paginated(SkillDto),
        400: ApiError,
      },
    }
  );
