using System.Collections.Generic;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Repository;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            string AdminconnectionString = config.GetConnectionString("AdminDbConnection");
            string CartonconnectionString =  config.GetConnectionString("CartonDbConnection"); 
            string PTrackconnectionString =  config.GetConnectionString("PTrackDbConnection"); 
            
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IApplicationAdminDbContext>(provider => provider.GetService<ApplicationAdminDbContext>());
            services.AddScoped<IApplicationCartonDbContext>(provider => provider.GetService<ApplicationCartonDbContext>());
            services.AddScoped<IApplicationPTrackDbContext>(provider => provider.GetService<ApplicationPTrackDbContext>());
            // Inject the factory
            services.AddTransient<IDbConnectionFactory, DapperDbConenctionFactory>();
            services.AddScoped<IUserRepository, UserRepository>(); 
            services.AddScoped<IMasterRepository, MasterRepository>(); 
            services.AddScoped<ITestRepository, TestRepository>(); 
            services.AddScoped<IAdminRepository,AdminRepository>();
            services.AddScoped<ISalesRepository,SalesRepository>();
            services.AddScoped<IPTrackMasterRepository,PTrackMasterRepository>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);            

            ////---------=========== QUERY WITH EF ===============-----------  

            services.AddDbContext<ApplicationAdminDbContext>(options =>
            {
                options.UseLazyLoadingProxies();
                options.UseSqlServer(AdminconnectionString);
            });

            services.AddDbContext<ApplicationCartonDbContext>(options =>
            {
                options.UseLazyLoadingProxies();
                options.UseSqlServer(CartonconnectionString);
            });

            services.AddDbContext<ApplicationPTrackDbContext>(options =>
            {
                options.UseLazyLoadingProxies();
                options.UseSqlServer(CartonconnectionString);
            });

            ////------ ==== QUERY WITH DATABASE CONNECTION =============------------
            var connectionDict = new Dictionary<DatabaseConnectionName, string>
            {
                { DatabaseConnectionName.AdminDbConnection, AdminconnectionString },
                { DatabaseConnectionName.CartonDbConnection, CartonconnectionString },
                { DatabaseConnectionName.PTrackDbConnection, PTrackconnectionString }
            };

            // Inject this dict
            services.AddSingleton<IDictionary<DatabaseConnectionName, string>>(connectionDict);
            return services;
        }
    }
}