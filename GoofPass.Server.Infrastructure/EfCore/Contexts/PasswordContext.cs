using GoofPass.Server.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace GoofPass.Server.Infrastructure.EfCore.Contexts;

public class PasswordContext : DbContext
{
    public PasswordContext(DbContextOptions<PasswordContext> options)
        : base(options)
    {
    }
    
    public DbSet<PasswordEntry> Passwords { get; set; }
}