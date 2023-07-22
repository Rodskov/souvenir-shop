import React, { useState } from 'react';
import styles from "./CheckoutDetails.module.scss";
import Card from '../../components/card/Card';
import { CountryDropdown } from 'react-country-region-selector';


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

const CheckoutDetails = () => {
    const [shippingAddress, setShippingAddress] = useState({...initialAddressState});
    const [billingAddress, setBillingAddress] = useState({...initialAddressState});


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
    console.log(shippingAddress);
    console.log(billingAddress);
};

  return (
    <section>
        <div className={`container ${styles.checkout}`}>
            <h2>CheckoutDetails</h2>
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
                        <CountryDropdown
                            valueType='short'
                            className={styles.select}
                            value={shippingAddress.country}

                            onChange={(val) => handleShipping({
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

                    </Card>

                    {/* BILLING ADDRESS */}
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
                        <CountryDropdown
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
                        <button type='submit'
                        className='--btn --btn-primary'>
                            Proceed to Checkout
                        </button>
                    </Card>
                </div>
            </form>
        </div>
    </section>
  );
};

export default CheckoutDetails;