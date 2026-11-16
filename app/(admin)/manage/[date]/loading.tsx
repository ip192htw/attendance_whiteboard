import { MetricsSkeleton, ClassTableSkeleton } from "../components"



export default async function DashboardSkeleton() {


    return (
        <div className="flex flex-col gap-space-lg w-full">


            <div className="flex flex-col">
                <h1 className="font-display text-4xl text-primary tracking-tight font-bold">
                    全校回報概況
                </h1>
            </div>

            {/* Metrics Grid */}
            <MetricsSkeleton />

            {/* Class List Table */}
            <ClassTableSkeleton />

        </div>
    );
}
