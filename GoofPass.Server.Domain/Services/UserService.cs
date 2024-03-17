using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Repositories;
using GoofPass.Server.Core.Services;
using GoofPass.Server.Infrastructure.Security;
using Microsoft.IdentityModel.Tokens;

namespace GoofPass.Server.Domain.Services;

public class UserService : IUserService
{
    private readonly IRepository<User> _userRep;
    private readonly IAuthService _jwtService;
    private readonly IAuthService _authService;

    public UserService(IRepository<User> userRep, IAuthService jwtService, IAuthService authService)
    {
        _userRep = userRep;
        _jwtService = jwtService;
        _authService = authService;
    }

    public User Add(User entity)
    {
        if (entity.Salt.IsNullOrEmpty() || entity.Password.IsNullOrEmpty() || entity.IV.IsNullOrEmpty())
            throw new InvalidOperationException(nameof(entity));
        
        return _userRep.Add(entity);
    }

    public IEnumerable<User> GetAll()
    {
        return _userRep.GetAll();
    }

    public User Get(Guid id)
    {
        return _userRep.Get(id);
    }

    public User Edit(User entity)
    {
        return _userRep.Edit(entity);
    }

    public User Remove(User entity)
    {
        return _userRep.Remove(entity);
    }
    
    public JWToken Login(User user)
    {
        var userDb = _userRep.Get(user.Id);
        
        if (userDb == null)
            throw new InvalidOperationException("Invalid login");
        
        if (_authService.VerifyHash(user.Password, userDb.Password))
            throw new InvalidOperationException("Invalid login");
        
        userDb.Password = Array.Empty<byte>(); // clear password
        
        var token = new JWToken
        {
            Token = _jwtService.GenerateToken(user),
            User = userDb
        };
        
        return token;
    }

    public User Register(User user)
    {
        throw new NotImplementedException();
    }
}