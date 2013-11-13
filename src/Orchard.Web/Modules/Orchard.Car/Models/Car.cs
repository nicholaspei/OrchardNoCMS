using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Orchard.Car.Models
{
    public class CarInfo  
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public float Price { get; set; }

        public int BrandId { get; set; }

        public int SeatNum { get; set; }
    }
}