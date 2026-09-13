import { createContainer } from '@/src/container';

export async function exchangeCodeForSession(code: string) {
    const container = await createContainer();
    return container.sessionService.exchangeCodeForSession(code);
}