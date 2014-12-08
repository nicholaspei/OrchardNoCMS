using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace Autohome.Car.Controllers {
    public class CarController : Controller
    {
        public ActionResult Index()
        {
            return View("Index");
        }
    }


}