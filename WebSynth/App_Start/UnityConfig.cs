using WebSynth.Infrastructure.DependencyInjection;
using Microsoft.Practices.Unity;
using System;
using System.Web.Http;
using Unity.WebApi;

namespace WebSynth
{
    public static class UnityConfig
    {
        #region Unity Container
        public static Lazy<IUnityContainer> Container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        private static void RegisterTypes(IUnityContainer container)
        {
            //container.RegisterType<Interface, Implementation>();
        }

        /// <summary>
        /// Gets the configured Unity container.
        /// </summary>
        public static IUnityContainer GetConfiguredContainer()
        {
            return Container.Value;
        }
        #endregion

        public static void RegisterComponents()
        {
            GlobalConfiguration.Configuration.DependencyResolver = new UnityResolver(GetConfiguredContainer());
        }

    }
}