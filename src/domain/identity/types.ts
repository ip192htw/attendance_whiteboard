
export interface Profile {

    email: string;

    auth_user_id: string;

    name: string;

    role: Role;

    class: string;

    created_at: string;
    updated_at: string;
}

export type Role =
    | 'monitor'
    | 'instructor'
    | 'supervisor'

export interface ProfileQuery {
    email?: string;

    role?: Role;

    class?: string;

    sort?: ProfileSort;

    page: number;

    pageSize: number;
}


export type ProfileSort =
    | "class-asc"
    | "class-desc"
    | 'email-asc'
    | 'email-desc'
    | 'newest'
    | 'oldest'

export interface ProfileList {
    
    items: Profile[];

    total: number;

    page: number;

    pageSize: number;
}