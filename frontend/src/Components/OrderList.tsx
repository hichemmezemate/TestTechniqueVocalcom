import React, { useState } from 'react';
import { OrderStatus as StatusEnum } from '../types';
import type { Order } from '../types';
import OrderStatus from './OrderStatus';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, newStatus: StatusEnum) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  loading?: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onStatusChange,
  onDeleteOrder,
  loading
}) => {
  const [filter, setFilter] = useState<StatusEnum | 'All'>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'All') return true;
    return order.status === filter;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteOrder(id);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression de la commande.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="order-list-container">
      <div className="list-header">
        <h3 className="list-title">Liste des Commandes ({filteredOrders.length})</h3>
        <div className="filter-group">
          <label htmlFor="statusFilter">Filtrer par : </label>
          <select
            id="statusFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as StatusEnum | 'All')}
            className="filter-select"
          >
            <option value="All">Toutes</option>
            <option value={StatusEnum.Pending}>En attente</option>
            <option value={StatusEnum.Completed}>Complétées</option>
            <option value={StatusEnum.Cancelled}>Annulées</option>
          </select>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Chargement des commandes...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>Aucune commande enregistrée pour ce filtre.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="order-row">
                  <td className="order-id" title={order.id}>
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="order-client">{order.clientName}</td>
                  <td className="order-amount">{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <OrderStatus
                      status={order.status}
                      onStatusChange={(newStatus) => onStatusChange(order.id, newStatus)}
                      disabled={deletingId === order.id}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="btn btn-danger"
                      disabled={deletingId === order.id}
                      aria-label={`Supprimer la commande de ${order.clientName}`}
                    >
                      {deletingId === order.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default OrderList;
