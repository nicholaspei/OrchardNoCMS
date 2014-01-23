using Orchard.UI.Resources;

namespace AmberMe.Script
{
    public class ResourceManifest:IResourceManifestProvider
    {
        public void BuildManifests(ResourceManifestBuilder builder)
        {
            var manifest = builder.Add();
            manifest.DefineScript("jQuery").SetUrl("jquery-1.8.2.min.js", "jquery-1.8.2.js").SetVersion("1.8.2")
                .SetCdn("//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.2.min.js", "//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.2.min.js", true);
            manifest.DefineScript("jqueryform").SetUrl("jquery_form.js").SetDependencies("jQuery");
            manifest.DefineScript("bootstrap").SetUrl("bootstrap.min.js", "bootstrap.js").SetDependencies("jQuery");
            manifest.DefineScript("bootstrapdatepicker").SetUrl("bootstrap-datepicker.js").SetDependencies("jQuery","bootstrap");
            manifest.DefineScript("bootstrapvalidate").SetUrl("bootstrap.validate.js").SetDependencies("bootstrap");
            manifest.DefineScript("knockoutjs").SetUrl("knockout-2.2.0.js", "knockout-2.2.0.debug.js").SetVersion("2.2.0").SetDependencies("jQuery");
            manifest.DefineScript("knockoutjsmap").SetUrl("knockout.mapping-latest.js", "knockout.mapping-latest.debug.js").SetDependencies("jQuery");
            manifest.DefineScript("json2").SetUrl("json2.js").SetDependencies("jQuery");
            manifest.DefineScript("orders").SetUrl("orders.js").SetDependencies("bootstrap");
            manifest.DefineScript("pages").SetUrl("pages.js").SetDependencies("bootstrap", "knockoutjs");
            manifest.DefineScript("dateformat").SetUrl("dateformat.js");
            manifest.DefineScript("amberme").SetUrl("amberme.js").SetDependencies("bootstrap", "knockoutjs", "jQuery");

            manifest.DefineStyle("bootstrap_style").SetUrl("bootstrap.min.css");
            manifest.DefineStyle("bootstrap_responsive").SetUrl("bootstrap-responsive.min.css");
            manifest.DefineStyle("bootstrap_datepicker").SetUrl("datepicker.css");
            manifest.DefineStyle("bootstrap_validate").SetUrl("bootstrap.validate.css");
        }
    }
}