import { notFound } from "next/navigation";
import Image from "next/image";
import {BookEvent} from "@/components/BookEvent";
import {getSimilarEventBySlug} from "@/lib/actions/event.actions";
import {IEvent} from "@/database";
import EventCard from "@/components/EventCard";
import {cacheLife} from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon, alt, lable}:{icon:string, alt:string, lable:string}) => (
   <div className="flex-row-gap-2 items-center">
       <Image src={icon} alt={alt} width={17} height={17}/>
       <p>{lable}</p>
   </div>
)

const EventAgenda = ({agendaItems} : {agendaItems:string[]}) => (
    <div className="agenda">
       <h2>Agenda</h2>
        <ul>
            {agendaItems.map(item => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EvenTags = ({tags}: {tags:string[]}) => (
    <div className="flex flex-row gap-1.5 flex-wrap ">
        {tags.map((tag) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async ({params} : { params : Promise<{slug: string}>}) => {
    'use cache'
    cacheLife("hours")
    const { slug } = await params;

    let event
    try {
        const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
            next: {revalidate: 60}
        })
        if (!request.ok) {
            if(request.status === 404) {
                return notFound()
            }
            throw new Error(`Failed to fetch event:${request.statusText}`);
        }

        const response = await request.json();
        event = response.event as IEvent

        if (!event) {
            return notFound()
        }
    } catch (error) {
        console.error('Error in fetching event:', error);
        return notFound()
    }


    const {description, image, overview,date , time, location , mode , agenda, audience, tags, organizer}  = event

    if (!description) return notFound();

    const bookings = 10;

    const similarEvents : IEvent[] = await getSimilarEventBySlug(slug)

    return (
        <section id="event">
            <div className="header">
              <h1>Event Description</h1>
              <p>{description}</p>
            </div>

            <div className="details">
                {/*left side - Event content */}
                <div className="content">
                  <Image src={image} alt="Event Banner" width={800} height={800} className="banner
                  "/>

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg"  alt="calendar" lable={date} />
                        <EventDetailItem icon="/icons/clock.svg"  alt="clock" lable={time} />
                        <EventDetailItem icon="/icons/pin.svg"  alt="pin" lable={location} />
                        <EventDetailItem icon="/icons/mode.svg"  alt="mode" lable={mode} />
                        <EventDetailItem icon="/icons/audience.svg"  alt="audience" lable={audience} />
                    </section>

                    <EventAgenda agendaItems={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer </h2>
                        <p>{organizer}</p>
                    </section>

                    <EvenTags tags={tags} />
                </div>

                {/*right side - Event content */}
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

                       <BookEvent eventId={event.id} slug={event.slug}/>
                   </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={similarEvent.title} {...similarEvent} />
                    )) }
                </div>
            </div>

        </section>
    );
};

export default EventDetailsPage;
