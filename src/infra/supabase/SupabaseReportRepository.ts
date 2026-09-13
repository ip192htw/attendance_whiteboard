import { SupabaseClient } from "@supabase/supabase-js";

import { ReportRepository, Report, ReportList, ReportQuery } from "../../domain/attendance";

export class SupabaseReportRepository 
    implements ReportRepository {

    constructor(
        protected readonly client: SupabaseClient,
    ) {}

    private from() {
        return this.client
            .schema("attendance")
            .from("reports");
    }

    async getByDateAndClass(
        date: string,
        classNo: string
    ): Promise<Report[]> {

        const { data, error } = await this.from()
            .select("*")
            .eq("report_date", date)
            .eq("class", classNo);

        if (error) {
            throw error;
        }

        if (!data) {
            return [];
        }

        return data as Report[];
    }

    async getByDate(date: string): Promise<Report[]> {
        const { data, error } = await this.from()
            .select("*")
            .eq("report_date", date);

        if (error) {
            throw error;
        }

        if (!data) {
            return [];
        }

        return data as Report[];
    }

    async find(query: ReportQuery): Promise<ReportList> {
        throw new Error("Method not implemented.");
    }

    async submit(payload: Record<string, number[]>): Promise<void> {
        const { error } = await this.client
            .rpc("summit_report", {
                payload: payload,
            });

        if (error) {
            throw error;
        }
    }

    async correct(
        classNo: string,
        reportDate: string,
        payload: Record<string, number[]>
    ): Promise<void> {
        const { error } = await this.client
            .rpc("correct_report", {
                class: classNo,
                report_date: reportDate,
                payload: payload,
            });

        if (error) {
            throw error;
        }
    }

}