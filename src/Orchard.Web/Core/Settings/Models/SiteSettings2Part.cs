using Orchard.Data.Conventions;

namespace Orchard.Core.Settings.Models {
    public sealed class SiteSettings2Part  {
        [StringLengthMax]
        public string BaseUrl
        {
            get;
            set;
        }
    }
}