import { SettingsRepository } from "./repository";
import { Setting } from "./types";


export interface ReportConfig {

    report_start_time: string;

    report_end_time: string;

    semester_start: string;

    semester_end: string;

}

export interface SettingsService {
    
    
    getReportConfig(): Promise<ReportConfig | null>;

    setSettings(setting: Setting[]): Promise<void>;


}


class DefaultSewttingsService 
implements SettingsService {

    constructor(
        private readonly settingsRepository: SettingsRepository,
    ) {}

    async getReportConfig(): Promise<ReportConfig | null> {
        const keys = [
            "report_start_time",
            "report_end_time",
            "semester_start",
            "semester_end"
        ];

        const settings = await this.settingsRepository.getMany(keys);

        if (settings.length === 0) {
            return null;
        }

        const settingsMap = new Map(settings.map(s => [s.key, s.value]));

        const config: ReportConfig = {
            report_start_time: settingsMap.get("report_start_time") || "",
            report_end_time: settingsMap.get("report_end_time") || "",
            semester_start: settingsMap.get("semester_start") || "",
            semester_end: settingsMap.get("semester_end") || "",
        };

        return config;
    }

    async setSettings(settings: Setting[]): Promise<void> {
        await this.settingsRepository.setMany(settings);
    }
}

export function createSettingsService(
    settingsRepository: SettingsRepository
): SettingsService {
    return new DefaultSewttingsService(settingsRepository);
}