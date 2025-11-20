import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

// Cloudinary config — must be here
cloudinary.config();


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const event: Record<string, unknown> = Object.fromEntries(formData.entries());

        // Ensure arrays are parsed correctly
        event.agenda = formData.getAll("agenda").map(String);
        event.tags = formData.getAll("tags").map(String);

        const file = formData.get("image") as File;
        if (!file)
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );

        let tags = JSON.parse(formData.get('tags') as string)
        let agenda = JSON.parse(formData.get('agenda') as string)

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: "image", folder: "DevEvent" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                )
                .end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        // Save event to MongoDB
        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
            });

        return NextResponse.json(
            { message: "The Event created successfully.", event: createdEvent },
            { status: 201 }
        );
    } catch (e) {
        console.error("EVENT CREATION ERROR:", e);

        if (e instanceof Error && e.name === "ValidationError") {
            return NextResponse.json({ message: e.message }, { status: 400 });
        }

        return NextResponse.json(
            {
                message: "Event Creation Failed",
                error: e instanceof Error ? e.message : "unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json(
            { message: "Events fetched successfully.", events },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { message: "Event fetching failed", error: e },
            { status: 500 }
        );
    }
}
