type DateLike = Date | null;

const toIso = (v: DateLike) => (v ? v.toISOString() : undefined);

export const mapUserPublic = (user: {
  id: number;
  email: string;
  roleId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: { code: string };
}) => ({
  id: user.id,
  email: user.email,
  roleId: user.roleId,
  roleCode: user.role.code as "candidate" | "employer" | "admin",
  isActive: user.isActive,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const mapVacancy = (vacancy: {
  id: number;
  companyId: number;
  industryId: number;
  experienceLevelId: number;
  title: string;
  description: string;
  requirements: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  employmentType: string;
  status: string;
  publishedAt: DateLike;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  ...vacancy,
  requirements: vacancy.requirements ?? undefined,
  salaryMin: vacancy.salaryMin ?? undefined,
  salaryMax: vacancy.salaryMax ?? undefined,
  employmentType: vacancy.employmentType as "full_time" | "part_time" | "contract",
  status: vacancy.status as "draft" | "published" | "closed",
  publishedAt: toIso(vacancy.publishedAt),
  createdAt: vacancy.createdAt.toISOString(),
  updatedAt: vacancy.updatedAt.toISOString(),
});

export const mapApplication = (a: {
  id: number;
  vacancyId: number;
  userId: number;
  resumeId: number;
  status: string;
  createdAt: Date;
}) => ({
  ...a,
  status: a.status as "new" | "viewed" | "rejected" | "invited",
  createdAt: a.createdAt.toISOString(),
});
