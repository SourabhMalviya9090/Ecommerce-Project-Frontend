import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Shop from './Shop'
import { useParams } from 'react-router-dom'
import BreadCrums from '../components/BreadCrums/BreadCrums'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../components/DescriptionBox/DescriptionBox'
import RelatedProduct from '../components/RelatedProducts/RelatedProduct'
const Product = () => {
  const {all_products}   = useContext(ShopContext);
  const {productId} = useParams();
  const foundProduct   = all_products.find((e)=> e.id === Number(productId));
 
  return (
    <div>
      <BreadCrums product={foundProduct}/>
      <ProductDisplay product={foundProduct}/>
      <DescriptionBox/>
      <RelatedProduct/>
    </div>
  )
}

export default Product
