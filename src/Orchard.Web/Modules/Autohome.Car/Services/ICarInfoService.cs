using System.Collections.Generic;
using Autohome.Car.Models;
using Orchard;

namespace Autohome.Car.Services
{
    public interface ICarInfoService:IDependency
    {
        bool Create(CarInfo model);
        bool Edit(CarInfo model);
        bool Delete(int[] array);
        CarInfo Get(int id);
        object List(out int count);
    }
}
