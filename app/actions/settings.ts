import { createContainer } from '@/src/container';

const container = await createContainer();

export async function getReportConfig() {
    
    return container.settingsService.getReportConfig();
}