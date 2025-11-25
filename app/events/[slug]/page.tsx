// app/events/[slug]/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (!slug) return <div>Invalid event</div>;

    return (
        <main>
            <Suspense fallback={<div>Loading event details…</div>}>
                <EventDetails slug={slug} />
            </Suspense>
        </main>
    );
}
