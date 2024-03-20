namespace GoofPass.Server.Core.Services;

public interface IService<T>
{
    T Add(T entity);
    IEnumerable<T> GetAll();
    T Get(string id);
    T Edit(T entity);
    T Remove(T entity);
}