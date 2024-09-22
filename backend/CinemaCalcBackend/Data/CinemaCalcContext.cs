using Microsoft.EntityFrameworkCore;
using CinemaCalcBackend.Models;

namespace CinemaCalcBackend.Data
{
    public class CinemaCalcContext : DbContext
    {
        public CinemaCalcContext(DbContextOptions<CinemaCalcContext> options) : base(options) { }

        public DbSet<Expense> Expenses { get; set; }
    }
}

