using System.Security.Cryptography;
using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Repositories;
using GoofPass.Server.Core.Services;
using GoofPass.Server.Infrastructure.Security;
using Microsoft.IdentityModel.Tokens;

namespace GoofPass.Server.Domain.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRep;
    private readonly IAuthService _authService;

    public UserService(IUserRepository userRep, IAuthService authService)
    {
        _userRep = userRep;
        _authService = authService;
    }

    public User Add(User entity)
    {
        if (entity.Salt.IsNullOrEmpty() || entity.Password.IsNullOrEmpty())
            throw new InvalidOperationException(nameof(entity));
        
        return _userRep.Add(entity);
    }

    public IEnumerable<User> GetAll()
    {
        return _userRep.GetAll();
    }

    public User Get(string id)
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
        var userDb = _userRep.GetByEmail(user.Email);
        
        if (userDb == null)
            throw new InvalidOperationException("Invalid login");
        
        if (!userDb.Password.Equals(user.Password))
            throw new InvalidOperationException("Invalid login");
        
        var token = new JWToken
        {
            Token = _authService.GenerateToken(user),
            Email = user.Email,
            Id = userDb.Id.ToString()
        };
        
        return token;
    }

    public User Register(User user)
    {
        if (user.Salt.IsNullOrEmpty() || user.Password.IsNullOrEmpty() || user.Email.IsNullOrEmpty())
            throw new InvalidOperationException("Invalid registration");

        if (_userRep.GetByEmail(user.Email) != null)
            throw new InvalidOperationException("Email already exists");

        user.Id = Guid.NewGuid();
        
        return _userRep.Add(user);
    }

    public string GetSalt(string user)
    {
        var userDb = _userRep.GetByEmail(user);
        
        if (userDb == null)
            throw new InvalidOperationException("Invalid user");
        
        return userDb.Salt;
    }
}