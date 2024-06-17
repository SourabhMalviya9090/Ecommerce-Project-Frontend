import React from 'react'
import "./Popular.css"
import data_product from "../Assets/data.js"
import Item from "../Item/Item.jsx"

const Popular = () => {
    const sampleData=[];
    let index =0;
    for(let sample of data_product){
        sampleData.push(<Item key ={index} id={sample.id} name={sample.name} image={sample.image} old_price={sample.old_price} new_price ={sample.new_price}/>)
    }
  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className="popular-item">
            {sampleData}
        </div>
      
    </div>
  )
}

export default Popular
