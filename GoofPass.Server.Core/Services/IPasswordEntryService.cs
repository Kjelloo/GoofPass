using GoofPass.Server.Core.Models;

namespace GoofPass.Server.Core.Services;

public interface IPasswordEntryService : IService<PasswordEntry>
{
    IEnumerable<PasswordEntry> GetAllByUserId(string userId);
}