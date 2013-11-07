using Orchard.Data;
using Orchard.Security;
using Orchard.UI.Notify;

namespace Orchard {
    /// <summary>
    /// Most important parts of the Orchard API
    /// </summary>
    public interface IOrchardServices : IDependency {
        ITransactionManager TransactionManager { get; }
        IAuthorizer Authorizer { get; }
        INotifier Notifier { get; }

        /// <summary>
        /// Shape factory
        /// </summary>
        /// <example>
        /// dynamic shape = New.ShapeName(Parameter: myVar)
        /// 
        /// Now the shape can used in various ways, like returning it from a controller action
        /// inside a ShapeResult or adding it to the Layout shape.
        /// 
        /// Inside the shape template (ShapeName.cshtml) the parameters can be accessed as follows:
        /// @Model.Parameter
        /// </example>
        dynamic New { get; }

        WorkContext WorkContext { get; }
    }
}
