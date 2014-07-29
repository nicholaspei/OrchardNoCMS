using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Autohome.Car.Models
{
    public class CarInfo
    {
        public virtual int Id { get; set; }

        public virtual string Name { get; set; }

        public virtual int Price { get; set; }

        public virtual string Description { get; set; }

    }
}