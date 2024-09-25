using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaCalcBackend.Data;
using CinemaCalcBackend.Models;

namespace CinemaCalcBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly CinemaCalcContext _context;
        private const decimal MaxPrice = 1000000000m; // 1 billion

        public ExpensesController(CinemaCalcContext context)
        {
            _context = context;
        }

        // GET: api/Expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            return await _context.Expenses.ToListAsync();
        }

        // GET: api/Expenses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound(new { Message = $"Expense with ID {id} not found." });
            }
            return expense;
        }

        // POST: api/Expenses
        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense([FromBody] Expense expense)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = ValidateExpense(expense);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult.ErrorMessage });
            }

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
        }

        // PUT: api/Expenses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpense(int id, [FromBody] Expense expense)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = ValidateExpense(expense);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult.ErrorMessage });
            }

            _context.Entry(expense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpenseExists(id))
                {
                    return NotFound(new { Message = $"Expense with ID {id} not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound(new { Message = $"Expense with ID {id} not found." });
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Expenses/Total
        [HttpGet("Total")]
        public async Task<ActionResult<decimal>> GetTotalExpenses()
        {
            // Retrieve all expenses from the database
            var expenses = await _context.Expenses.ToListAsync();

            // Perform the sum of TotalPrice in memory
            var total = expenses.Sum(e => e.TotalPrice);

            return Ok(total);
        }
        private bool ExpenseExists(int id)
        {
            return _context.Expenses.Any(e => e.Id == id);
        }

        private (bool IsValid, string ErrorMessage) ValidateExpense(Expense expense)
        {
            if (expense.Price < 0)
            {
                return (false, "Price cannot be negative.");
            }

            if (expense.Price > MaxPrice)
            {
                return (false, $"Price cannot exceed {MaxPrice:N2}.");
            }

            if (expense.PercentageMarkup < 0)
            {
                return (false, "Percentage markup cannot be negative.");
            }

            if (expense.PercentageMarkup > 100)
            {
                return (false, "Percentage markup cannot exceed 100%.");
            }

            decimal totalPrice = expense.Price + (expense.Price * expense.PercentageMarkup / 100);
            if (totalPrice > MaxPrice)
            {
                return (false, $"The total price (including markup) exceeds the maximum allowed value of {MaxPrice:N2}.");
            }

            return (true, string.Empty);
        }
    }
}