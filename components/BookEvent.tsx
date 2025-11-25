"use client";
import React, { useState } from "react";
import posthog from "posthog-js";

export const BookEvent = ({
                              eventId,
                              slug,
                          }: {
    eventId: string;
    slug: string;
}) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!eventId || !slug) {
            console.error("Booking aborted: missing eventId or slug", { eventId, slug });
            setError("Event information missing. Please refresh the page.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const payload = { eventId: String(eventId), slug: String(slug), email: email.trim() };

        try {
            const resp = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await resp.json();

            if (resp.ok && json.success) {
                setSubmitted(true);
                posthog.capture("event booked", { eventId, slug });
            } else {
                const serverErr = json?.error || json?.message || "Failed to book";
                setError(serverErr);
                posthog.captureException(serverErr);
            }
        } catch (err) {
            console.error("Unexpected error during booking:", err);
            posthog.captureException(err);
            setError("Unexpected error. Please try again.");
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
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                        />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>

                    <button type="submit" className="button-submit" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            )}
        </div>
    );
};
