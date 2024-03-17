namespace GoofPass.Server.Core.Models;

public class JWToken
{
    public string Token { get; set; }
    public User User { get; set; }
}