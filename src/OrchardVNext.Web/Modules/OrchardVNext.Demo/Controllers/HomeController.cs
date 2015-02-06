using Microsoft.AspNet.Mvc;
using Microsoft.Framework.Logging;
using OrchardVNext.Test1;

namespace OrchardVNext.Demo.Controllers {
    public class HomeController : Controller {
        private readonly ITestDependency _testDependency;
	    private readonly ILogger _logger;
        public HomeController(ITestDependency testDependency,ILoggerFactory loggerFactory) {
            _testDependency = testDependency;
	        _logger = loggerFactory.Create("demo");
        }

        public ActionResult Index() {
			_logger.WriteError("Error info from demo module!");
            return View("Index", _testDependency.SayHi());
        }
    }
}