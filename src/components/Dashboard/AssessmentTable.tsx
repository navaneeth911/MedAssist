import { Badge } from "../ui/badge";

type Assessment = {
  _id?: string;
  risk: string;
  specialist: string;
  condition?: string;
  createdAt: string;
};

interface AssessmentTableProps {
  assessments: Assessment[];
}

export function AssessmentTable({
  assessments,
}: AssessmentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border/70 p-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Recent Assessments
          </h3>

          <p className="text-xs text-muted-foreground">
            Your latest AI-powered symptom evaluations
          </p>
        </div>

        <button className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium">
                Date
              </th>

              <th className="px-5 py-3 text-left font-medium">
                Condition
              </th>

              <th className="px-5 py-3 text-left font-medium">
                Risk Level
              </th>

              <th className="px-5 py-3 text-left font-medium">
                Specialist
              </th>

              <th className="px-5 py-3 text-left font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {assessments.length > 0 ? (
              assessments.map(
                (assessment, index) => (
                  <tr
                    key={
                      assessment._id || index
                    }
                    className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                      {new Date(
                        assessment.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {assessment.condition ||
                        "Symptom Assessment"}
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full border px-2.5 py-0.5 ${
                          assessment.risk ===
                          "High"
                            ? "bg-red-100 text-red-600"
                            : assessment.risk ===
                              "Medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {assessment.risk}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {
                        assessment.specialist
                      }
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Completed
                      </span>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-muted-foreground"
                >
                  No assessments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}