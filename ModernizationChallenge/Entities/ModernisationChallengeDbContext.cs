using Microsoft.EntityFrameworkCore;

namespace ModernizationChallenge.Entities
{
    public class ModernizationChallengeDbContext : DbContext
    {
        public ModernizationChallengeDbContext(DbContextOptions<ModernizationChallengeDbContext> options) : base(options)
        {
        }

        public DbSet<Task> Tasks { get; set; }

    }
}
