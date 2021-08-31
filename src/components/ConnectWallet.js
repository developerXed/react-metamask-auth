import useWeb3 from "./useWeb3"
import { useState, useEffect, useReducer } from 'react';
import formReducer from '../utils/FormReducer';
import axios from "axios";

const baseUrl = "http://localhost:3003/auth";

function ConnectWallet() {

  const [address, getAddress] = useState('');
  const [formData, setFormData] = useReducer(formReducer, {});
  const [formControls, setSubmitting] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
    }, 3000)
  }
  const web3 = useWeb3();

  useEffect(() => {
    getUserAccount()
  });

  const getUserAccount = async () => {
    if (window.ethereum) {
      if (window.ethereum.selectedAddress === null) localStorage.removeItem('token')
      try {
        if (web3) {
          const accounts = await web3.eth.getAccounts();
          getAddress(accounts[0]);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  const authSign = async () => {
    try {
      if (web3) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const sign = await web3.eth.personal.sign(formData.phrase, formData.address);
        localStorage.setItem("token", sign);
        await axios.post(baseUrl, { authParams: sign });
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='wrapper'>
      <h1>Connect your Wallet with Metamask</h1>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <input name="address" className="form-control" placeholder="Address" onChange={setFormData}></input>
            </div>
            <div className="col">
              <input name="phrase" className="form-control" placeholder="Phrase" onChange={setFormData}></input>
            </div>
          </div>
        </form>
        <button type="button" className="test btn-primary" onClick={() => { authSign() }}>Connect</button>
      </div>
    </div>
  );
}

export default ConnectWallet;
