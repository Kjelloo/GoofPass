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
            new(ClaimTypes.Sid, user.Id.ToString())
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
    
    public bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(_secret);
        
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key
        }, out SecurityToken validatedToken);
        
        return validatedToken != null;
    }
}