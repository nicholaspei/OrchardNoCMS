using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Orchard.Core.Settings.Controllers
{
    public class StartController : Controller
    {
        public ActionResult StartPage()
        {
            return View();
        }
    }
}