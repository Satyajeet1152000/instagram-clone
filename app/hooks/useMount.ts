"use client"

import React, { useEffect, useState } from 'react'

const useMount = () => {
    const [mount, setMount] = useState(false);

    useEffect(()=>{
        setMount(true)
    },[mount]);

    return mount;
}

export default useMount;