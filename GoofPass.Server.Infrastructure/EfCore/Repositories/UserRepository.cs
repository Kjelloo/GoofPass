using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Repositories;
using GoofPass.Server.Core.Services;
using GoofPass.Server.Infrastructure.EfCore.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GoofPass.Server.Infrastructure.EfCore.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserContext _ctx;

    public UserRepository(UserContext ctx)
    {
        _ctx = ctx;
    }

    public User Add(User entity)
    {
        if (_ctx.Users.FirstOrDefault(user => user.Email.Equals(entity.Email)) != null)
            throw new InvalidOperationException(nameof(entity.Email));
        
        entity.Id = Guid.NewGuid();
        
        var newUser = _ctx.Users.Add(entity).Entity;
        _ctx.SaveChanges();
        return newUser;
    }

    public IEnumerable<User> GetAll()
    {
        return _ctx.Users;
    }

    public User Get(Guid id)
    {
        return _ctx.Users.FirstOrDefault(user => user.Id.Equals(id)) ?? throw new InvalidOperationException();
    }

    public User Edit(User entity)
    {
        _ctx.Entry(entity).State = EntityState.Modified;
        _ctx.SaveChanges();
        return entity;
    }

    public User Remove(User entity)
    {
        var userRemove = _ctx.Users.FirstOrDefault(user => user.Id.Equals(entity.Id));
        _ctx.Users.Remove(userRemove);
        _ctx.SaveChanges();
        return userRemove;
    }
    
    public User GetByEmail(string email)
    {
        return _ctx.Users.FirstOrDefault(user => user.Email.Equals(email));
    }
    
}