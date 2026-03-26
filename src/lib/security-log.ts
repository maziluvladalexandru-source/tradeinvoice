export function logSecurityEvent(event: string, details: Record<string, unknown>) {
  console.log(JSON.stringify({
    type: 'SECURITY',
    event,
    timestamp: new Date().toISOString(),
    ...details
  }));
}
