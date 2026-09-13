import { Report, ReportQuery, ReportList } from "./types";

export interface ReportRepository {

    getByDateAndClass(
        date: string,
        classNo: string
    ): Promise<Report[]>;

    getByDate(date: string): Promise<Report[]>;

    find(query: ReportQuery): Promise<ReportList>;

    submit(payload: Record<string, number[]>): Promise<void>;

    correct(
        classNo: string,
        reportDate: string,
        payload: Record<string, number[]>
    ): Promise<void>;

}