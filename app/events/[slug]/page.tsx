import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

const EventDetailsPage = ({ params }: { params: { slug: string } }) => {
    const { slug } = params;

    return (
        <main>
            <Suspense fallback={<div>Loading event details…</div>}>
                {/* EventDetails is an async Server Component that accepts slug: string */}

                <EventDetails slug={slug} />
            </Suspense>
        </main>
    );
};

export default EventDetailsPage;
