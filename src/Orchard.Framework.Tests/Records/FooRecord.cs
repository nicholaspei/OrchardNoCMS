using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Orchard.Framework.Tests.Records
{
    public class FooRecord
    {
        public virtual int Id { get; set; }

        public virtual string Name { get; set; }

        public virtual DateTime? Timespan { get; set; }
}
}
