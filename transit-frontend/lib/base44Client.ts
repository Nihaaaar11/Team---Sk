export const APP_ID = '69c58208ae3ea3ae07e2149a';
export const API_KEY = '2491fc92a97c4173a264c056262c38ba';

/**
 * Fetches real-time transport event entities for the passenger dashboard
 */
export async function fetchTransportEvents() {
  const baseUrl = process.env.NEXT_PUBLIC_AI_AGENT_URL || '';
  const response = await fetch(`${baseUrl}/api/apps/${APP_ID}/entities/TransportEvent`, {
      headers: {
          'api_key': API_KEY,
          'Content-Type': 'application/json'
      }
  });
  
  if (!response.ok) throw new Error('Failed to fetch AI events');
  return await response.json();
}

/**
 * Pushes ticketing flow to the AI operator model endpoint
 */
export async function createTicketingRecord(data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_AI_AGENT_URL || '';
  const response = await fetch(`${baseUrl}/api/apps/${APP_ID}/entities/TicketingRecord`, {
      method: 'POST',
      headers: {
          'api_key': API_KEY,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Failed to create ticketing record in Base44 Hub');
  return await response.json();
}
