using Orchard.Car.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Orchard.Car.Services
{
    public interface ICarInfoService:IDependency
    {
        bool CreateCar(CarInfo item);

        object GetList();
    }
}
