export function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const options = {
        weekday: 'long', // Full name of the day (e.g., "Saturday")
        year: 'numeric', // Full numeric year (e.g., "2024")
        month: 'long', // Full name of the month (e.g., "July")
        day: 'numeric', // Numeric day of the month (e.g., "27")
        hour: 'numeric', // Numeric hour (e.g., "12")
        minute: 'numeric' // Numeric minute (e.g., "28")
    };
    return date.toLocaleString('en-US', options as any);
}

export function formatUnixTimestamp(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert to milliseconds
    const options = {
        weekday: 'long', // Full name of the day (e.g., "Monday")
        year: 'numeric', // Full numeric year (e.g., "2024")
        month: 'long', // Full name of the month (e.g., "August")
        day: 'numeric', // Numeric day of the month (e.g., "11")
        hour: 'numeric', // Numeric hour (e.g., "03" or "15")
        minute: 'numeric' // Numeric minute (e.g., "59")
    };
    return date.toLocaleString('en-US', options as any);
}
