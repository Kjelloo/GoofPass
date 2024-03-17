using GoofPass.Server.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace GoofPass.Server.Infrastructure.EfCore.Contexts;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
}