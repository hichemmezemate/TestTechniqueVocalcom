using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(Guid id);
        Task AddAsync(Order order);
        Task UpdateStatusAsync(Guid id, OrderStatus status);
        Task DeleteAsync(Guid id);
    }
}
