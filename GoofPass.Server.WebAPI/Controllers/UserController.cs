using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;
using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Services;
using GoofPass.Server.Domain.Services;
using GoofPass.Server.WebAPI.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GoofPass.Server.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public IActionResult Get(Guid id)
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
    
    [HttpPost("Test")]
    public IActionResult Test([FromBody] UserDto userDto)
    {
        try
        {
            // convert dto to model
            var user = new User
            {
                Username = userDto.Username
            };

            user.Password = RandomNumberGenerator.GetBytes(8);
            user.Salt = RandomNumberGenerator.GetBytes(8);
            user.IV = RandomNumberGenerator.GetBytes(8);
            
            var newUser = _userService.Add(user);
            
            return Ok(newUser);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpPost("Register")]
    public IActionResult Register([FromBody] User user)
    {
        try
        {
            var newUser = _userService.Add(user);
            
            return Ok(newUser);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
    
    [HttpPost("Login")]
    public ActionResult<JWToken> Login([FromBody] User user)
    {
        try
        {
            var newUser = _userService.Login(user);
            
            return Ok(newUser);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
}