using Microsoft.Data.Entity;

namespace OrchardVNext.Data.Providers
{
    public class SqlServerDataServicesProvider :IDataServicesProvider
    {
        public static string ProviderName 
        {
            get { return "SqlServer"; }
        }

        public DbContextOptions BuildContextOptions()
        {

            DbContextOptions foo = new DbContextOptions();
            foo.UseSqlServer(@"");
            return foo;
        }
    }
}