import prisma from "@/server/db/prisma";

export async function getMenu(categorySlug?: string) {
  const whereClause: Record<string, any> = {};

  if (categorySlug && categorySlug !== "all") {
    whereClause.category = { slug: categorySlug };
  }

  return prisma.menuItem.findMany({
    where: whereClause,
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        select: { rating: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMenuItemById(id: string) {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: true,
      ingredients: {
        include: { ingredient: true },
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function setItemAvailability(id: string, isAvailable: boolean) {
  return prisma.menuItem.update({
    where: { id },
    data: { isAvailable },
  });
}

