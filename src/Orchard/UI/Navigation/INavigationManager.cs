using System.Collections.Generic;
using System.Web.Routing;

namespace Orchard.UI.Navigation {
    public interface INavigationManager : IDependency {
        IEnumerable<MenuItem> BuildMenu(string menuName);
        IEnumerable<MenuItem> BuildMenu(object menu);
        IEnumerable<string> BuildImageSets(string menuName);
        string GetUrl(string menuItemUrl, RouteValueDictionary routeValueDictionary);
        string GetNextPosition(object menu);
    }
}