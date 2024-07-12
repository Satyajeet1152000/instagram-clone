import React from "react";

const getUserLocation = async (ip: string) => {
    const data = await fetch(`https://ipapi.co/${ip}/json`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            return `${data.city}, ${data.country}`;
        });

    return data;
};

export default getUserLocation;
