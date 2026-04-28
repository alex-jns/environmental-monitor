using EnvironmentalMonitorAPI;

namespace Environmental_Monitor
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            app.UseCors("AllowFrontend");

            // Default get if no coordinates are provided.
            app.MapGet("/api/weather", async (double? latitude, double? longitude) =>
            {
                // Default coordinates if none are provided
                double defaultLatitude = 36.5951;
                double defaultLongitude = -82.1887;

                if (latitude != null && longitude != null)
                {
                    return Results.Ok(await Monitor(latitude.Value, longitude.Value));
                }
                else
                {
                    return Results.Ok(await Monitor(defaultLatitude, defaultLongitude));
                }
            });

            app.MapPost("/api/weather", async (LocationRequest req) =>
            {
                Console.WriteLine("Received POST.");
                return Results.Ok(await Monitor(req.Latitude, req.Longitude));
            });

            // Default get if no coordinates are provided.
            app.MapGet("/api/report", async (string? startDate, string? endDate) =>
            {
                if (startDate == null || endDate == null)
                {
                    return Results.BadRequest("Start date and end date are required.");
                }

                return Results.Ok(GenerateMonthlyReport(startDate, endDate));
            });

            app.MapPost("/api/report", async (ReportRequest req) =>
            {
                Console.WriteLine("Received POST.");
                return Results.Ok(GenerateMonthlyReport(req.StartDate, req.EndDate));
            });

            app.Run();
        }

        public record LocationRequest(double Latitude, double Longitude);

        public record ReportRequest(string StartDate, string EndDate);

        /// <summary>
        /// The main mode of the program.
        /// Continuously gets live weather data from the pi and API, generates reports, and compares them to the last report.
        /// Allows the user to specify the interval between reports (default 1 minute).
        /// </summary>
        static async Task<Report> Monitor(double latitude, double longitude)
        {
            // Try to get live weather from the pi
            UdpReceiverAsync receiver = new UdpReceiverAsync();
            UdpMessage? udpMessage = await receiver.ReceiveAsync();

            // Try to get live weather from the API
            APIHandler handler = new APIHandler();
            WeatherResponse? apiWeather = await handler.CallAPI(latitude, longitude);

            // Null is bad
            if (udpMessage == null) { throw new ArgumentNullException(nameof(udpMessage)); }
            if (apiWeather == null) { throw new ArgumentNullException(nameof(apiWeather)); }

            // Default values (doubles are never null)
            if (latitude == 0) { latitude = 36.5951; }
            if (longitude == 0) { longitude = -82.1887; }

            // Pass objects to the report class to generate
            Report report = new Report(udpMessage, apiWeather);

            report.GenerateReport();
            report.CompareToLastReport();

            return report;
        }

        /// <summary>
        /// Provides the monthly report for the specified date range for the POST API endpoint.
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        static MonthlyReport? GenerateMonthlyReport(string startDate, string endDate)
        {
            try
            {
                MonthlyReport? monthlyReport = Report.GenerateMonthlyReport(startDate, endDate);

                // Null is bad
                if (monthlyReport == null) { throw new ArgumentNullException(nameof(monthlyReport)); }

                return monthlyReport;
            }
            catch (ArgumentNullException) { Console.WriteLine("Could not write monthly report."); }

            return null;
        }
    }
}