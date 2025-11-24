import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

/**
 * GET /api/events/[slug]
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const slug = params.slug;

        if (!slug || slug.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Valid slug parameter is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean();

        if (!event) {
            return NextResponse.json(
                { success: false, error: `Event with slug "${slug}" not found` },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: event }, { status: 200 });
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return NextResponse.json(
            {
                success: false,
                error: "An unexpected error occurred while fetching the event",
            },
            { status: 500 }
        );
    }
}
