import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {Event} from "@/database";

export async function POST(req: NextRequest) {
    try {
    await connectDB()
        const formData = await req.formData();
               const event: Record<string, unknown> = Object.fromEntries(formData.entries());
               event.agenda = formData.getAll('agenda').map(String);
               event.tags = formData.getAll('tags').map(String);

        const CreatedEvent = await Event.create(event);
        return  NextResponse.json({message:"The Event created successfully.",event: CreatedEvent},{status:201});

    } catch (e) {
              console.error(e);
               if (e instanceof Error && e.name === 'ValidationError') {
                       return NextResponse.json(
                               { message: e.message },
                               { status: 400 }
                           );
                   }
               return NextResponse.json(
                       { message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'unknown error' },
                       { status: 500 }
                   );
           }
}