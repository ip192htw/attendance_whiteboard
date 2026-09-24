export interface Report {

    id: string;

    class: string;

    report_date: string;

    submitted_by: string;

    submitted_at: string;

    payload: Record<string, number[]>;
}


export interface GetClassHistoryQuery {

    classNo?: string;

    before?: string;

    limit?: number;
}




export interface ClassHistoryResult {

    items: Report[];

    nextCursor: string;

    hasMore: boolean

}