using GoofPass.Server.Infrastructure.EfCore.Contexts;

namespace GoofPass.Server.Domain.Helpers;

public class UserDbInitializer : IDbInitializer<UserContext>
{
    public void Initialize(UserContext context)
    {
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
    }
}