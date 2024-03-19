using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace GoofPass.Server.Infrastructure.Security;

public class AuthService : IAuthService
{
    private readonly byte[] _secret;

    public AuthService(byte[] secret)
    {
        _secret = secret;
    }
    
    public string GenerateToken(User user)
    {
        var claims = new List<Claim>()
        {
            new(ClaimTypes.Email, user.Email),
            new(type: "Salt", value: user.Salt)
        };
        
        var token = new JwtSecurityToken(
                new JwtHeader(new SigningCredentials(
                    new SymmetricSecurityKey(_secret),
                    SecurityAlgorithms.HmacSha256)),
                new JwtPayload(null, // Todo: validate issuer
                    null, // Todo: validate audience
                    claims.ToArray(),
                    DateTime.Now, // notBefore
                    DateTime.Now.AddDays(1))); // expires

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}