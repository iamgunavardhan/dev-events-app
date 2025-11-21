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
        setIsLoading(true);
        setError(null);

        const {success, error} = await createBooking({eventId, slug, email});
        if (success) {
            setSubmitted(true);
            posthog.capture('event booked',{eventId, slug});
        } else {
            console.error('Booking Creation failed', error);
            posthog.captureException(error)
            setError('Failed to book event. Please try again.');
        }
        setIsLoading(false);
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
