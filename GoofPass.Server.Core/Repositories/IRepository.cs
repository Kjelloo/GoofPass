namespace GoofPass.Server.Core.Repositories;

public interface IRepository<T>
{
    T Add(T entity);
    IEnumerable<T> GetAll();
    T Get(Guid id);
    T Edit(T entity);
    T Remove(T entity);
}