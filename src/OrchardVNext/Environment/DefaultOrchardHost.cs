using OrchardVNext.Environment.Extensions;
using System;
using Microsoft.Framework.Logging;

namespace OrchardVNext.Environment {
    public interface IOrchardHost {
        void Initialize();
    }

    public class DefaultOrchardHost : IOrchardHost {
        //private readonly IExtensionLoaderCoordinator _extensionLoaderCoordinator;
        //public DefaultOrchardHost(IExtensionLoaderCoordinator extensionLoaderCoordinator) {
        //    _extensionLoaderCoordinator = extensionLoaderCoordinator;
        //}
	    private readonly ILogger _logger;

	    public DefaultOrchardHost(ILoggerFactory loggerFactory)
	    {
		    _logger = loggerFactory.Create("VFramework");
	    }

        void IOrchardHost.Initialize() {
			_logger.WriteInformation("Initialize Host");

			//_extensionLoaderCoordinator.SetupExtensions();

			_logger.WriteInformation("Host Initialized");
        }
    }
}