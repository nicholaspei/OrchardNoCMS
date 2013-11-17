using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Orchard.Car.Models;
using Orchard.Car.Services;

namespace Orchard.Car.Controllers
{
    public class CarController:Controller
    {
        private readonly ICarInfoService _carInfoService;
        public CarController(ICarInfoService carInfoService)
        {
            _carInfoService = carInfoService;
        }

        public ActionResult Index()
        { 
         return View();
        }

        public ActionResult Add()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Add(CarInfo model)
        {        
            
            var result=_carInfoService.CreateCar(model);
            if (result)
            {
                return View("Index");
            }
            return View("Whatever");
        }

        public JsonResult List()
        {
            var result = _carInfoService.GetList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}