import { useState, useEffect } from 'react';
import axios from "axios";
const baseUrl = "http://localhost:3003/";

function TradingView() {
    const [formControls, setSubmitting] = useState(false);
    const [getBalances, setBalance] = useState(false);
    const [getOrders, setOrders] = useState(false);
    const [showHideForm, setDirty] = useState()

    const handleSubmit = event => {
        event.preventDefault();
        setSubmitting(true);

        setTimeout(() => {
            setSubmitting(false);
        }, 3000)
    };

    useEffect(() => {
        getUserBalances()
        getUserOrders();
    }, []);

    const authToken = localStorage.getItem("token");
    let config = {
        headers: {
            token: authToken
        }
    }

    const getUserBalances = async () => {
        const result = await axios.get(baseUrl + "get-balances", config);
        setBalance(result.data.data);
    }

    const getUserOrders = async () => {
        const result = await axios.get(baseUrl + "get-order", config);
        setOrders(result.data.data);
    }

    const cancelOrder = async (params) => {
        await axios.post(baseUrl + "cancel-order", { orderId: params }, config);
    }

    const switchForms = (params) => {
        setDirty(params);
    }

    return (
        <div className='wrapper'>
            <h1>Trading View</h1>
            <div className="container-buttons">
                <button type="button" className="test btn-primary" onClick={() => { switchForms('balances') }}>Balances</button>
                <button type="button" className="test btn-primary" onClick={() => { switchForms('openOrders') }}>Open Orders</button>
            </div>

            {showHideForm === 'balances' && <div>
                <h2>Balance</h2>
                <div className="form-wrapper">
                    {getBalances && <ul className="list-group">
                        {getBalances.map((balances, index) => { return (<li key={index}>Token:{balances.token} Balance:${balances.amount}</li>) })}
                    </ul>
                    }
                </div>
            </div>
            }

            {showHideForm === 'openOrders' && <div>
                <h2>Open Orders</h2>
                <div className="form-wrapper">
                    {getOrders && <ul className="list-group">
                        {getOrders.map((balances, index) => {
                            return (<li key={index}>
                                Side:{balances.side} Token:{balances.token}  Amount:{balances.amount}  Price:{balances.price}
                                <button type="button" className="test btn-warning" onClick={() => { cancelOrder(balances.orderId) }}>Cancel Order</button> </li>)
                        })}
                    </ul>
                    }
                </div>
            </div>
            }
        </div>
    );
}

export default TradingView;
