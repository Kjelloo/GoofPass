using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Services;
using Microsoft.IdentityModel.Tokens;

namespace GoofPass.Server.Infrastructure.Security;

public class JWTService : IAuthService
{
    private readonly byte[] _secret;

    public JWTService(byte[] secret)
    {
        _secret = secret;
    }
    
    public string GenerateToken(User user)
    {
        var claims = new List<Claim>()
        {
            new(ClaimTypes.Email, user.Username),
            new(type: "Salt", value: BitConverter.ToString(user.Salt)),
            new(type: "IV", value: BitConverter.ToString(user.IV))
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

    public bool VerifyHash(byte[] remoteHash, byte[] localHash)
    {
        return StructuralComparisons.StructuralEqualityComparer.Equals(remoteHash, localHash);
    }
}