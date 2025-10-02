using HealthcareDirectory.Api.Models;

namespace HealthcareDirectory.Api.Endpoints;

public static class PhysicalTherapyEndpoints
{
    public static void MapPhysicalTherapyEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/pt");
        var data = new List<Facility>
        {
            new(1, "Main Line PT", "45 Haverford Rd", "Wynnewood", "PA", "19096", "(610) 555-0201"),
            new(2, "Ardmore Rehab & PT", "19 Cricket Ave", "Ardmore", "PA", "19003", "(610) 555-0202")
        };

        group.MapGet("", () => Results.Ok(data));
    }
}
