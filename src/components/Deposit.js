import { useState, useReducer } from 'react';
import formReducer from '../utils/FormReducer';
import React from 'react';
import axios from "axios";
import './style.css';

const baseUrl = "http://localhost:3003/";
const tokenPrices = [
    { value: "select", label: "Select Value" },
    { value: "ETH", label: "ETH" },
    { value: "DVF", label: "DVF" },
    { value: "USDT", label: "USDT" } 
]

function Deposit() {
    let dynamicPrice = 0;

    const [formData, setFormData] = useReducer(formReducer, {});
    const [formControls, setSubmitting] = useState(false);
    const [selectedToken, setSelected] = useState('');
    const [showHideForm, setDirty] = useState()

    const calculatePriceOnCoins = () => {
        const takenPrice = parseFloat(formData.amount)
        switch (selectedToken.selectedOption) {
            case "ETH":
                dynamicPrice = 3200 * takenPrice;
                break;
            case "DVF":
                dynamicPrice = 2.16 * takenPrice
                break;
            case "USDT":
                dynamicPrice = 1.16 * takenPrice;
                break;
            default:
                dynamicPrice = 0
                break;
        }
    }

    if (formData.amount) {
        calculatePriceOnCoins()
    }

    const handleChange = ({ target }) => {
        setSelected({
            selectedOption: target.value
        })
    }

    const showHideForms = (params) => {
        setDirty(params)
    }

    const handleSubmit = event => {
        event.preventDefault();
        setSubmitting(true);

        setTimeout(() => {
            setSubmitting(false);
        }, 3000)
    }


    const submitOrder = async (status) => {
        const authToken = localStorage.getItem("token");
        let config = {
            headers: {
                token: authToken
            }
        }
        switch (status) {
            case 'deposit':
                const depositData = {
                    amount: formData.amount,
                    token: selectedToken.selectedOption
                }
                await axios.post(baseUrl + 'deposit', depositData, config);
                break;
            default:
                const placeOrderData = {
                    token: selectedToken.selectedOption,
                    amount: formData.amount,
                    price: formData.orderPlaced,
                    side: status
                }
                await axios.post(baseUrl + 'place-order', placeOrderData, config);
                break;
        }
    }

    return (
        <div className='wrapper'>
            <div className="container-buttons">
                <button type="button" className="test btn-primary" onClick={() => { showHideForms('deposit') }}>Deposit</button>
                <button type="button" className="test btn-primary" onClick={() => { showHideForms('buy-sell') }}>Buy/Sell</button>
            </div>

            {showHideForm === 'deposit' &&
                <div className='form-wrapper'>
                    <form onSubmit={handleSubmit}>
                        <select className="form-select" aria-label="Default select example"
                            value={selectedToken.selectedOption}
                            onChange={handleChange} >
                            {tokenPrices.map(({ value, label }, index) => <option value={value} >{label}</option>)}
                        </select>
                        <div className="row">
                            <div className="col">
                                <input name="amount" class="form-control" placeholder="Amount in USD" onChange={setFormData}></input>
                            </div>
                            <div className="col">
                                <input name="coins" value={dynamicPrice} className="form-control" placeholder="Coins"></input>
                            </div>
                        </div>

                    </form>
                    <button type="button" class="test btn-primary" onClick={() => { submitOrder('deposit') }}>Submit Order</button>
                </div>
            }

            {showHideForm === 'buy-sell' && <div className='trading-wrapper'>
                <form onSubmit={handleSubmit}>
                    <select className="form-select" aria-label="Default select example"
                        value={selectedToken.selectedOption}
                        onChange={handleChange} >
                        {tokenPrices.map(({ value, label }, index) => <option value={value} >{label}</option>)}
                    </select>
                    <div className="row">
                        <div className="col">
                            <input name="amount" className="form-control" placeholder="Amount in USD" onChange={setFormData}></input>
                        </div>
                        <div className="col">
                            <input name="coins" value={dynamicPrice} className="form-control" placeholder="Coins"></input>
                        </div>
                    </div>
                    <div className="column">
                        <div className="trading-wrapper-order-field">
                            <input name="orderPlaced" className="form-control" placeholder="Place Order in Price of your choise" onChange={setFormData}></input>
                        </div>
                    </div>
                </form>
                <button type="button" className="test btn-success" onClick={() => { submitOrder('buy') }}>Buy</button>
                <button type="button" className="test btn-danger" onClick={() => { submitOrder('sell') }}>Sell</button>
                <button type="button" className="test btn-primary" onClick={() => { submitOrder('placeOrder') }}>Place Order</button>
            </div>
            }
        </div>

    );
}

export default Deposit;