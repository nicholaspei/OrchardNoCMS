using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using NUnit.Framework;
using Orchard.Caching;
using Orchard.Framework.Tests.Stubs;
using Orchard.Services;

namespace Orchard.Framework.Tests.Caching
{
    [TestFixture]
    public class ClockCachingTests
    {
        private IContainer _container;
        private ICacheManager _cacheManager;
        private StubClock _clock;

        [SetUp]
        public void Init()
        {
            var builder = new ContainerBuilder();
            builder.RegisterModule(new CacheModule());
            builder.RegisterType<DefaultCacheManager>().As<ICacheManager>();
            builder.RegisterType<DefaultCacheHolder>().As<ICacheHolder>().SingleInstance();
            builder.RegisterType<DefaultCacheContextAccessor>().As<ICacheContextAccessor>();
            builder.RegisterInstance<IClock>(_clock=new StubClock());
            _container = builder.Build();
            _cacheManager = _container.Resolve<ICacheManager>(new TypedParameter(typeof (Type), GetType()));

        }

        [Test]
        public void WhenAbsoluteShouldHandleAbsoluteTime()
        {
            var inOneSecond = _clock.UtcNow.AddSeconds(1);
            var cached = 0;

            Func<int> retrieve = ()
                => _cacheManager.Get("testItem",
                    ctx =>
                    {
                        ctx.Monitor(_clock.WhenUtc(inOneSecond));
                        return ++cached;
                    });

            Assert.That(retrieve(),Is.EqualTo(1));

            for (var i = 0; i < 10; i++)
            {
                Assert.That(retrieve(),Is.EqualTo(1));
            }
            _clock.Advance(TimeSpan.FromSeconds(1));

            Assert.That(retrieve(),Is.EqualTo(2));
            Assert.That(retrieve(),Is.EqualTo(3));
            Assert.That(retrieve(),Is.EqualTo(4));
        }
    }
}
