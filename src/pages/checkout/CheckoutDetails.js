import React, { useState } from 'react';
import styles from "./CheckoutDetails.module.scss";
import Card from '../../components/card/Card';
import { CountryDropdown } from 'react-country-region-selector';
import { useDispatch } from 'react-redux';
import { SAVE_BILLING_ADDRESS, SAVE_SHIPPING_ADDRESS } from '../../redux/slice/checkoutSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSummary from '../../components/checkoutSummary/CheckoutSummary';
import { toast } from 'react-toastify';

//const [provinces, setProvinces] = useState([]);

const initialAddressState = {
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
}

const province = [
    "-- Select Province --",
    "Abra",
    "Agusan del Norte",
    "Agusan del Sur",
    "Aklan",
    "Albay",
    "Antique",
    "Apayao",
    "Aurora",
  ]

  const provinceFee = [
    {
        "province": "-- Select Province --",
        "shipFee": 0
    },
    {
        "province": "Abra",
        "shipFee": 165
    },
    {
        "province": "Agusan del Norte",
        "shipFee": 195
    },
    {
        "province": "Agusan del Sur",
        "shipFee": 195
    },
    {
        "province": "Aklan",
        "shipFee": 180
    },
    {
        "province": "Albay",
        "shipFee": 165
    },
    {
        "province": "Antique",
        "shipFee": 180
    },
    {
        "province": "Apayao",
        "shipFee": 205
    },
    {
        "Dito nagstop": ""
    },
    {
        "province": "Aurora",
        "shipFee": 205
    },
    {
        "province": "Basilan",
        "shipFee": 205
    },
    {
        "province": "Bataan",
        "shipFee": 205
    },
    {
        "province": "Batanes",
        "shipFee": 205
    },
    {
        "province": "Batangas",
        "shipFee": 205
    },
    {
        "province": "Zamboanga Sibugay",
        "shipFee": 195
    }
]



