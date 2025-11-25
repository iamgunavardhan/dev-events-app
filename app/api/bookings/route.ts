// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model"; // adjust import path if different

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventId, slug, email } = body;

        if (!eventId || !slug || !email) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        // Simple server-side email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
        }

        await connectDB();

        const existing = await Booking.findOne({ eventId, email });
        if (existing) {
            return NextResponse.json({ success: false, error: "Already booked" }, { status: 409 });
        }

        const created = await Booking.create({ eventId, slug, email });
        return NextResponse.json({ success: true, booking: JSON.parse(JSON.stringify(created)) }, { status: 201 });
    } catch (err) {
        console.error("Booking API error:", err);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
