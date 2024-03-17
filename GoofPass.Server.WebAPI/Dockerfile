FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GoofPass.Server.WebAPI/GoofPass.Server.WebAPI.csproj", "GoofPass.Server.WebAPI/"]
COPY ["GoofPass.Server.Core/GoofPass.Server.Core.csproj", "GoofPass.Server.Core/"]
COPY ["GoofPass.Server.Infrastructure/GoofPass.Server.Infrastructure.csproj", "GoofPass.Server.Infrastructure/"]
COPY ["GoofPass.Server.Domain/GoofPass.Server.Domain.csproj", "GoofPass.Server.Domain/"]

RUN dotnet restore "GoofPass.Server.WebAPI/GoofPass.Server.WebAPI.csproj"
COPY . .
WORKDIR "/src/GoofPass.Server.WebAPI"
RUN dotnet build "GoofPass.Server.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GoofPass.Server.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GoofPass.Server.WebAPI.dll"]