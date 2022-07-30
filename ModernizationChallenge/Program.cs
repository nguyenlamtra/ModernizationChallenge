using Microsoft.EntityFrameworkCore;
using ModernizationChallenge.Entities;
using ModernizationChallenge.Services;
using ModernizationChallenge.Middleware;

namespace ModernizationChallenge
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddTransient<ITaskService, TaskService>();
            builder.Services.AddDbContext<ModernizationChallengeDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ModernizationChallengeDbContext")));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
            });

            var app = builder.Build();

            // Run migration
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetService<ModernizationChallengeDbContext>();
                db?.Database.Migrate();
                db?.Database.EnsureCreated();
            }

            app.UseCors("AllowAll");

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.UseMiddleware<ExceptionMiddleware>();

            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "ClientApp/mordernisation-challenge";

            //    if (app.Environment.IsDevelopment())
            //    {
            //        spa.UseProxyToSpaDevelopmentServer("https://localhost:5002");
            //    }
            //});

            app.Run();
        }
    }
}