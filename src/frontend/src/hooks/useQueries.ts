import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addOffer,
  addOrder,
  deleteOffer,
  getAddonOffers,
  getMainOffers,
  getOfferById,
  getOffers,
  getOrders,
  getSettings,
  saveSettings,
  updateOffer,
  updateOrderStatus,
} from "../lib/storage";
import type { Offer, Order, OrderStatus, Settings } from "../lib/types";

// ── Offers ─────────────────────────────────────────────────────────────────
export function useActiveOffers() {
  return useQuery<Offer[]>({
    queryKey: ["offers", "active"],
    queryFn: getMainOffers,
    staleTime: 30_000,
  });
}

export function useAddonOffers() {
  return useQuery<Offer[]>({
    queryKey: ["offers", "addons"],
    queryFn: getAddonOffers,
    staleTime: 30_000,
  });
}

export function useAllOffers() {
  return useQuery<Offer[]>({
    queryKey: ["offers", "all"],
    queryFn: getOffers,
    staleTime: 10_000,
  });
}

export function useOffer(id: string) {
  return useQuery<Offer | null>({
    queryKey: ["offer", id],
    queryFn: () => getOfferById(id),
    enabled: !!id,
  });
}

export function useAddOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offer: Offer) => {
      addOffer(offer);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offer: Offer) => {
      updateOffer(offer);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      deleteOffer(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

// ── Orders ─────────────────────────────────────────────────────────────────
export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 10_000,
  });
}

export function useAddOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order: Order) => {
      addOrder(order);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => {
      updateOrderStatus(id, status);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ── Settings ───────────────────────────────────────────────────────────────
export function useSettings() {
  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 30_000,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: Settings) => {
      saveSettings(settings);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
