// lib/actions/event.actions.ts
import connectDB from "@/lib/mongodb";
import { Event as EventModel, IEvent } from "@/database";

/**
 * Server-side helper: get all events (no network fetch)
 */
export async function getAllEvents(): Promise<IEvent[]> {
    await connectDB();
    const events = await EventModel.find().sort({ createdAt: -1 }).lean<IEvent[]>();
    return events || [];
}

/**
 * Server-side helper: get event by slug (no network fetch)
 */
export async function getEventBySlug(slug: string): Promise<IEvent | null> {
    if (!slug) return null;
    await connectDB();
    const event = await EventModel.findOne({ slug: slug.trim().toLowerCase() }).lean<IEvent>();
    return event ?? null;
}

/**
 * getSimilarEventBySlug already existed — keep it but ensure it uses connectDB and lean()
 */
export async function getSimilarEventBySlug(slug: string): Promise<IEvent[]> {
    try {
        await connectDB();
        const event = await EventModel.findOne({ slug }).lean<IEvent>();
        if (!event) return [];

        const similarEvents = await EventModel.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean<IEvent[]>();

        return similarEvents || [];
    } catch (err) {
        console.error("Error fetching similar events:", err);
        return [];
    }
}
