using System.Data;
using System.Threading;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace API.Data
{
    public class ApplicationPTrackDbContext : DbContext, IApplicationPTrackDbContext
    {
        public ApplicationPTrackDbContext(DbContextOptions<ApplicationPTrackDbContext> options) : base(options)
        {
        }

        public IDbConnection Connection => Database.GetDbConnection();

        public DbSet<ErrorLog> ErrorLog {get; set;} 
    }
}