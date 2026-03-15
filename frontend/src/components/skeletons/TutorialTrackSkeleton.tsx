/**
 * TutorialTrackSkeleton — loading placeholder matching a tutorialTracks section.
 */
export default function TutorialTrackSkeleton() {
    return (
        <section className="space-y-8 animate-pulse">
            {/* Category header */}
            <div className="flex items-center justify-between border-b-2 border-border/30 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-card border border-border" />
                    <div className="h-6 w-48 rounded bg-card" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-card" />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-secondary" />
                            <div className="h-6 w-20 rounded-lg bg-secondary" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 w-4/5 rounded bg-secondary" />
                            <div className="h-5 w-3/5 rounded bg-secondary" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between">
                                <div className="h-3 w-20 rounded bg-secondary" />
                                <div className="h-3 w-24 rounded bg-secondary" />
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                <div className="h-full w-0 bg-primary/30 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
