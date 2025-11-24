import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

export default function EventDetailsPage({
                                             params,
                                         }: {
    params: { slug: string };
}) {
    return (
        <main>
            <Suspense fallback={<div>Loading event details…</div>}>
                <EventDetails slug={params.slug} />
            </Suspense>
        </main>
    );
}
