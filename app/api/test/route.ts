import { getCurrentUser } from '@/app/actions/user';

export async function GET() {
    const user = await getCurrentUser();

    return new Response(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}