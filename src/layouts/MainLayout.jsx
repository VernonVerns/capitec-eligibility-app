import React from 'react'
import { Outlet } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'

const MainLayout = () => {
  return (
    <>
        <NavigationBar />
        <main className="main-container">
            <Outlet />
        </main>
    </>
  )
}

export default MainLayout