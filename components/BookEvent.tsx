"use client"
import React from 'react'
import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

export const BookEvent = ({eventId, slug} :{eventId: string, slug: string}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        const {success, error} = await createBooking({eventId, slug, email});
        if (success) {
            setSubmitted(true);
            posthog.capture('event booked',{eventId, slug, email});
        } else {
            console.error('Booking Creation failed', error);
            posthog.captureException(error)
        }

    }
    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"/>
                    </div>

                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
}
