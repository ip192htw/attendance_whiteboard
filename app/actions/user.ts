import { createContainer } from '@/src/container';

export async function getCurrentUser() {
    const container = await createContainer();
    return container.currentUser.get();
}