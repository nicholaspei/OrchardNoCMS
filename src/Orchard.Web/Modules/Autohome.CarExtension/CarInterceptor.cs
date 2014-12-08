using System;
using System.Collections.Generic;
using System.Linq;
using Autohome.Car.Models;
using Castle.Core.Interceptor;

namespace Autohome.CarExtension
{
    public class CarInterceptor:IInterceptor
    {
        public void Intercept(IInvocation invocation)
        {
            if (invocation.Method.Name == "List")
            {
                invocation.Proceed();
                var result = invocation.ReturnValue;
                invocation.ReturnValue = AddSeatCount(result);
            }
            else
            {
                invocation.Proceed();
            }
        }

        private object AddSeatCount(object list)
        {
            var listwithSeat = from item in (List<CarInfo>) list
                select new
                {
                    item.Id,
                    item.Name,
                    item.Description,
                    item.Price,
                    SeatCount=5
                };
            return listwithSeat;
        }
    }
}