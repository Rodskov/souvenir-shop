import React from 'react'
import Slider from '../../components/slider/Slider'
import AdminOnlyRoute from '../../components/adminOnlyRoute/AdminOnlyRoute'
import Product from '../../components/product/Product'

const Home = () => {
  return (
    <div>
      {/* <Slider/> */}
      <Product/>
    </div>
  )
}

export default Home