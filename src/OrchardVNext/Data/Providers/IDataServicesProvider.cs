using Microsoft.Data.Entity;

namespace OrchardVNext.Data.Providers
{
    public interface IDataServicesProvider : ITransientDependency
    {
        DbContextOptions BuildContextOptions();
    }


}