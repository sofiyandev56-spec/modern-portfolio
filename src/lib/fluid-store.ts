"use client";

import { useSyncExternalStore } from "react";

export interface FluidCardItem {
  id: string;
  element: HTMLElement;
  imageUrl: string;
  isHovered: boolean;
}

const cardsMap = new Map<string, FluidCardItem>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function registerFluidCard(card: Omit<FluidCardItem, "isHovered">): () => void {
  cardsMap.set(card.id, { ...card, isHovered: false });
  notify();

  return () => {
    cardsMap.delete(card.id);
    notify();
  };
}

export function updateFluidCardHover(id: string, isHovered: boolean) {
  const existing = cardsMap.get(id);
  if (existing && existing.isHovered !== isHovered) {
    existing.isHovered = isHovered;
    // We don't necessarily need to trigger full React re-renders on hover
    // if the shader reads the reference, but notifying keeps state consistent.
    notify();
  }
}

export function getFluidCards(): FluidCardItem[] {
  return Array.from(cardsMap.values());
}

let cachedCards: FluidCardItem[] = [];

export function useFluidCards(): FluidCardItem[] {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => {
      const arr = Array.from(cardsMap.values());
      // Return same reference if length and ids didn't change
      if (
        arr.length === cachedCards.length &&
        arr.every((c, i) => c.id === cachedCards[i]?.id && c.isHovered === cachedCards[i]?.isHovered)
      ) {
        return cachedCards;
      }
      cachedCards = arr;
      return cachedCards;
    },
    () => []
  );
}
