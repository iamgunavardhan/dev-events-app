'use server';


import connectDB from '@/lib/mongodb';
import {Booking} from "@/database";

export const createBooking = async (
    { eventId, slug, email }: { eventId: string; slug: string; email: string }
) => {
    // Validate inputs
    if (!eventId || !slug || !email) {
        return { success: false, error: 'Missing required fields' };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, error: 'Invalid email format' };
    }

    try {
        await connectDB();

        // Check for existing booking
        const existingBooking = await Booking.findOne({ eventId, email });
        if (existingBooking) {
            return { success: false, error: 'You have already booked this event' };
        }

        const booking = await Booking.create({ eventId, slug, email })
        return { success: true, booking: booking.toObject() };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false, error: 'Failed to create booking. Please try again.' };
    }
};
