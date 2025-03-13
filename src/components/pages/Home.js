import React from 'react'
import Body from '../body/body'
import { Helmet } from 'react-helmet'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Luxury Boutique | Premium Products</title>
        <meta name="description" content="Discover our exclusive collection of premium watches, clothes, shoes, perfumes, and accessories crafted for the discerning customer." />
      </Helmet>
      <Body />
    </>
  )
}

export default Home
