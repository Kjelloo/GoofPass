using GoofPass.Server.Core.Models;
using GoofPass.Server.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GoofPass.Server.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordController : ControllerBase
    {
        private readonly IPasswordEntryService _service;

        public PasswordController(IPasswordEntryService service)
        {
            _service = service;
        }
        
        [Authorize]
        [HttpPost]
        public IActionResult Post([FromBody] PasswordEntry password)
        {
            try
            {
                var newPass = _service.Add(password);
                
                return Ok(newPass);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [Authorize]
        [HttpGet("User/{userId}")]
        public IActionResult Get(string userId)
        {
            try
            {
                var passwords = _service.GetAllByUserId(userId);
                return Ok(passwords);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var passwords = _service.GetAll();
                return Ok(passwords);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
