"use server"
import {Event, IEvent} from "@/database";
import connectDB from "@/lib/mongodb";

export const getSimilarEventBySlug = async (slug: string): Promise<IEvent[]> => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean<IEvent>();
        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean<IEvent[]>();

        return similarEvents;
    } catch (err) {
        console.error("Error fetching similar events:", err);
        return [];
    }
};
