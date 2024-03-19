using GoofPass.Server.Core.Models;

namespace GoofPass.Server.Core.Services;

public interface IUserService : IService<User>
{
    JWToken Login(User user);
    User Register(User user);
    string GetSalt(string user);
}