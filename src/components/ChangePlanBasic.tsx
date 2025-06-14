"use client"
import React, { useState } from 'react';

type PlanType = 'Pro' | 'Free';

interface ChangePlanBasicProps {
    userId: string;
}

const ChangePlanBasic: React.FC<ChangePlanBasicProps> = ({ userId }) => {
    const [plan, setPlan] = useState<PlanType>('Free');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChangePlan = async (newPlan: PlanType) => {
        setLoading(true);
        setMessage(null);
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/users/${userId}/change-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: newPlan }),
            });

            if (!response.ok) {
                throw new Error('Failed to change plan');
            }

            setPlan(newPlan);
            setMessage(`Plan changed to ${newPlan}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Change Your Plan</h2>
            <p>Current Plan: <strong>{plan}</strong></p>
            <button
                onClick={() => handleChangePlan('Pro')}
                disabled={loading || plan === 'Pro'}
            >
                Switch to Pro
            </button>
            <button
                onClick={() => handleChangePlan('Free')}
                disabled={loading || plan === 'Free'}
            >
                Switch to Free
            </button>
            {loading && <p>Updating...</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default ChangePlanBasic;