using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Repositories;

namespace GoofPass.Server.Core.Services;

public interface IPasswordEntryRepository : IRepository<PasswordEntry>
{
    PasswordEntry GetByUserId(string userId);
}