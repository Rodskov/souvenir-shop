import {useState} from 'react'
import {BsFillTrashFill} from "react-icons/bs"
import "./Cart.scss"
import { cartData } from './cart-data'

const Cart = () => {
    const [cartItem, setCartItem] = useState(cartData);

    const removeItem = (id) => {
      const newCartList = cartItem.filter((item) => item.id !== id);
      setCartItem(newCartList);
      // console.log(id);
    };
    
  return (
    <section className='cart-sec--flex-center --100vh --bg-primary'> 
      <div className='container'>
        <h2 className='--text-light'>My Cart</h2>
        {cartItem.map((item) =>{
          const {id, name, price, img} = item;
          return (
            <div className='cart --card --flex-between --p' key={id}> 
            <img src={img} alt='Item'></img>
            <div className='description'>
              <h4 className='--text-light'>Name: {name}</h4>
              <p className='--text-light'>Price: {price}</p>
            </div>
            <BsFillTrashFill
            size={18}
            className='icon'
            onClick={() => removeItem(id)}/>
            </div>
          )
        })}
        

        <button
        className='--btn --btn-danger'
        onClick={() => setCartItem([])}
        >
          Clear Items
          </button>
      </div>
    </section>
  )
}

export default Cart