// Import React hooks and utilities for context and state management
import { createContext, useContext, useState, useEffect } from "react";

/** Inside and outside reports use the same structure so reuse this. */
interface Data {
  starting_temperatureF: number;
  starting_temperatureC: number;
  starting_humidity: number;
  ending_temperatureF: number;
  ending_temperatureC: number;
  ending_humidity: number;
  delta_temperatureF: number;
  delta_temperatureC: number;
  delta_humidity: number;
  average_temperatureF: number;
  average_temperatureC: number;
  average_humidity: number;
}

/** Represents the monthly report object returned from POST */
interface MonthlyReport {
  starting_date: string;
  ending_date: string;
  sample_count: number;
  inside: Data;
  outside: Data;
}

/** Reusable context for the report page */
interface ReportContextType {
  report: MonthlyReport | null;
  loading: boolean;
  error: string | null;
  generateMonthlyReport: (startDate: string, endDate: string) => Promise<void>;
  refresh?: () => Promise<void>;
}

/** Initializes the context with a default value of null */
const MonthlyReportContext = createContext<ReportContextType | null>(null);

/** Component that wraps around the app to provide the data (use <MonthlyReportProvider>) */
export function MonthlyReportProvider({
  children, // Represents the components nested inside this provider
}: {
  children: React.ReactNode; // Type definition for child elements
}) {
  // Holds the report data retrieved from the API
  const [report, setReport] = useState<MonthlyReport | null>(null);

  // Is loading or not
  const [loading, setLoading] = useState<boolean>(false);

  // For errors
  const [error, setError] = useState<string | null>(null);

  // Run when component loads
  useEffect(() => {
    setLoading(true); // Start loading
    fetch("/api/reports") // GET request to backend
      .then((res) => (res.ok ? res.json() : null)) // Convert to JSON
      .then((data) => setReport(data)) // Update the state
      .catch(() => setError("Could not load initial report.")) // Catch error
      .finally(() => setLoading(false)); // Finish
  }, []); // Run only once

  /** Sends POST request to trigger the C# GenerateMonthlyReport method. */
  const generateMonthlyReport = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);

    try {
      // Send date range to POST endpoint
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Send JSON to backend
        body: JSON.stringify({ startDate, endDate }), // Serialize JSON
      });

      // If API errors out (error code) throw exception and catch
      if (!res.ok) throw new Error(`Generation failed: ${res.statusText}`);

      // Parse the MonthlyReport returned by the C# method
      const result: MonthlyReport = await res.json();
      setReport(result); // Save to state
    } catch (err) {
      // Error catch
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false); // Finish
    }
  };

  // Update context with new states
  return (
    <MonthlyReportContext.Provider
      value={{ report, loading, error, generateMonthlyReport }}
    >
      {children}
    </MonthlyReportContext.Provider>
  );
}

// Provide context to the components that need it
export function useMonthlyReport() {
  const context = useContext(MonthlyReportContext);
  if (!context) {
    throw new Error(
      "useMonthlyReport must be used inside MonthlyReportProvider",
    );
  }
  return context;
}
