using GoofPass.Server.Core.Models;
using GoofPass.Server.Infrastructure.EfCore.Contexts;

namespace GoofPass.Server.Domain.Helpers;

public class PasswordEntryDbInitializer : IDbInitializer<PasswordContext>
{
    public void Initialize(PasswordContext context)
    {
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
    }
}