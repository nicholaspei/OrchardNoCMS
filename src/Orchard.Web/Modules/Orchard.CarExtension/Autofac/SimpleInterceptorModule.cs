using Autofac;
using Autofac.Core;
using Autofac.Features.Metadata;
using Castle.Core.Interceptor;
using Orchard.Car.AOP;
using Orchard.Environment.AutofacUtil.DynamicProxy2;
using System;

namespace Orchard.Car.Autofac
{
    public class SimpleInterceptorModule:Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SimpleInterceptor>();
            base.Load(builder);
        }
        protected override void AttachToComponentRegistration(IComponentRegistry componentRegistry, IComponentRegistration registration)
        {
            Type implementationType = registration.Activator.LimitType;
            if (DynamicProxyContext.From(registration) != null && implementationType.FullName == "Orchard.Car.Services.CarInfoService")
            {   
                registration.InterceptedBy<SimpleInterceptor>();
            }
        }
    }
}