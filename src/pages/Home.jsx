import React from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
  return (
    <div>
        <Button onClick = {()=>navigate('/browse')} text={'Browse'} className='text-black bg-white rounded'/>
    </div>
  )
}

export default Home