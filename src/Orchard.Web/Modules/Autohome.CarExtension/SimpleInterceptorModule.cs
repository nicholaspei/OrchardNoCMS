using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Autofac;
using Autofac.Core;
using Orchard.Environment.AutofacUtil.DynamicProxy2;

namespace Autohome.CarExtension
{
    public class SimpleInterceptorModule:Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<CarInterceptor>();
        }

        protected override void AttachToComponentRegistration(IComponentRegistry componentRegistry, IComponentRegistration registration)
        {
            Type implementionType = registration.Activator.LimitType;
            if (DynamicProxyContext.From(registration) != null &&
                implementionType.FullName == "Autohome.Car.Services.CarInfoService")
            {
                registration.InterceptedBy<CarInterceptor>();
            }
        }
    }
}