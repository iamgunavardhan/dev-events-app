import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

/**
 * GET /api/events/[slug]
 * Fetches a single event by its unique slug
 */
export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ slug: string }> } // ✅ params is a Promise
): Promise<NextResponse> {
    try {
        const { slug } = await params; // ✅ Unwrap it here

        // Validate slug parameter
        if (!slug  || slug.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Valid slug parameter is required' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await connectDB();

        // Find event by slug
        const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean();

        // Handle not found
        if (!event) {
            return NextResponse.json(
                { success: false, error: `Event with slug "${slug}" not found` },
                { status: 404 }
            );
        }

        // Success
        return NextResponse.json({ success: true, data: event }, { status: 200 });
    } catch (error) {
        console.error('Error fetching event by slug:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'An unexpected error occurred while fetching the event',
            },
            { status: 500 }
        );
    }
}
