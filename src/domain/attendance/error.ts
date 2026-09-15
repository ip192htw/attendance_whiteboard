export type ReportSubmissionErrorCode =
    | "UNAUTHORIZED"
    | "NOT_MONITOR"
    | "INVALID_MONITOR_CLASS"
    | "REPORT_NOT_ALLOWED"
    | "REPORT_COOLDOWN"
    | "SETTINGS_NOT_CONFIGURED"
    | "INVALID_PAYLOAD"


export class ReportSubmissionError extends Error {
    constructor(
        public readonly code: ReportSubmissionErrorCode
    ) {
        super(code);
        this.name = "ReportSubmissionError";
    }
}