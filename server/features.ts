import { initialize, isEnabled } from 'unleash-client';

const unleash = initialize({
  url: process.env.UNLEASH_URL || 'https://app.unleash-hosted.com/demo/api/',
  appName: process.env.UNLEASH_APP_NAME || 'aetherial-platform',
  instanceId: process.env.UNLEASH_INSTANCE_ID || 'aetherial-instance-1',
  customHeaders: {
    Authorization: process.env.UNLEASH_API_TOKEN || 'default:development.unleash-insecure-api-token',
  },
});

export function isFeatureEnabled(feature: string, context?: any) {
  return isEnabled(feature, context);
}

export default unleash;
