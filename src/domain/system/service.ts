import { SettingsRepository } from "./repository";
import { Setting } from "./types";


export type ReportConfig = {

    report_start_time: string;

    report_end_time: string;

    report_cooldown_seconds: string;

    semester_start: string;

    semester_end: string;

}


export  type ClassNumberingConfig = {
    baseYear: number;
    baseClass: number;
    classesPerGrade: number;
};

export interface SystemService {
    
    
    getReportConfig(): Promise<ReportConfig | null>;

    getClassNumberingConfig(): Promise<ClassNumberingConfig | null>;

    setSettings(setting: Setting[]): Promise<void>;


}


class DefaultSystemsService 
implements SystemService {

    constructor(
        private readonly settingsRepository: SettingsRepository,
    ) {}

    async getReportConfig(): Promise<ReportConfig | null> {
        const keys = [
            "report_start_time",
            "report_end_time",
            "report_cooldown_seconds",
            "semester_start_date",
            "semester_end_date",
        ];

        const settings = await this.settingsRepository.getMany(keys);

        if (settings.length === 0) {
            return null;
        }

        const settingsMap = new Map(settings.map(s => [s.key, s.value]));

        const config: ReportConfig = {
            report_start_time: settingsMap.get("report_start_time") || "",
            report_end_time: settingsMap.get("report_end_time") || "",
            report_cooldown_seconds: settingsMap.get("report_cooldown_seconds") || "",
            semester_start: settingsMap.get("semester_start_date") || "",
            semester_end: settingsMap.get("semester_end_date") || "",
        };

        return config;
    }

    async getClassNumberingConfig(): Promise<ClassNumberingConfig | null> {
        const keys = [
            "base_year",
            "base_class",
            "classes_per_grade",
        ];

        const settings = await this.settingsRepository.getMany(keys);

        if (settings.length === 0) {
            return null;
        }

        const settingsMap = new Map(settings.map(s => [s.key, s.value]));


        const config: ClassNumberingConfig = {
            baseYear: parseInt(settingsMap.get("base_year") || "0", 10),
            baseClass: parseInt(settingsMap.get("base_class") || "0", 10),
            classesPerGrade: parseInt(settingsMap.get("classes_per_grade") || "0", 10),
        };

        return config;
    }

    async setSettings(settings: Setting[]): Promise<void> {
        await this.settingsRepository.setMany(settings);
    }
}

export function createSystemService(
    settingsRepository: SettingsRepository
): SystemService {
    return new DefaultSystemsService(settingsRepository);
}