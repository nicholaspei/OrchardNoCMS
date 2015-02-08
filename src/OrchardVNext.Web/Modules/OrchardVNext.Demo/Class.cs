using Microsoft.Framework.Logging;
using OrchardVNext.Environment.Configuration;

namespace OrchardVNext.Demo
{
    public interface ITestDependency : IDependency
    {
        string SayHi();
    }

    public class Class : ITestDependency
    {
        private readonly ShellSettings _shellSettings;
	    private readonly ILogger _logger;
        public Class(ShellSettings shellSettings,ILogger logger)
        {
            _shellSettings = shellSettings;
	        _logger = logger;
        }

        public string SayHi()
        {
			_logger.WriteError("The error info from demo!");
            return string.Format("Hi from tenant {0}", _shellSettings.Name);
        }
    }
}