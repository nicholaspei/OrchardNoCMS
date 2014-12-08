using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Autohome.Car.Models;
using Autohome.Car.Services;
using Orchard.Localization;
using Orchard;
using Orchard.Themes;
using Orchard.Utility;

namespace Autohome.Car.Controllers {
    public class CarController : Controller
    {
        private readonly ICarInfoService _carInfoService;
        public IOrchardServices Services { get; set; }

        public CarController(IOrchardServices services,ICarInfoService carInfoService) {
            Services = services;
            T = NullLocalizer.Instance;
            _carInfoService = carInfoService;
        }

        [Themed]
        public ActionResult Index()
        {
            return View("Index");
        }
         
        public ActionResult Create()
        {
            return View("_Create");
        }

        [HttpPost]
        public JsonResult Create(CarInfo model)
        {
            var result = _carInfoService.Create(model);
            return Json(new OperateMessage<CarInfo>(OperateResult.Success, true, string.Empty, model));
        }

        public ActionResult Edit(int carId)  
        {
            var model = _carInfoService.Get(carId);
            return View("_Edit",model);
        }

        [HttpPost]
        public JsonResult Edit(CarInfo model)
        {
            var result = _carInfoService.Edit(model);
            return Json(new OperateMessage<CarInfo>(OperateResult.Success, result, string.Empty, model));
        }

        public JsonResult Delete(string ids)
        {
            var idArray = ids.Split(',').Select(int.Parse).ToArray();
            var result = _carInfoService.Delete(idArray);
            return Json(new OperateMessage<CarInfo>(OperateResult.Success, result, "É¾³ý¼ÇÂ¼³É¹¦"), null);
        }

        public JsonResult List()
        {
            int count;
            var list = _carInfoService.List(out count);
            return Json(new OperateMessage<object>(list, count),JsonRequestBehavior.AllowGet);
        }

        public Localizer T { get; set; }
    }
}
