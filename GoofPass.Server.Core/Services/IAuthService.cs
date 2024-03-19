using GoofPass.Server.Core.Models;

namespace GoofPass.Server.Core.Services;

public interface IAuthService
{
    string GenerateToken(User user);
}