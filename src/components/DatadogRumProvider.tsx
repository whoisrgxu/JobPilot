"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";

export default function DatadogRumProvider() {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_DD_APP_ID
    ) {
      datadogRum.init({
        applicationId: process.env.NEXT_PUBLIC_DD_APP_ID,
        clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN,
        // see https://docs.datadoghq.com/getting_started/site/
        site: 'us5.datadoghq.com',
        service: process.env.NEXT_PUBLIC_DD_SERVICE || "jobpilot-ui",
        env: process.env.NEXT_PUBLIC_DD_ENV || process.env.NODE_ENV,
        version: "1.0.0",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackBfcacheViews: true,
        defaultPrivacyLevel: 'mask-user-input',
      });
    }
  }, []);

  return null; // This component only initializes RUM
}
