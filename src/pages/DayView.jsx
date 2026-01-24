import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components/ui.jsx";
import { DayDetailCard } from "../components/day/DayDetail.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function DayView() {
    const { dayName } = useParams();
    const { currentPlan } = useUser();

    if (!dayName) return <Navigate to="/" />;

    // Find the day (handle 'Day 1' -> 'day1' logic from URL)
    const dayData = currentPlan.find(d => d.day.replace(" ", "").toLowerCase() === dayName.toLowerCase());

    if (!dayData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Rest Day / Not Found</h2>
                    <p className="mt-2 text-gray-600">This day is not in your current schedule.</p>
                    <Button as={Link} to="/" className="mt-4">Back to Home</Button>
                </div>
            </div>
        );
    }

    return (
        <DayDetailCard d={dayData} idx={dayData.day} />
    );
}
