import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

export default async function EventDetailsPage({
                                                   params,
                                               }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <main>
            <Suspense fallback={<div>Loading event details…</div>}>
                <EventDetails slug={slug} />
            </Suspense>
        </main>
    );
}
