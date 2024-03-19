using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Repositories;

namespace GoofPass.Server.Core.Services;

public interface IUserRepository : IRepository<User>
{
    User GetByEmail(string email);
}