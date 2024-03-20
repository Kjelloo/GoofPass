namespace GoofPass.Server.Core.Models;

public class PasswordEntry
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Password { get; set; }
    public string Salt { get; set; }
    public string Iv { get; set; }
    public string UserId { get; set; }
}