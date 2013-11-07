namespace Orchard.Security {
    /// <summary>
    /// Interface provided by the "User" model. 
    /// </summary>
    public interface IUser   {
        string UserName { get; }
        string Email { get; }
    }
}
