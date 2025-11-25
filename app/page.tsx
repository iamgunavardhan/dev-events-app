// app/page.tsx
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/event.actions";

export const dynamic = "force-dynamic"; // ensure runtime fetches (optional)
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Page() {
    try {
        // Server-side DB call (no fetch to /api/events)
        const events: IEvent[] = await getAllEvents();

        if (!events || events.length === 0) {
            return (
                <section className="text-center mt-20">
                    <h2>No events available.</h2>
                </section>
            );
        }

        return (
            <section>
                <h1 className="text-center">
                    The Hub for Every Dev
                    <br />
                    Event You Can't Miss
                </h1>
                <p className="text-center mt-5">
                    Hackathons, Meetups, and Conferences — All in one Place
                </p>

                <ExploreBtn />

                <div className="mt-20 space-y-7">
                    <h3>Featured Events</h3>
                    <ul className="events list-none">
                        {events.map((event: IEvent) => (
                            <li key={event._id ? String(event._id) : event.title}>
                                <EventCard {...event} />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        );
    } catch (error) {
        console.error("🚨 Page fetch error:", error);
        return (
            <section className="text-center mt-20">
                <h2 className="text-red-500">Something went wrong loading events.</h2>
            </section>
        );
    }
}
