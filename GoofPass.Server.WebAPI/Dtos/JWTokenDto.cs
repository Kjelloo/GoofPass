namespace GoofPass.Server.WebAPI.Dtos;

public class JWTokenDto
{
    public string Token { get; set; }
    public string Id { get; set; }
    public string Email { get; set; }
    public string Salt { get; set; }
}