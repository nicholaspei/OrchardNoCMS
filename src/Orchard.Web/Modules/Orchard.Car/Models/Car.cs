using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Orchard.Car.Models
{
    public class CarInfo  
    {
        public virtual int Id { get; set; }

        public virtual string Name { get; set; }

        public virtual string Description { get; set; }

        public virtual float Price { get; set; }

        public virtual int BrandId { get; set; }

        public virtual int SeatNum { get; set; }
    }
}