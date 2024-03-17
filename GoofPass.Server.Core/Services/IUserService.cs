using GoofPass.Server.Core.Models;

namespace GoofPass.Server.Core.Services;

public interface IUserService : IService<User>
{
    public JWToken Login(User user);
    public User Register(User user);
}