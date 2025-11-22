"use client"
import React from 'react'
import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

export const BookEvent = ({eventId, slug} :{eventId: string, slug: string}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // quick client-side validation — avoid sending empty values
        if (!eventId || !slug) {
            console.error('Booking aborted: missing eventId or slug', { eventId, slug });
            setError('Event information missing. Please refresh the page.');
            return;
        }
        if (!email || !email.trim()) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setError(null);

        // log payload for debugging
        const payload = { eventId: String(eventId), slug: String(slug), email: email.trim() };
        console.log('Booking payload ->', payload);

        try {
            // call your existing server helper
            const { success, error: respError } = await createBooking(payload);

            console.log('createBooking response ->', { success, respError });

            if (success) {
                setSubmitted(true);
                posthog.capture('event booked', { eventId, slug });
            } else {
                // show the server-provided error if available
                console.error('Booking Creation failed', respError);
                posthog.captureException(respError);
                setError(respError?.message ?? String(respError) ?? 'Failed to book event. Please try again.');
            }
        } catch (err: any) {
            console.error('Unexpected error during booking:', err);
            posthog.captureException(err);
            setError('Unexpected error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                        placeholder="Enter your email address"
                        required={true}/>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>

                    <button type="submit" className="button-submit" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            )}
        </div>
    )
}
