using Orchard.Mvc.Routes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Orchard.Car
{
    public class Routes : IRouteProvider
    {

        public void GetRoutes(ICollection<RouteDescriptor> routes)
        {
            foreach (var routeDescriptor in GetRoutes())
                routes.Add(routeDescriptor);
        }

        public IEnumerable<RouteDescriptor> GetRoutes()
        {
            return new[] {
                new RouteDescriptor {
                    Route = new Route(
                        "car/add",
                        new RouteValueDictionary {
                            {"area", "Orchard.Car"},
                            {"controller", "Car"},
                            {"action", "Add"}
                        },
                        new RouteValueDictionary (),
                        new RouteValueDictionary {
                            {"area", "Orchard.Car"}                            
                        },
                        new MvcRouteHandler())
                },
               new RouteDescriptor {
                    Route = new Route(
                        "car/index",
                        new RouteValueDictionary {
                            {"area", "Orchard.Car"},
                            {"controller", "Car"},
                            {"action", "index"}
                        },
                        new RouteValueDictionary (),
                        new RouteValueDictionary {
                            {"area", "Orchard.Car"}                            
                        },
                        new MvcRouteHandler())
                },
                 new RouteDescriptor {
                    Route = new Route(
                        "car/list",
                        new RouteValueDictionary {
                            {"area", "Orchard.Car"},
                            {"controller", "Car"},
                            {"action", "List"}
                        },
                        new RouteValueDictionary (),
                        new RouteValueDictionary {
                            {"area", "Orchard.Car"}                            
                        },
                        new MvcRouteHandler())
                }
            };
        }
    }
}