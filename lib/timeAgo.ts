const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " y";
    }

    interval = seconds / 604800;
    if (interval > 1) {
        return Math.floor(interval) + " w";
    }

    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " d";
    }

    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " h";
    }

    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " m";
    }

    return Math.floor(seconds) + " s";
};

export default timeAgo;
