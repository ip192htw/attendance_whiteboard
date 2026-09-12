import { Report, ReportQuery, ReportList } from "./types";

export interface ReportRepository {

    getLatestByClass(classNo: string): Promise<Report>;

    getLatestByDate(date: string): Promise<Report[]>;

    find(query: ReportQuery): Promise<ReportList>;

}