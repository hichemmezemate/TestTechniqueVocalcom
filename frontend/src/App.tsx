import React from 'react';
import { useOrders } from './hooks/useOrders';
import OrderForm from './Components/OrderForm';
import OrderList from './Components/OrderList';

export const App: React.FC = () => {
  const {
    orders,
    loading,
    error,
    stats,
    fetchOrders,
    addOrder,
    updateStatus,
    deleteOrder
  } = useOrders();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Suivi des Commandes</h1>
        <p className="app-subtitle">Dashboard d'administration et montant des ventes en temps réel</p>
      </header>

      {error && (
        <div className="global-error" role="alert">
          <span><strong>Erreur :</strong> {error}</span>
          <button onClick={fetchOrders} className="btn-retry">Réessayer</button>
        </div>
      )}

      {/* Tableau de bord des statistiques */}
      <section className="stats-grid" aria-label="Statistiques des commandes">
        <div className="stat-card">
          <span className="stat-label">Total Commandes</span>
          <span className="stat-value">{stats.totalCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">En attente</span>
          <span className="stat-value">{stats.pendingCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Complétées</span>
          <span className="stat-value">{stats.completedCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Annulées</span>
          <span className="stat-value">{stats.cancelledCount}</span>
        </div>
        <div className="stat-card revenue">
          <span className="stat-label">Ventes Réalisées</span>
          <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
        </div>
      </section>

      <main className="main-grid">
        <section aria-label="Formulaire de commande">
          <OrderForm onAddOrder={addOrder} disabled={loading} />
        </section>
        <section aria-label="Liste de commandes">
          <OrderList
            orders={orders}
            onStatusChange={updateStatus}
            onDeleteOrder={deleteOrder}
            loading={loading}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
