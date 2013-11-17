using Castle.Core.Interceptor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.Car.Models;

namespace Orchard.Car.AOP
{
    public class SimpleInterceptor : IInterceptor
    {
        public void Intercept(IInvocation invocation)
        {
            if (invocation.Method.Name == "GetList")
            {
                invocation.Proceed();

              var result=  invocation.ReturnValue ;
              invocation.ReturnValue = ThumbAddin(result);
            }
            else {
                invocation.Proceed();
            }
        }

        private object ThumbAddin(object list)
        {
            var listwithThumb = from item in (IList<CarInfo>)list
                                select new
                                {
                                    Id=item.Id,
                                    Name=item.Name,
                                    Description=item.Description,
                                    Price=item.Price,
                                    BrandId=item.BrandId,
                                    SeatNum=item.SeatNum,
                                    Thumb = item.BrandId+".jpg"
                                };
            return listwithThumb;
        }
    }
}