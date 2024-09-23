using System.ComponentModel.DataAnnotations;

namespace CinemaCalcBackend.Models
{
    public class Expense
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public decimal PercentageMarkup { get; set; }

        public decimal TotalPrice => Price + (Price * (PercentageMarkup / 100));
    }
}
