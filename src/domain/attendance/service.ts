import { ReportRepository } from "./repository";
import { Report } from "./types";

export interface ReportService {

    getReportsByDate(date: string): Promise<Report[]>;

    submitReport(payload: Record<string, number[]>): Promise<void>;

    correctReport(
        classNo: string,
        reportDate: string,
        payload: Record<string, number[]>
    ): Promise<void>;

}

class DefaultReportService
    implements ReportService {

    constructor(
        private readonly repository: ReportRepository
    ) {}

    async getReportsByDate(date: string): Promise<Report[]> {
        return this.repository.getByDate(date);
    }

    async submitReport(payload: Record<string, number[]>): Promise<void> {
        return this.repository.submit(payload);
    }

    async correctReport(
        classNo: string,
        reportDate: string,
        payload: Record<string, number[]>
    ): Promise<void> {
        return this.repository.correct(classNo, reportDate, payload);
    }


}

export function createReportService(
    repository: ReportRepository
): ReportService {
    return new DefaultReportService(repository);
}