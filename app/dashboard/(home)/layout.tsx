import Header from '@/components/Header'
import React from 'react'

const HomePageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Header />
        {children}
    </div>
  )
}

export default HomePageLayout