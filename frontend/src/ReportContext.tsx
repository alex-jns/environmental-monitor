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

// --- Context Definition ---
const MonthlyReportContext = createContext<ReportContextType | null>(null);

export function MonthlyReportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/reports/latest-monthly")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setReport(data))
      .catch(() => setError("Could not load initial report"))
      .finally(() => setLoading(false));
  }, []);

  /** Sends POST request to trigger the C# GenerateMonthlyReport method. */
  const generateMonthlyReport = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!res.ok) throw new Error(`Generation failed: ${res.statusText}`);

      // Parse the MonthlyReport returned by the C# method
      const result: MonthlyReport = await res.json();
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MonthlyReportContext.Provider
      value={{ report, loading, error, generateMonthlyReport }}
    >
      {children}
    </MonthlyReportContext.Provider>
  );
}

// --- Custom Hook ---
export function useMonthlyReport() {
  const context = useContext(MonthlyReportContext);
  if (!context) {
    throw new Error(
      "useMonthlyReport must be used inside MonthlyReportProvider",
    );
  }
  return context;
}
