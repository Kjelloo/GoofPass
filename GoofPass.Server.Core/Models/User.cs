namespace GoofPass.Server.Core.Models;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public byte[] Password { get; set; }
    public byte[] Salt { get; set; }
    public byte[] IV { get; set; }
}