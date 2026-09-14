import { createContainer } from '@/src/container';



export async function getReportConfig() {
    const container = await createContainer();
    return container.settingsService.getReportConfig();
}