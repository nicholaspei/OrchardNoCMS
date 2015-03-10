using System;
using Microsoft.Framework.Logging;
using OrchardVNext.Demo.Models;
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
	    private readonly Microsoft.Framework.Logging.ILogger _logger;	    
        public Class(ShellSettings shellSettings,ILogger logger)
        {
            _shellSettings = shellSettings;	     
	        _logger = logger;
        }

        public string SayHi()
        {
	        try
	        {
				var testRecord = new TestRecord();
				testRecord.Id = 1;
				testRecord.TestLine = "xxx";				
				_logger.WriteError("The error info from demo!");
				return string.Format("Hi from tenant {0}", _shellSettings.Name);
			}
	        catch (Exception ex)
	        {
		        return ex.Message;
	        }
	     
        }
    }
}