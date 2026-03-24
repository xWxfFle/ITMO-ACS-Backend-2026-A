import { Elysia, t } from "elysia";
import {
  ApiError,
  JobSeekerProfileDto,
  ResumeDto,
  ResumeEducationDto,
  ResumeWorkExperienceDto,
  SkillDto,
} from "../schemas";

const profile = {
  userId: 1,
  firstName: "Иван",
  lastName: "Иванов",
  phone: "+79990000000",
  city: "СПб",
  bio: "Backend-разработчик",
};

export const jobSeekerRoutes = new Elysia({ name: "job-seeker" })
  .get(
    "/job-seeker/profile",
    () => profile,
    {
      detail: {
        summary: "Профиль соискателя",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      response: {
        200: JobSeekerProfileDto,
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .put(
    "/job-seeker/profile",
    ({ body }) => ({ ...profile, ...body }),
    {
      detail: {
        summary: "Обновление профиля соискателя",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      body: t.Object({
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        city: t.Optional(t.String()),
        bio: t.Optional(t.String()),
      }),
      response: {
        200: JobSeekerProfileDto,
        400: ApiError,
        401: ApiError,
      },
    }
  )
  .get(
    "/resumes",
    () => ({
      items: [
        {
          id: 1,
          userId: 1,
          title: "Backend",
          summary: "Node, PostgreSQL",
          updatedAt: new Date().toISOString(),
          isPublic: true,
        },
      ],
    }),
    {
      detail: {
        summary: "Список резюме текущего пользователя",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      response: {
        200: t.Object({ items: t.Array(ResumeDto) }),
        401: ApiError,
      },
    }
  )
  .post(
    "/resumes",
    ({ body }) => ({
      id: 2,
      userId: 1,
      title: body.title,
      summary: body.summary,
      updatedAt: new Date().toISOString(),
      isPublic: body.isPublic ?? false,
    }),
    {
      detail: {
        summary: "Создать резюме",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      body: t.Object({
        title: t.String(),
        summary: t.Optional(t.String()),
        isPublic: t.Optional(t.Boolean()),
      }),
      response: {
        201: ResumeDto,
        400: ApiError,
        401: ApiError,
      },
    }
  )
  .get(
    "/resumes/:resumeId",
    ({ params }) => ({
      id: params.resumeId,
      userId: 1,
      title: "Backend",
      summary: "Node",
      updatedAt: new Date().toISOString(),
      isPublic: true,
    }),
    {
      detail: {
        summary: "Резюме по id",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      response: {
        200: ResumeDto,
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .patch(
    "/resumes/:resumeId",
    ({ params, body }) => ({
      id: params.resumeId,
      userId: 1,
      title: body.title ?? "Backend",
      summary: body.summary ?? "Node",
      updatedAt: new Date().toISOString(),
      isPublic: body.isPublic ?? true,
    }),
    {
      detail: {
        summary: "Обновить резюме",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      body: t.Object({
        title: t.Optional(t.String()),
        summary: t.Optional(t.String()),
        isPublic: t.Optional(t.Boolean()),
      }),
      response: {
        200: ResumeDto,
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .delete(
    "/resumes/:resumeId",
    ({ params }) => ({ deleted: true, id: params.resumeId }),
    {
      detail: {
        summary: "Удалить резюме",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      response: {
        200: t.Object({ deleted: t.Boolean(), id: t.Number() }),
        401: ApiError,
        404: ApiError,
        409: ApiError,
      },
    }
  )
  .get(
    "/resumes/:resumeId/education",
    ({ params }) => ({
      items: [
        {
          id: 1,
          resumeId: params.resumeId,
          institution: "Университет",
          degree: "Бакалавр",
          yearFrom: 2018,
          yearTo: 2022,
        },
      ],
    }),
    {
      detail: {
        summary: "Блок образования резюме",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      response: {
        200: t.Object({ items: t.Array(ResumeEducationDto) }),
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .post(
    "/resumes/:resumeId/education",
    ({ params, body }) => ({
      id: 3,
      resumeId: params.resumeId,
      institution: body.institution,
      degree: body.degree,
      yearFrom: body.yearFrom,
      yearTo: body.yearTo,
    }),
    {
      detail: {
        summary: "Добавить запись об образовании",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      body: t.Object({
        institution: t.String(),
        degree: t.Optional(t.String()),
        yearFrom: t.Optional(t.Number()),
        yearTo: t.Optional(t.Number()),
      }),
      response: {
        201: ResumeEducationDto,
        400: ApiError,
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .patch(
    "/resumes/:resumeId/education/:educationId",
    ({ params, body }) => ({
      id: params.educationId,
      resumeId: params.resumeId,
      institution: body.institution ?? "Университет",
      degree: body.degree,
      yearFrom: body.yearFrom,
      yearTo: body.yearTo,
    }),
    {
      detail: {
        summary: "Обновить запись об образовании",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({
        resumeId: t.Numeric(),
        educationId: t.Numeric(),
      }),
      body: t.Object({
        institution: t.Optional(t.String()),
        degree: t.Optional(t.String()),
        yearFrom: t.Optional(t.Number()),
        yearTo: t.Optional(t.Number()),
      }),
      response: {
        200: ResumeEducationDto,
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .delete(
    "/resumes/:resumeId/education/:educationId",
    ({ params }) => ({ deleted: true, id: params.educationId }),
    {
      detail: {
        summary: "Удалить запись об образовании",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({
        resumeId: t.Numeric(),
        educationId: t.Numeric(),
      }),
      response: {
        200: t.Object({ deleted: t.Boolean(), id: t.Number() }),
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .get(
    "/resumes/:resumeId/work-experience",
    ({ params }) => ({
      items: [
        {
          id: 1,
          resumeId: params.resumeId,
          companyName: "ООО Пример",
          position: "Разработчик",
          description: "API",
          dateFrom: "2022-01-01",
          dateTo: undefined,
        },
      ],
    }),
    {
      detail: {
        summary: "Опыт работы в резюме",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      response: {
        200: t.Object({ items: t.Array(ResumeWorkExperienceDto) }),
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .post(
    "/resumes/:resumeId/work-experience",
    ({ params, body }) => ({
      id: 2,
      resumeId: params.resumeId,
      companyName: body.companyName,
      position: body.position,
      description: body.description,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
    }),
    {
      detail: {
        summary: "Добавить опыт работы",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      body: t.Object({
        companyName: t.String(),
        position: t.String(),
        description: t.Optional(t.String()),
        dateFrom: t.Optional(t.String({ format: "date" })),
        dateTo: t.Optional(t.String({ format: "date" })),
      }),
      response: {
        201: ResumeWorkExperienceDto,
        400: ApiError,
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .patch(
    "/resumes/:resumeId/work-experience/:workExperienceId",
    ({ params, body }) => ({
      id: params.workExperienceId,
      resumeId: params.resumeId,
      companyName: body.companyName ?? "ООО Пример",
      position: body.position ?? "Разработчик",
      description: body.description,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
    }),
    {
      detail: {
        summary: "Обновить опыт работы",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({
        resumeId: t.Numeric(),
        workExperienceId: t.Numeric(),
      }),
      body: t.Object({
        companyName: t.Optional(t.String()),
        position: t.Optional(t.String()),
        description: t.Optional(t.String()),
        dateFrom: t.Optional(t.String({ format: "date" })),
        dateTo: t.Optional(t.String({ format: "date" })),
      }),
      response: {
        200: ResumeWorkExperienceDto,
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .delete(
    "/resumes/:resumeId/work-experience/:workExperienceId",
    ({ params }) => ({ deleted: true, id: params.workExperienceId }),
    {
      detail: {
        summary: "Удалить опыт работы",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({
        resumeId: t.Numeric(),
        workExperienceId: t.Numeric(),
      }),
      response: {
        200: t.Object({ deleted: t.Boolean(), id: t.Number() }),
        401: ApiError,
        404: ApiError,
      },
    }
  )
  .put(
    "/resumes/:resumeId/skills",
    ({ params, body }) => ({
      resumeId: params.resumeId,
      skillIds: body.skillIds,
      skills: body.skillIds.map((id) => ({ id, name: "Skill" })),
    }),
    {
      detail: {
        summary: "Заменить набор навыков резюме",
        description: "Связь M:N с каталогом Skill; тело — полный список id.",
        tags: ["job-seeker"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ resumeId: t.Numeric() }),
      body: t.Object({
        skillIds: t.Array(t.Number()),
      }),
      response: {
        200: t.Object({
          resumeId: t.Number(),
          skillIds: t.Array(t.Number()),
          skills: t.Array(SkillDto),
        }),
        400: ApiError,
        401: ApiError,
        404: ApiError,
      },
    }
  );
