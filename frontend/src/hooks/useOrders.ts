import { useState, useEffect, useMemo, useCallback } from 'react';
import { OrderStatus } from '../types';
import type { Order, CreateOrderDto } from '../types';
import { OrderService } from '../Services/OrderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = useCallback(async (dto: CreateOrderDto) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await OrderService.createOrder(dto);
      setOrders((prev) => [...prev, newOrder]);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout de la commande.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    setError(null);
    try {
      await OrderService.updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de statut.');
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    setError(null);
    try {
      await OrderService.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la commande.');
      throw err;
    }
  }, []);

  // Chargement des données au démarrage
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Derived statistics using useMemo
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const pendingCount = orders.filter((o) => o.status === OrderStatus.Pending).length;
    const completedCount = orders.filter((o) => o.status === OrderStatus.Completed).length;
    const cancelledCount = orders.filter((o) => o.status === OrderStatus.Cancelled).length;
    const totalRevenue = orders
      .filter((o) => o.status === OrderStatus.Completed)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalCount,
      pendingCount,
      completedCount,
      cancelledCount,
      totalRevenue,
    };
  }, [orders]);

  return {
    orders,
    loading,
    error,
    stats,
    fetchOrders,
    addOrder,
    updateStatus,
    deleteOrder,
  };
};
