using System;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using Orchard.Core.Settings.ViewModels;
using Orchard.Localization;
using Orchard.Localization.Services;
using Orchard.Security;
using Orchard.Settings;
using Orchard.UI.Notify;

namespace Orchard.Core.Settings.Controllers {
    [ValidateInput(false)]
    public class AdminController : Controller {
        private readonly ISiteService _siteService;
        private readonly ICultureManager _cultureManager;
        public IOrchardServices Services { get; private set; }

        public AdminController(
            ISiteService siteService,
            IOrchardServices services,
            ICultureManager cultureManager) {
            _siteService = siteService;
            _cultureManager = cultureManager;
            Services = services;
            T = NullLocalizer.Instance;
        }

        public Localizer T { get; set; }

        public ActionResult Index(string groupInfoId) {
            if (!Services.Authorizer.Authorize(StandardPermissions.SiteOwner, T("Not authorized to manage settings")))
                return new HttpUnauthorizedResult();

           
            var site = _siteService.GetSiteSettings();
           
            return View();
        }

        [HttpPost, ActionName("Index")]
        public ActionResult IndexPOST(string groupInfoId) {
            if (!Services.Authorizer.Authorize(StandardPermissions.SiteOwner, T("Not authorized to manage settings")))
                return new HttpUnauthorizedResult();

            var site = _siteService.GetSiteSettings();
            

                // Casting to avoid invalid (under medium trust) reflection over the protected View method and force a static invocation.
                 return View();
                     
          
        }

        public ActionResult Culture() {
            //todo: class and/or method attributes for our auth?
            if (!Services.Authorizer.Authorize(StandardPermissions.SiteOwner, T("Not authorized to manage settings")))
                return new HttpUnauthorizedResult();

            var model = new SiteCulturesViewModel {
                CurrentCulture = _cultureManager.GetCurrentCulture(HttpContext),
                SiteCultures = _cultureManager.ListCultures(),
            };
            model.AvailableSystemCultures = CultureInfo.GetCultures(CultureTypes.SpecificCultures)
                .Select(ci => ci.Name)
                .Where(s => !model.SiteCultures.Contains(s));

            return View(model);
        }

        [HttpPost]
        public ActionResult AddCulture(string systemCultureName, string cultureName) {
            if (!Services.Authorizer.Authorize(StandardPermissions.SiteOwner, T("Not authorized to manage settings")))
                return new HttpUnauthorizedResult();

            cultureName = string.IsNullOrWhiteSpace(cultureName) ? systemCultureName : cultureName;

            if (!string.IsNullOrWhiteSpace(cultureName)) {
                _cultureManager.AddCulture(cultureName);
            }
            return RedirectToAction("Culture");
        }

        [HttpPost]
        public ActionResult DeleteCulture(string cultureName) {
            if (!Services.Authorizer.Authorize(StandardPermissions.SiteOwner, T("Not authorized to manage settings")))
                return new HttpUnauthorizedResult();

            _cultureManager.DeleteCulture(cultureName);
            return RedirectToAction("Culture");
        }

        public ActionResult Hello()
        {
            return View();
        }
      
    }
}
