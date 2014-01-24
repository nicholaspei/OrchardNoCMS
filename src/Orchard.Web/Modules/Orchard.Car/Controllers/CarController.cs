using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Orchard.Car.Models;
using Orchard.Car.Services;
using Orchard.Themes;
using Orchard.Utility;

namespace Orchard.Car.Controllers
{
    public class CarController:Controller
    {
        private readonly ICarInfoService _carInfoService;
        public CarController(ICarInfoService carInfoService)
        {
            _carInfoService = carInfoService;
        }

        [Themed]
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
            return Json(new OperateMessage<CarInfo>(OperateResult.Success,true,string.Empty,model));
        }

        public JsonResult List()
        {
            var result = _carInfoService.GetList();
            return Json(new OperateMessage<object>(result, 1), JsonRequestBehavior.AllowGet);
        }

    }
}