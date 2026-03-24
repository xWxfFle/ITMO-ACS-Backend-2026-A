import { Elysia, t } from "elysia";
import { ApiError, CompanyDto, EmployerMembershipDto } from "../schemas";

const company = {
  id: 1,
  industryId: 1,
  name: "ООО Ромашка",
  description: "IT",
  website: "https://example.com",
  legalName: "ООО «Ромашка»",
  createdAt: new Date().toISOString(),
};

export const companiesRoutes = new Elysia({ name: "companies" })
  .post(
    "/companies",
    ({ body }) => ({
      ...company,
      id: 2,
      name: body.name,
      industryId: body.industryId,
      description: body.description,
      website: body.website,
      legalName: body.legalName,
    }),
    {
      detail: {
        summary: "Создать компанию",
        description: "Обычно для роли работодателя; дальше — приглашения в EmployerMembership.",
        tags: ["companies"],
        security: [{ bearerAuth: [] }],
      },
      body: t.Object({
        name: t.String(),
        industryId: t.Numeric(),
        description: t.Optional(t.String()),
        website: t.Optional(t.String()),
        legalName: t.Optional(t.String()),
      }),
      response: {
        201: CompanyDto,
        400: ApiError,
        401: ApiError,
        403: ApiError,
      },
    }
  )
  .get(
    "/companies/:companyId",
    ({ params }) => ({ ...company, id: params.companyId }),
    {
      detail: {
        summary: "Карточка компании",
        description: "Публичные данные для страницы вакансии.",
        tags: ["companies"],
      },
      params: t.Object({ companyId: t.Numeric() }),
      response: {
        200: CompanyDto,
        404: ApiError,
      },
    }
  )
  .patch(
    "/companies/:companyId",
    ({ params, body }) => ({
      ...company,
      id: params.companyId,
      name: body.name ?? company.name,
      industryId: body.industryId ?? company.industryId,
      description: body.description ?? company.description,
      website: body.website ?? company.website,
      legalName: body.legalName ?? company.legalName,
    }),
    {
      detail: {
        summary: "Обновить компанию",
        tags: ["companies"],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({ companyId: t.Numeric() }),
      body: t.Object({
        name: t.Optional(t.String()),
        industryId: t.Optional(t.Numeric()),
        description: t.Optional(t.String()),
        website: t.Optional(t.String()),
        legalName: t.Optional(t.String()),
      }),
      response: {
        200: CompanyDto,
        401: ApiError,
        403: ApiError,
        404: ApiError,
      },
    }
  )
  .get(
    "/me/employer/memberships",
    () => ({
      items: [
        {
          id: 1,
          userId: 1,
          companyId: 1,
          positionTitle: "HR",
          isOwner: true,
        },
      ],
    }),
    {
      detail: {
        summary: "Мои членства в компаниях",
        tags: ["companies"],
        security: [{ bearerAuth: [] }],
      },
      response: {
        200: t.Object({ items: t.Array(EmployerMembershipDto) }),
        401: ApiError,
      },
    }
  );
