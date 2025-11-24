// 🚀 Forces this route to always render dynamically on Vercel
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

export default function EventDetailsPage({
                                             params,
                                         }: {
    params: { slug: string };
}) {
    const slug = params?.slug;

    if (!slug) return <div>Invalid event</div>;

    return (
        <main>
            <Suspense fallback={<div>Loading event details…</div>}>
                <EventDetails slug={slug} />
            </Suspense>
        </main>
    );
}
