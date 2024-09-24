using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaCalcBackend.Models
{
    public class Expense
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, 1000000000, ErrorMessage = "Price must be between 0 and 1,000,000,000.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "PercentageMarkup is required.")]
        [Column(TypeName = "decimal(5,2)")]
        [Range(0, 100, ErrorMessage = "PercentageMarkup must be between 0 and 100.")]
        public decimal PercentageMarkup { get; set; }

        [NotMapped]
        public decimal TotalPrice => Math.Round(Price + (Price * PercentageMarkup / 100), 2, MidpointRounding.AwayFromZero);
    }
}