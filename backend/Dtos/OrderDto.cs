using System;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.Dtos
{
    public class OrderDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Le nom du client est requis.")]
        [MinLength(1, ErrorMessage = "Le nom du client ne doit pas être vide.")]
        public string ClientName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le montant total est requis.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Le montant total doit être supérieur à 0.")]
        public double TotalAmount { get; set; }

        [Required(ErrorMessage = "Le statut est requis.")]
        [EnumDataType(typeof(OrderStatus), ErrorMessage = "Le statut doit être Pending, Completed ou Cancelled.")]
        public OrderStatus Status { get; set; }
    }

    public class UpdateOrderStatusDto
    {
        [Required(ErrorMessage = "Le statut est requis.")]
        [EnumDataType(typeof(OrderStatus), ErrorMessage = "Le statut doit être Pending, Completed ou Cancelled.")]
        public OrderStatus Status { get; set; }
    }
}
