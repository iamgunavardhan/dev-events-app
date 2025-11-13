// lib/constants.ts

export type EventItem = {
    image: string;
    title: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

export const events: EventItem[] = [
    {
        image: "/images/event1.png",
        title: "React Summit US 2025",
        slug: "react-summit-us-2025",
        location: "San Francisco, CA, USA",
        date: "2025-11-07",
        time: "9:00 AM",
    },
    {
        image: "/images/event2.png",
        title: "KubeCon + CloudNativeCon Europe 2026",
        slug: "kubecon-cloudnativecon-eu-2026",
        location: "Vienna, Austria",
        date: "2026-03-18",
        time: "10:00 AM",
    },
    {
        image: "/images/event3.png",
        title: "AWS re:Invent 2025",
        slug: "aws-reinvent-2025",
        location: "Las Vegas, NV, USA",
        date: "2025-12-01",
        time: "08:30 AM",
    },
    {
        image: "/images/event4.png",
        title: "Next.js Conf 2025",
        slug: "next.js-conf2025",
        location: "Lisbon, Portugal",
        date: "2025-08-07",
        time: "10:00 AM",
    },
    {
        image: "/images/event5.png",
        title: "Google Cloud Next 2026",
        slug: "google-cloud-next-2026",
        location: "London, United Kingdom",
        date: "2026-07-24",
        time: "9:00 AM",
    },
    {
        image: "/images/event6.png",
        title: "ETHGlobal Hackathon: Paris 2026",
        slug: "eth-global-hackathon",
        location: "Paris, France",
        date: "2026-09-23",
        time: "10:00 AM",
    },
    {
        image: "/images/event-full.png",
        title: "Open Source Summit North America 2026",
        slug: "open-source-summit-north-america-2026",
        location: "Cambridge, MA, USA",
        date: "2026-09-12",
        time: "8:00 AM",
    },
];
