using System.Security.Cryptography.X509Certificates;
using System.Threading;
using Autohome.Car.Models;
using Orchard.Events;

namespace Autohome.Car.Handlers
{
    public interface ICarEventHandler:IEventHandler
    {       
        void OnCarCreating(CarInfo model);
    }
}
