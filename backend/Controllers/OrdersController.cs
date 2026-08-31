using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Backend.Entities;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _repository;

        public OrdersController(IOrderRepository repository)
        {
            _repository = repository;
        }

        // GET /api/orders
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OrderDto>))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
        {
            try
            {
                var orders = await _repository.GetAllAsync();
                var dtos = orders.Select(o => new OrderDto
                {
                    Id = o.Id,
                    ClientName = o.ClientName,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status
                });
                return Ok(dtos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Une erreur interne est survenue.", details = ex.Message });
            }
        }

        // GET /api/orders/{id}
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OrderDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<OrderDto>> GetById(Guid id)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = $"Commande avec l'ID {id} non trouvée." });
                }

                var dto = new OrderDto
                {
                    Id = order.Id,
                    ClientName = order.ClientName,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status
                };
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Une erreur interne est survenue.", details = ex.Message });
            }
        }

        // POST /api/orders
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(OrderDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<OrderDto>> Create([FromBody] OrderDto orderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (string.IsNullOrWhiteSpace(orderDto.ClientName))
                {
                    return BadRequest(new { message = "Le nom du client ne doit pas être vide." });
                }

                if (orderDto.TotalAmount <= 0)
                {
                    return BadRequest(new { message = "Le montant total doit être supérieur à 0." });
                }

                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    ClientName = orderDto.ClientName,
                    TotalAmount = orderDto.TotalAmount,
                    Status = orderDto.Status
                };

                await _repository.AddAsync(order);

                var createdDto = new OrderDto
                {
                    Id = order.Id,
                    ClientName = order.ClientName,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status
                };

                return CreatedAtAction(nameof(GetById), new { id = order.Id }, createdDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Une erreur interne est survenue.", details = ex.Message });
            }
        }

        // PUT /api/orders/{id}
        [HttpPut("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var order = await _repository.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = $"Commande avec l'ID {id} non trouvée." });
                }

                await _repository.UpdateStatusAsync(id, updateDto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Une erreur interne est survenue.", details = ex.Message });
            }
        }

        // DELETE /api/orders/{id}
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = $"Commande avec l'ID {id} non trouvée." });
                }

                await _repository.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Une erreur interne est survenue.", details = ex.Message });
            }
        }
    }
}
