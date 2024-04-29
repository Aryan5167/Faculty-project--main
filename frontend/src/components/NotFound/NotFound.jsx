import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
<section className='page notfound' style={{ height: 'calc(100vh - 80px)' }}>
          <div className="content">
            <img src="/notfound.png" alt="notfound" />
            <Link to={'/'}>RETURN TO HOME PAGE</Link>
          </div>
        </section>
    </>
  )
}

export default NotFound
