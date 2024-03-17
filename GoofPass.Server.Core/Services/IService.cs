namespace GoofPass.Server.Core.Services;

public interface IService<T>
{
    T Add(T entity);
    IEnumerable<T> GetAll();
    T Get(Guid id);
    T Edit(T entity);
    T Remove(T entity);
}