const CheckoutDetails = () => {
    const [shippingAddress, setShippingAddress] = useState({...initialAddressState});
    const [billingAddress, setBillingAddress] = useState({...initialAddressState});
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [shipAmount, setShipAmount] = useState(0)
    var shippingFee = 0;

    function shipFeeValue(){
        if(shipAmount != 0) {
            return shipAmount
        }
        else{
            return 0;
        }
    }

function ProvinceChange(e){
    shippingFee = 0
    for(var i=0; i < provinceFee.length; i++){
        if(e.target.value === provinceFee[i].province){
            shippingFee = provinceFee[i].shipFee
            setShipAmount(province[i].shipFee)
            toast.success(shippingFee)
            toast.success("Shipping fee: "+provinceFee[i].shipFee)
        }
    }
    toast.success(e.target.value)
    toast.success(shippingFee)
    return shippingFee
}

const handleShipping = (e) => {
    const {name, value} = e.target
    setShippingAddress({
        ...shippingAddress,
        [name]: value,
    });
};

const handleBilling = (e) => {
    const {name, value} = e.target
    setBillingAddress({
        ...billingAddress,
        [name]: value,
    });
};

const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress))
    dispatch(SAVE_BILLING_ADDRESS(billingAddress))
    navigate("/checkout")
};

  return (
    <section>
        <div className={`container ${styles.checkout}`}>
            <h2>Checkout Details</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <Card cardClass={styles.card}>
                        <h3>Shipping Address</h3>
                        <label>Recipient Name</label>
                        <input type='text' 
                        placeholder='Recipient Name'
                        required
                        name='name'
                        value={shippingAddress.name}
                        onChange={(e) => handleShipping(e)}
                        />
                        <label>Address Line 1</label>
                        <input type='text' 
                        placeholder='Address Line 1'
                        required
                        name='line1'
                        value={shippingAddress.line1}
                        onChange={(e) => handleShipping(e)}
                        />
                        <label>Address Line 2</label>
                        <input type='text' 
                        placeholder='Address Line 2'
                        required
                        name='line2'
                        value={shippingAddress.line2}
                        onChange={(e) => handleShipping(e)}
                        />
                        <label>City</label>
                        <input type='text' 
                        placeholder='City'
                        required
                        name='city'
                        value={shippingAddress.city}
                        onChange={(e) => handleShipping(e)}
                        />
                        <label>State</label>
                        <input type='text' 
                        placeholder='State'
                        required
                        name='state'
                        value={shippingAddress.state}
                        onChange={(e) => handleShipping(e)}
                        />
                        <label>Postal code</label>
                        <input type='text' 
                        placeholder='Postal code'
                        required
                        name='postal_code'
                        value={shippingAddress.postal_code}
                        onChange={(e) => handleShipping(e)}
                        />
                        {/* COUNTRY INPUT */}
                        <label>Name of Province</label>
                        <select id="City" name="city" onChange={ProvinceChange} required>
                            {province.map((data, i) => {
                                return(
                                    <option value={data}>{data}</option>
                                )
                            })}
                        </select>
                        {/* <CountryDropdown
                            valueType='short'
                            className={styles.select}
                            value={shippingAddress.country}

                            onChange={(val) => handleShipping({
                                target: {
                                    name: "country",
                                    value: val,
                                }
                            })}
                        /> */}
                        <label>Phone</label>
                        <input type='text' 
                        placeholder='Phone'
                        required
                        name='phone'
                        value={shippingAddress.phone}
                        onChange={(e) => handleShipping(e)}
                        />
                        <button type='submit'
                        className='--btn --btn-primary'>
                            Proceed to Checkout
                        </button>   
                    </Card>

                    {/* BILLING ADDRESS
                    <Card cardClass={styles.card}>
                        <h3>Billing Address</h3>
                        <label>Recipient Name</label>
                        <input type='text' 
                        placeholder='Name'
                        required
                        name='name'
                        value={billingAddress.name}
                        onChange={(e) => handleBilling(e)}
                        />
                        <label>Address Line 1</label>
                        <input type='text' 
                        placeholder='Address Line 1'
                        required
                        name='line1'
                        value={billingAddress.line1}
                        onChange={(e) => handleBilling(e)}
                        />
                        <label>Address Line 2</label>
                        <input type='text' 
                        placeholder='Address Line 2'
                        required
                        name='line2'
                        value={billingAddress.line2}
                        onChange={(e) => handleBilling(e)}
                        />
                        <label>City</label>
                        <input type='text' 
                        placeholder='City'
                        required
                        name='city'
                        value={billingAddress.city}
                        onChange={(e) => handleBilling(e)}
                        />
                        <label>State</label>
                        <input type='text' 
                        placeholder='State'
                        Billing
                        name='state'
                        value={billingAddress.state}
                        onChange={(e) => handleBilling(e)}
                        />
                        <label>Postal code</label>
                        <input type='text' 
                        placeholder='Postal code'
                        required
                        name='postal_code'
                        value={billingAddress.postal_code}
                        onChange={(e) => handleBilling(e)}
                        />
                        {/* COUNTRY INPUT */}
                        {/* <CountryDropdown
                            valueType='short'
                            className={styles.select}
                            value={billingAddress.country}

                            onChange={(val) => handleBilling({
                                target: {
                                    name: "country",
                                    value: val,
                                }
                            })}
                        />
                        <label>Phone</label>
                        <input type='text' 
                        placeholder='Phone'
                        required
                        name='phone'
                        value={shippingAddress.phone}
                        onChange={(e) => handleShipping(e)}
                        />
                    </Card> */}
                </div>
                <div>
                    <Card cardClass={styles.card}>
                            <CheckoutSummary shippingFee={shipAmount}/>
                    </Card>
                </div>
            </form>
        </div>
    </section>
  );
};

export default CheckoutDetails;