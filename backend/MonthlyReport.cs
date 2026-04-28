using Environmental_Monitor;

namespace EnvironmentalMonitorAPI
{
    public class MonthlyReport
    {
        public string? starting_date { get; set; }
        public string? ending_date { get; set; }
        public int sample_count { get; set; }
        public MonthlyInside? inside { get; set; }
        public MonthlyOutside? outside { get; set; }
    }

    public class MonthlyInside
    {
        public double starting_temperatureF { get; set; }
        public double starting_temperatureC { get; set; }
        public double starting_humidity { get; set; }
        public double ending_temperatureF { get; set; }
        public double ending_temperatureC { get; set; }
        public double ending_humidity { get; set; }
        public double delta_temperatureF { get; set; }
        public double delta_temperatureC { get; set; }
        public double delta_humidity { get; set; }
        public double average_temperatureF { get; set; }
        public double average_temperatureC { get; set; }
        public double average_humidity { get; set; }
    }

    public class MonthlyOutside
    {
        public double starting_temperatureF { get; set; }
        public double starting_temperatureC { get; set; }
        public double starting_humidity { get; set; }
        public double ending_temperatureF { get; set; }
        public double ending_temperatureC { get; set; }
        public double ending_humidity { get; set; }
        public double delta_temperatureF { get; set; }
        public double delta_temperatureC { get; set; }
        public double delta_humidity { get; set; }
        public double average_temperatureF { get; set; }
        public double average_temperatureC { get; set; }
        public double average_humidity { get; set; }
    }
}
