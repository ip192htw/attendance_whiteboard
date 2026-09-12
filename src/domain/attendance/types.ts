export interface Report {

    id: string;

    class: string;

    report_date: string;

    submitted_by: string;

    submitted_at: string;

    payload: Record<string, number[]>;
}


export interface ReportQuery {

    classes?: string[];

    report_dates?: string[];

    sort?: ReportSort;

    page: number;

    pageSize: number;
}

export type ReportSort =
    | "class-asc"
    | "class-desc"
    | 'date-asc'
    | 'date-desc'
    | 'newest'
    | 'oldest'

export interface ReportList {

    items: Report[];

    total: number;

    page: number;

    pageSize: number;

}