namespace HealthcareDirectory.Api.Models
{
    public record Facility(
        int Id,
        string Name,
        string Address,
        string City,
        string State,
        string Zip,
        string Phone
    );
}
