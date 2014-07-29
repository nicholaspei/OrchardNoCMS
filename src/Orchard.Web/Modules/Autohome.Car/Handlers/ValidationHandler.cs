using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Autohome.Car.Models;
using Orchard;

namespace Autohome.Car.Handlers
{
    public class ValidationHandler:ICarEventHandler
    {      
        
        public void OnCarCreating(CarInfo model)
        {
           if(model.Price<0)
               throw new ValidationException();
        }
    }
}