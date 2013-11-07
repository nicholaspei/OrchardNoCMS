using Orchard.Security.Permissions;

namespace Orchard.Security {
    /// <summary>
    /// Entry-point for configured authorization scheme. Role-based system
    /// provided by default. 
    /// </summary>
    public interface IAuthorizationService : IDependency {
        void CheckAccess(Permission permission, IUser user, object content);
        bool TryCheckAccess(Permission permission, IUser user, object content);
    }
}