using HealthcareDirectory.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Allow Angular dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4300")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
var app = builder.Build();
app.UseCors("dev");




 
app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapLabEndpoints();
app.MapPhysicalTherapyEndpoints();
app.MapRadiologyEndpoints();

app.Run();
