namespace GoofPass.Server.Core.Models;

public class PasswordEntry
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public byte[] Password { get; set; }
    public byte[] Salt { get; set; }
    public Guid UserId { get; set; }
}