using System.ComponentModel.DataAnnotations;

namespace ModernizationChallenge.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(500)]
        [MinLength(1)]
        public string Details { get; set; }
        [Required]
        public bool Completed { get; set; }
    }
}
