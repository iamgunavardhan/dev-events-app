import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import {BookEvent} from "@/components/BookEvent"; // ensure default export
import { getSimilarEventBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const EventDetailItem = ({
                             icon,
                             alt,
                             label,
                         }: {
    icon: string;
    alt: string;
    label: string;
}) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>
                {tag}
            </div>
        ))}
    </div>
);

type Props = { slug: string };

export default async function EventDetails({ slug }: Props) {
    if (!slug || slug === "undefined") {
        console.error("❌ Invalid slug:", slug);
        return notFound();
    }

    let event: any = null;

    try {
        const res = await fetch(`/api/events/${slug}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            console.error("❌ Event fetch failed:", res.status);
            return notFound();
        }

        const data = await res.json();
        event = data?.data || data?.event;

        if (!event) return notFound();
    } catch (err) {
        console.error("🚨 Error fetching event:", err);
        return notFound();
    }

    const {
        description,
        image,
        overview,
        date,
        time,
        location,
        mode,
        agenda,
        audience,
        tags,
        organizer,
    } = event;

    if (!description) return notFound();


    const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);

    const bookings = 10;

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image
                        src={image}
                        alt="Event Banner"
                        width={800}
                        height={800}
                        className="banner"
                    />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    <EventAgenda agendaItems={agenda || []} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags || []} />
                </div>

                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join {bookings} people who have already booked their spot!
                            </p>
                        ) : (
                            <p className="text-sm">Be the first to book your spot!</p>
                        )}

                        <BookEvent eventId={String(event.id ?? event._id ?? "")} slug={event.slug} />
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 ? (
                        similarEvents.map((similarEvent: IEvent) => (
                            <EventCard key={similarEvent.title} {...similarEvent} />
                        ))
                    ) : (
                        <p>No similar events found.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
