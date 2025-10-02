using HealthcareDirectory.Api.Models;

namespace HealthcareDirectory.Api.Endpoints;

public static class LabEndpoints
{
    public static void MapLabEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/labs");

        // In-memory sample data; swap with EF Core or your data source
        var data = new List<Facility>
        {
            new(1, "Quest Diagnostics - Bryn Mawr", "830 Montgomery Ave", "Bryn Mawr", "PA", "19010", "(610) 555-0101"),
            new(2, "LabCorp - Ardmore", "123 Cricket Ave", "Ardmore", "PA", "19003", "(610) 555-0102")
        };

        group.MapGet("", () => Results.Ok(data));
    }
}
