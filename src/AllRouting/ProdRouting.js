import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Groceries from '../productlist/Groceries'
import Mobile from '../productlist/Mobile'
import Electronics from '../productlist/Electronics'
import Furniture from '../productlist/Furniture'
import Beauty from '../productlist/Beauty'
import Fashion from '../productlist/Fashion'

function ProdRouting() {
  return (
    <Routes>
          <Route path="/groceries" element={<Groceries />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/beauty" element={<Beauty />} />
          <Route path="/fashion" element={<Fashion />} />
    </Routes>
  )
}

export default ProdRouting
