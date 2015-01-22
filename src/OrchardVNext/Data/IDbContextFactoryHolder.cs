using Microsoft.Data.Entity;

namespace OrchardVNext.Data
{
    public interface IDbContextFactoryHolder :ISingletonDependency
    {
        DbContextOptions BuildConfiguration();
    }


}