export type ReportSubmissionErrorCode =
    | "UNAUTHORIZED"
    | "NOT_MONITOR"
    | "INVALID_MONITOR_CLASS"
    | "REPORT_NOT_ALLOWED"
    | "REPORT_COOLDOWN"
    | "REPORT_START_TIME_NOT_CONFIGURED"
    | "REPORT_END_TIME_NOT_CONFIGURED"
    | "REPORT_COOLDOWN_NOT_CONFIGURED"
    | "INVALID_REPORT_COOLDOWN"
    | "INVALID_PAYLOAD"
    | "INVALID_LEAVE_TYPE"
    | "INVALID_STUDENT_NUMBER"
    | "DUPLICATE_STUDENT";


export class ReportSubmissionError extends Error {
    constructor(
        public readonly code: ReportSubmissionErrorCode
    ) {
        super(code);
        this.name = "ReportSubmissionError";
    }
}