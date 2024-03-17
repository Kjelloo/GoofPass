namespace GoofPass.Server.Domain.Helpers;

public interface IDbInitializer<T>
{
    void Initialize(T context);
}