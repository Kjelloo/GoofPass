namespace GoofPass.Server.WebAPI.Dtos;

public class AuthUserDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Salt { get; set; }
}