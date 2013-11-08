using Orchard.Data.Conventions;
using System;

namespace Orchard.Core.Settings.Models {
    public class SiteSettings2PartRecord  {
        [StringLengthMax]
        public virtual Guid Id { get; set; }
        public virtual string BaseUrl { get; set; }
    }
}