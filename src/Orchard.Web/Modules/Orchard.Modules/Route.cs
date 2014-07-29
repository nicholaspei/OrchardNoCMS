using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Routing;
using Orchard.Mvc.Routes;

namespace Orchard.Modules
{
    public class Route:IRouteProvider
    {
       
        public void GetRoutes(ICollection<RouteDescriptor> routes)
        {
            foreach (var routeDescriptor in GetRoutes())
            {
                routes.Add(routeDescriptor);
            } 
         }

        public IEnumerable<RouteDescriptor> GetRoutes()
        {
            return new[]
            {
                new RouteDescriptor
                {
                    Route = new System.Web.Routing.Route(
                        "module/features",
                        new RouteValueDictionary
                        {
                            {"area", "Modules"},
                            {"controller", "admin"},
                            {"action", "Features"}
                        },
                        new RouteValueDictionary(),
                        new RouteValueDictionary
                        {
                            {"area", "Modules"}
                        },
                        new MvcRouteHandler())
                }
            };
        }

    }
}