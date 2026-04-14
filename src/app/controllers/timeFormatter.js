const formatTimeSmart = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);

    const diffMs = now - created;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const isToday = created.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = created.toDateString() === yesterday.toDateString();

    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const timeStr = created.toLocaleTimeString([], optionsTime);

    if (isToday) {
        if (diffHours >= 1) {
            return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
        } else {
            const minutes = Math.max(1, diffMinutes);
            return `${minutes} min`;
    }
} else if (isYesterday) {
        return `Yesterday at ${timeStr}`;
    } else {
        const isOlderThanYear = now.getFullYear() - created.getFullYear() >= 1;
        const optionsDate = isOlderThanYear
            ? { day: 'numeric', month: 'long', year: 'numeric' }
            : { day: 'numeric', month: 'long' };
        const dateStr = created.toLocaleDateString([], optionsDate);
        return `${dateStr} at ${timeStr}`;
    }
};

export default formatTimeSmart