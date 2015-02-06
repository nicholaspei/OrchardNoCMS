using Microsoft.Framework.Logging;
using OrchardVNext.Environment.Configuration;

namespace OrchardVNext.Environment {
    public interface IOrchardShellHost {
        void BeginRequest(ShellSettings shellSettings);
        void EndRequest(ShellSettings shellSettings);
    }

    public class DefaultOrchardShellHost : IOrchardShellHost
    {
	    private readonly ILogger _logger;

	    public DefaultOrchardShellHost(ILoggerFactory loggerFactory)
	    {
		    _logger = loggerFactory.Create("VFramework");
	    }
        void IOrchardShellHost.BeginRequest(ShellSettings settings) {
			_logger.WriteInformation("Begin Request for tenant {0}", settings.Name);
        }

        void IOrchardShellHost.EndRequest(ShellSettings settings) {
			_logger.WriteInformation("End Request for tenant {0}", settings.Name);
        }
    }
}