import { signOut } from '@/app/actions/auth';

export async function GET() {
    await signOut();

    
    return new Response(JSON.stringify({ message: 'Signed out successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}