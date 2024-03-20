using System.Security.Cryptography;
using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Services;
using GoofPass.Server.WebAPI.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace GoofPass.Server.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;

    public UserController(IUserService userService, IAuthService authService)
    {
        _userService = userService;
        _authService = authService;
    }

    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        try
        {
            return Ok(_userService.Get(id));
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
    
    [HttpGet]
    public IActionResult GetAll()
    {
        try
        {
            return Ok(_userService.GetAll());
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
    
    [HttpPost("Test")]
    public IActionResult Test([FromBody] UserDto userDto)
    {
        try
        {
            // convert dto to model
            var user = new User
            {
                Email = userDto.Email
            };

            user.Password = BitConverter.ToString(RandomNumberGenerator.GetBytes(64)).Replace("-", "");
            user.Salt = BitConverter.ToString(RandomNumberGenerator.GetBytes(12)).Replace("-", "");
            
            var newUser = _userService.Add(user);
            
            return Ok(newUser);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpPost("Register")]
    public IActionResult Register([FromBody] AuthUserDto userDto)
    {
        try
        {
            var user = new User
            {
                Email = userDto.Email,
                Password = userDto.Password,
                Salt = userDto.Salt
            };
            
            _userService.Register(user);
            
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("Login")]
    public ActionResult<UserDto> Login([FromBody] LoginUserDto authUserDto)
    {
        try
        {

            var user = new User
            {
                Email = authUserDto.Email,
                Password = authUserDto.Password
            };
            
            var newUser = _userService.Login(user);
            
            var userDto = new JWTokenDto
            {
                Id = newUser.Id,
                Email = newUser.Email,
                Token = newUser.Token
            };
            
            
            return Ok(userDto);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("Salt")]
    public ActionResult<string> Prepare([FromBody] UserBareDto user)
    {
        try
        {
            var salt = _userService.GetSalt(user.Email);
                
            return Ok(salt);
        } catch (Exception e)
        {
            return BadRequest(e);
        }
    }
    
    [HttpPost("ValidateToken/{token}")]
    public ActionResult<bool> ValidateToken(string token)
    {
        try
        {
            var validated = _authService.ValidateToken(token);
            
            return Ok(validated);
        } catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}