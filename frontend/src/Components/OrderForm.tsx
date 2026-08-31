import React, { useState } from 'react';
import { OrderStatus } from '../types';
import type { CreateOrderDto } from '../types';

interface OrderFormProps {
  onAddOrder: (order: CreateOrderDto) => Promise<void>;
  disabled?: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onAddOrder, disabled }) => {
  const [clientName, setClientName] = useState('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.Pending);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Validations en temps réel
  const isClientNameValid = clientName.trim().length > 0;
  const isTotalAmountValid = !isNaN(parseFloat(totalAmount)) && parseFloat(totalAmount) > 0;
  const isFormValid = isClientNameValid && isTotalAmountValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || disabled) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await onAddOrder({
        clientName: clientName.trim(),
        totalAmount: parseFloat(totalAmount),
        status,
      });
      // Réinitialiser les champs après succès
      setClientName('');
      setTotalAmount('');
      setStatus(OrderStatus.Pending);
    } catch (err: any) {
      setFormError(err.message || "Impossible d'ajouter la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form-card" aria-label="Ajouter une commande">
      <h3 className="form-title">Nouvelle Commande</h3>

      {formError && (
        <div className="error-alert" role="alert">
          {formError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="clientName">Nom du Client *</label>
        <input
          id="clientName"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Ex: Jean Dupont"
          className={clientName.trim() === '' ? 'input-error' : 'input-success'}
          disabled={disabled || isSubmitting}
          required
        />
        {clientName.trim() === '' && (
          <span className="field-hint error-text">Le nom du client est requis.</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="totalAmount">Montant Total (€) *</label>
        <input
          id="totalAmount"
          type="number"
          step="0.01"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Ex: 150.50"
          className={!isTotalAmountValid ? 'input-error' : 'input-success'}
          disabled={disabled || isSubmitting}
          required
        />
        {!isTotalAmountValid && (
          <span className="field-hint error-text">Le montant doit être supérieur à 0.</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="orderStatus">Statut Initial</label>
        <select
          id="orderStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          disabled={disabled || isSubmitting}
        >
          <option value={OrderStatus.Pending}>En attente (Pending)</option>
          <option value={OrderStatus.Completed}>Complétée (Completed)</option>
          <option value={OrderStatus.Cancelled}>Annulée (Cancelled)</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-submit"
        disabled={!isFormValid || isSubmitting || disabled}
      >
        {isSubmitting ? 'Création...' : 'Ajouter la commande'}
      </button>
    </form>
  );
};
export default OrderForm;
