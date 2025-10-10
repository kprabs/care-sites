using HealthcareDirectory.Api.Models;

namespace HealthcareDirectory.Api.Endpoints;

public static class RadiologyEndpoints
{
    public static void MapRadiologyEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/radiology");
        var data = new List<Facility>
        {
            new(1, "Main Line Radiology", "101 Lancaster Ave", "Bryn Mawr", "PA", "19010", "(610) 555-0301"),
            new(2, "Ardmore Imaging Center", "210 E Montgomery Ave", "Ardmore", "PA", "19003", "(610) 555-0302")
        };

        group.MapGet("", () => Results.Ok(data));
    }
}
