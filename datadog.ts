import tracer from 'dd-trace';

if (process.env.DD_API_KEY) {
  tracer.init({
    service: 'jobpilot-ai', // give your service a name
    env: process.env.NODE_ENV,
    version: '1.0.0',
  });
}
