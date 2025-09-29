// src/lib/prisma-service.ts
import { PrismaClient, GeneratedItemType } from '../generated/prisma';
import type { GeneratedItem } from './types';

const prisma = new PrismaClient();

export const addGeneratedItemPrisma = async (
  campaignId: string | null,
  type: GeneratedItem['type'],
  content: any
): Promise<string> => {
  const item = await prisma.generatedItem.create({
    data: {
      campaignId,
      type: type.replace(/-/g, '_') as GeneratedItemType,
      content,
      createdAt: Date.now(),
    },
  });
  return item.id;
};

export const getGeneratedItemsForCampaignPrisma = async (
  campaignId: string
): Promise<GeneratedItem[]> => {
  const items = await prisma.generatedItem.findMany({
    where: { campaignId },
    orderBy: { createdAt: 'desc' },
  });
  return items as GeneratedItem[];
};

export const getAllGeneratedItemsPrisma = async (): Promise<GeneratedItem[]> => {
  const items = await prisma.generatedItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return items as GeneratedItem[];
};

export const getGeneratedItemsByTypePrisma = async (
  type: GeneratedItem['type']
): Promise<GeneratedItem[]> => {
  const items = await prisma.generatedItem.findMany({
    where: { type: type.replace(/-/g, '_') as GeneratedItemType },
    orderBy: { createdAt: 'desc' },
  });
  return items as GeneratedItem[];
};