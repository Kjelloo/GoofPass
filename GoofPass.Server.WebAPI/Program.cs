using System.Security.Cryptography;
using GoofPass.Server.Core.Services;
using GoofPass.Server.Domain.Helpers;
using GoofPass.Server.Domain.Services;
using GoofPass.Server.Infrastructure.EfCore.Contexts;
using GoofPass.Server.Infrastructure.EfCore.Repositories;
using GoofPass.Server.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var secret = RandomNumberGenerator.GetBytes(16); // Todo: store in a secure location

// Add services to the container.
builder.Services.AddDbContext<UserContext>(opt => opt.UseSqlite("Data Source=UserDB.db"));
builder.Services.AddDbContext<PasswordContext>(opt => opt.UseSqlite("Data Source=PasswordDB.db"));
builder.Services.AddTransient<IDbInitializer<UserContext>, UserDbInitializer>();
builder.Services.AddTransient<IDbInitializer<PasswordContext>, PasswordEntryDbInitializer>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<IAuthService>(sp => new AuthService(secret));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("dev-cors", builder =>
    {
        builder
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:4200");
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false, // Todo: validate issuer
            ValidateAudience = false, // Todo: validate audience
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(5),
            IssuerSigningKey = new SymmetricSecurityKey(secret)
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("dev-cors");
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userContext = services.GetService<UserContext>();
    var passwordContext = services.GetService<PasswordContext>();
    
    var userDbInitializer = services.GetService<IDbInitializer<UserContext>>();
    var passwordDbInitializer = services.GetService<IDbInitializer<PasswordContext>>();
    userDbInitializer.Initialize(userContext);
    passwordDbInitializer.Initialize(passwordContext);
}

app.UseAuthorization();

app.MapControllers();

app.Run();