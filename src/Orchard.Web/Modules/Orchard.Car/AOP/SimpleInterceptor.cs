using Castle.Core.Interceptor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Orchard.Car.AOP
{
    public class SimpleInterceptor : IInterceptor
    {
        public void Intercept(IInvocation invocation)
        {
            if (invocation.Method.Name == "CreateCar")
            {
                invocation.Proceed();
                invocation.ReturnValue = true;
            }
            else {
                invocation.Proceed();
            }
        }
    }
}