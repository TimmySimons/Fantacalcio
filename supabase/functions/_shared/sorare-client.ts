const SORARE_URL = 'https://api.sorare.com/graphql';

export async function gqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(SORARE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    });
    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors.map((e: { message: string }) => e.message).join('; '));
    }
    if (!json.data) {
        throw new Error('Sorare API returned no data');
    }

    return json.data;
}