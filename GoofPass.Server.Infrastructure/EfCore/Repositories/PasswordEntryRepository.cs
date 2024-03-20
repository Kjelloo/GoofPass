using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Services;
using GoofPass.Server.Infrastructure.EfCore.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GoofPass.Server.Infrastructure.EfCore.Repositories;

public class PasswordEntryRepository : IPasswordEntryRepository
{
    private readonly PasswordContext _ctx;

    public PasswordEntryRepository(PasswordContext ctx)
    {
        _ctx = ctx;
    }

    public PasswordEntry GetByUserId(string userId)
    {
        return _ctx.Passwords.FirstOrDefault(entry => entry.UserId.Equals(userId));
    }

    public PasswordEntry Add(PasswordEntry entity)
    {
        entity.Id = Guid.NewGuid().ToString();
        var newEntry = _ctx.Passwords.Add(entity).Entity;
        _ctx.SaveChanges();
        return newEntry;
    }

    public IEnumerable<PasswordEntry> GetAll()
    {
        return _ctx.Passwords;
    }

    public PasswordEntry Get(string id)
    {
        return _ctx.Passwords.FirstOrDefault(entry => entry.Id.Equals(id));
    }

    public PasswordEntry Edit(PasswordEntry entity)
    {
        _ctx.Entry(entity).State = EntityState.Modified;
        _ctx.SaveChanges();
        return entity;
    }

    public PasswordEntry Remove(PasswordEntry entity)
    {
        var entryRemove = _ctx.Passwords.FirstOrDefault(entry => entry.Id.Equals(entity.Id));
        _ctx.Passwords.Remove(entryRemove);
        _ctx.SaveChanges();
        return entryRemove;
    }
}