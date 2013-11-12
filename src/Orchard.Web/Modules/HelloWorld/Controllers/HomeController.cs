using Orchard.Themes;
using System.Web.Mvc;

namespace HelloWorld.Controllers
{
     [Themed]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult TestUpdate()
        {
            return View();
        }

        public ActionResult TestUpdateA()
        {
            return View();
        }
    }
}