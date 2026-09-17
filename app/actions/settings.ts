import { createContainer } from '@/src/container';



export async function getReportConfig() {
    const container = await createContainer();
    return container.settingsService.getReportConfig();
}


export async function getClassNumberingConfig() {
    const container = await createContainer();
    return container.settingsService.getClassNumberingConfig();
}