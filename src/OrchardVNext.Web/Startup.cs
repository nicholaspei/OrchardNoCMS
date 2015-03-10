using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.Logging;
using OrchardVNext.Environment;

namespace OrchardVNext.Web {
    public class Startup {
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerfactory) {
            var host = OrchardStarter.CreateHost(app);
            host.Initialize();
        }
    }
}