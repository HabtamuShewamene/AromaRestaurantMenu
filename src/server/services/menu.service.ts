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
      addonGroups: {
        include: {
          options: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
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
      addonGroups: {
        include: {
          options: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
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

export async function setAddonAvailability(optionId: string, isAvailable: boolean) {
  return prisma.addonOption.update({
    where: { id: optionId },
    data: { isAvailable },
  });
}
