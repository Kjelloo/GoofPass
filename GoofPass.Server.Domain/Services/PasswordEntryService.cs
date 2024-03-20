using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Services;
using Microsoft.IdentityModel.Tokens;

namespace GoofPass.Server.Domain.Services;

public class PasswordEntryService : IPasswordEntryService
{
    private readonly IPasswordEntryRepository _repo;

    public PasswordEntryService(IPasswordEntryRepository repo)
    {
        _repo = repo;
    }

    public PasswordEntry Add(PasswordEntry entity)
    {
        if (entity.UserId.IsNullOrEmpty() || entity.Password.IsNullOrEmpty() || 
            entity.Name.IsNullOrEmpty() || entity.Salt.IsNullOrEmpty() || 
            entity.Iv.IsNullOrEmpty())
            throw new InvalidOperationException(nameof(entity));
        
        return _repo.Add(entity);
    }

    public IEnumerable<PasswordEntry> GetAll()
    {
        return _repo.GetAll();
    }

    public PasswordEntry Get(string id)
    {
        if (id.IsNullOrEmpty())
            throw new InvalidOperationException(nameof(id));
        
        return _repo.Get(id);
    }

    public PasswordEntry Edit(PasswordEntry entity)
    {
        if (entity.UserId.IsNullOrEmpty() || entity.Password.IsNullOrEmpty() || 
            entity.Name.IsNullOrEmpty() || entity.Salt.IsNullOrEmpty() || 
            entity.Iv.IsNullOrEmpty())
            throw new InvalidOperationException(nameof(entity));
        
        return _repo.Edit(entity);
    }

    public PasswordEntry Remove(PasswordEntry entity)
    {
        if (entity.UserId.IsNullOrEmpty())
            throw new InvalidOperationException(nameof(entity));
        
        return _repo.Remove(entity);
    }

    public IEnumerable<PasswordEntry> GetAllByUserId(string userId)
    {
        if (userId.IsNullOrEmpty())
            throw new InvalidOperationException(nameof(userId));
        
        return _repo.GetAll().Where(entry => entry.UserId.Equals(userId));
    }
}