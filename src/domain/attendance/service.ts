import { ReportRepository } from "./repository";

export interface ReportService {

    getReportByID(id: string): Promise<Report>;

}

class DefaultReportService {

    constructor(
        private readonly repository: ReportRepository
    ) {}

}