using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Autohome.Car.Handlers;
using Autohome.Car.Models;
using Orchard.Data;

namespace Autohome.Car.Services
{
    public class CarInfoService:ICarInfoService
    {
        private readonly IRepository<CarInfo> _carRepository;
        private readonly IEnumerable<ICarEventHandler> _handlers; 
        public CarInfoService(IRepository<CarInfo> carRepository, IEnumerable<ICarEventHandler> handlers)
        {
            _carRepository = carRepository;
            _handlers = handlers;
        }

        public virtual bool Create(Models.CarInfo model)
        {
          
            foreach (var carEventHandler in _handlers)
            {
               carEventHandler.OnCarCreating(model);               
            }          
            // set property value which is null

            try
            {                
                _carRepository.Create(model);
            }
            catch
            {
                return false;
            }
            return true;
        }

        public virtual bool Edit(CarInfo model)
        {
            try
            {
                _carRepository.Update(model);
            }
            catch
            {
                return false;
            }
            return true;
        }

        public virtual bool Delete(int[] array)
        {
            try
            {
                foreach (var id in array)
                {
                    var item = this.Get(id);
                    _carRepository.Delete(item);
                }
            }
            catch
            {
                return false;
            }           
            return true;
        }

        public virtual CarInfo Get(int id)
        {
            var item = _carRepository.Get(id);
            return item;
        }


        public virtual object List(out int count)
        {
            var list = _carRepository.Table.ToList();
            count = list.Count;
            return list;
        }
    }
}