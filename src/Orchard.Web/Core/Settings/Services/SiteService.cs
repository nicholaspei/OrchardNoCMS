using System;
using System.Linq;
using JetBrains.Annotations;
using Orchard.Caching;
using Orchard.Core.Settings.Models;
using Orchard.Data;
using Orchard.Logging;
using Orchard.Settings;

namespace Orchard.Core.Settings.Services {
    [UsedImplicitly]
    public class SiteService : ISiteService {       
        private readonly ICacheManager _cacheManager;

        public SiteService(
            IRepository<SiteSettingsPartRecord> siteSettingsRepository,            
            ICacheManager cacheManager) {          
            _cacheManager = cacheManager;
            Logger = NullLogger.Instance;
        }

        public ILogger Logger { get; set; }

        public ISite GetSiteSettings() {
            var item = new SiteSettingsPart();
            item.Id = new Guid("01A61747-FEE0-4EAA-96BE-4A4C4B68D60C");
            item.SiteSalt = "ca66c4cf061441efaf838cb99fe3126d";
            item.SiteName = "Test Site";
            item.SuperUser = "admin";
            item.PageTitleSeparator = " - ";
            item.HomePage = "OrchardLocal";
            item.SiteCulture = "en-US";
            item.ResourceDebugMode = ResourceDebugMode.FromAppSetting;
            item.PageSize = 10;
            item.SiteTimeZone = "China Standard Time";
            return item;
        }
    }
}