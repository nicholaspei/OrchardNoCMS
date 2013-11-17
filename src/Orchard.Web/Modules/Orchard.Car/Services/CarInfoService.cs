using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.Data;
using Orchard.Car.Models;

namespace Orchard.Car.Services
{
    public class CarInfoService:ICarInfoService
    {
        public IRepository<CarInfo> _carInfoRepository;

        public CarInfoService(IRepository<CarInfo> carInfoRepository)
        {
            _carInfoRepository = carInfoRepository;
        }

        public virtual bool CreateCar(Models.CarInfo item)
        {
            try
            {
                _carInfoRepository.Create(item);
            }
            catch
            {
                return false;
            }
            return true;
        }



        public virtual object GetList()
        {

            var list = _carInfoRepository.Fetch(s => true);
            return list;
        }
    }
}