import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Page() {


    try {
        if (!BASE_URL) {
            throw new Error("Environment variable NEXT_PUBLIC_BASE_URL is not defined.");
        }

        const response = await fetch(`${BASE_URL}/api/events`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch events: ${response.status} ${response.statusText}`);
            return (
                <section className="text-center mt-20">
                    <h2 className="text-red-500">Failed to load events (status {response.status})</h2>
                </section>
            );
        }

        const data = await response.json();

        if (!data?.events) {
            console.warn("⚠️ No events found in API response:", data);
            return (
                <section className="text-center mt-20">
                    <h2>No events available.</h2>
                </section>
            );
        }

        const { events } = data;

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
                            <li key={event.title}>
                                <EventCard {...event} />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        );
    } catch (error) {
        console.error("🚨 Fetch error:", error);
        return (
            <section className="text-center mt-20">
                <h2 className="text-red-500">Something went wrong loading events.</h2>
            </section>
        );
    }
}
