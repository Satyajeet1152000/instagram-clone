import Header from '@/components/Header'


const HomePageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Header />
        {children}
    </div>
  )
}

export default HomePageLayout