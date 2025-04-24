import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { dbActions } from "../../store/dbSlice";
import { useSelector } from "react-redux";
import Payment from '../../contracts/Payment.sol';
import { ethers } from "ethers";
import { Logger } from "ethers/lib/utils";

function ProcessorRequestCard(props) {
  const { crop, processor, rquantity, qprice, id, crop_id } = props;

  const dispatch = useDispatch();
  const paymentAddress = useSelector((state) => state.db.address);
  const acc = useSelector((state) => state.db.userAcc);
  const rejectHandler = async (e) => {
    await axios
      .delete(`http://localhost:3001/processorBidDelete/${id}`)
      .then((resp) => {
        alert(resp.data);
      });
    dispatch(dbActions.reload());
  };

  const insureHandler = async (e) => {
    
    if (typeof window.ethereum !== "undefined" && acc != "") {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      
      const contract = new ethers.Contract(paymentAddress, Payment.abi, signer);
   
      const id = crop_id;
      console.log(id,"processor", contract,"sign" ,signer);
      
      const data = await contract.updateStatus(id);
      console.log(data);

      await axios
        .put(`http://localhost:3001/insure/${id}/${crop_id}`, {
          name: crop,
          quantity: rquantity,
        })
        .then((resp) => {
          console.log(resp.data);
          alert(resp.data);
        });
      dispatch(dbActions.reload());
    }else{
     
      
    }
  };
  return (
    <div className="col-5 mb-xl-5 mb-4">
      <div className="card">
        <div className="card-header p-3 pt-2">
          <div className="text-end pt-1">
            <p className="display-7 mb-0 text-capitalize font-weight-bolder">
              Crop : {crop}   
            </p>
          </div>
        </div>
        {/* <hr className="dark horizontal my-0"></hr> */}
        <div className="row">
          <div className="card-footer p-2">
            <p className="mb-0">
              <span className="text-success text-sm font-weight-bolder">
                Name :
              </span>
              &nbsp;&nbsp;{processor}&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
          </div>
          <div className="card-footer p-2">
            <p className="mb-0">
              <span className="text-success text-sm font-weight-bolder">
                Requested Quantity :
              </span>
              &nbsp;&nbsp;{rquantity}&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
          </div>
          <div className="card-footer p-2">
            <p className="mb-0">
              <span className="text-success text-sm font-weight-bolder">
                Quoted Price :
              </span>
              &nbsp;&nbsp;₹{qprice}&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
          </div>
          <div className="row">
            <button
              type="submit"
              name="request"
              class="btn bg-gradient-success btn-lg w-40 ml-3 mr-2 mt-4 text-sm"
              onClick={insureHandler}
              value={id}
            >
              Insure
            </button>
            <button
              type="click"
              name="request"
              class="btn bg-gradient-danger btn-lg w-40 ml-1 mt-4"
              onClick={rejectHandler}
              value={id}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessorRequestCard;



// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// function InsuranceProcessor({ crop, processor, quantity, price, id, cropId }) {
//     const [loading, setLoading] = useState(false);
//     const [step, setStep] = useState(1);
//     const [txHash, setTxHash] = useState('');
//     const userAddress = useSelector(state => state.db.userAcc);
//     const contractAddress = useSelector(state => state.db.address);

//     const handleInsure = async () => {
//         if (!userAddress) {
//             alert('Please connect your wallet');
//             return;
//         }

//         setLoading(true);
        
//         try {
//             // 1. Create initial insurance record
//             const premium = calculatePremium(quantity, price);
//             const coverage = calculateCoverage(quantity, price);
            
//             const { data } = await axios.post('/api/insure', {
//                 cropId,
//                 cropName: crop,
//                 quantity,
//                 premiumAmount: premium,
//                 coverageAmount: coverage,
//                 userAddress
//             });
            
//             if (!data.success) throw new Error(data.message);
            
//             setStep(2); // Move to blockchain transaction step
            
//             // 2. Execute blockchain transaction
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();
//             const contract = new ethers.Contract(
//                 contractAddress, 
//                 CropInsurance.abi, 
//                 signer
//             );
            
//             const tx = await contract.createInsurancePolicy(
//                 cropId,
//                 crop,
//                 quantity,
//                 ethers.utils.parseEther(premium.toString()),
//                 ethers.utils.parseEther(coverage.toString()),
//                 { value: ethers.utils.parseEther(premium.toString()) }
//             );
            
//             setTxHash(tx.hash);
//             setStep(3); // Move to confirmation step
            
//             // 3. Wait for transaction confirmation
//             await tx.wait();
            
//             // 4. Finalize insurance
//             await axios.put(`/api/insure/${cropId}/finalize`, { txHash: tx.hash });
            
//             alert('Insurance process completed successfully!');
//             setStep(1);
//         } catch (error) {
//             console.error('Insurance failed:', error);
//             alert(`Insurance failed: ${error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculatePremium = (qty, price) => {
//         // 5% of crop value as premium
//         return (qty * price) * 0.05;
//     };

//     const calculateCoverage = (qty, price) => {
//         // 80% of crop value as coverage
//         return (qty * price) * 0.8;
//     };

//     return (
//         <div className="insurance-card">
//             {/* Step 1: Initial information */}
//             {step === 1 && (
//                 <div className="step-1">
//                     <h3>Insure {crop}</h3>
//                     <p>Processor: {processor}</p>
//                     <p>Quantity: {quantity} kg</p>
//                     <p>Price: ₹{price} per kg</p>
//                     <button 
//                         onClick={handleInsure}
//                         disabled={loading}
//                     >
//                         {loading ? 'Processing...' : 'Start Insurance'}
//                     </button>
//                 </div>
//             )}
            
//             {/* Step 2: Blockchain transaction */}
//             {step === 2 && (
//                 <div className="step-2">
//                     <h3>Confirm Transaction</h3>
//                     <p>Please confirm the transaction in your wallet</p>
//                     <div className="loading-spinner"></div>
//                 </div>
//             )}
            
//             {/* Step 3: Confirmation */}
//             {step === 3 && (
//                 <div className="step-3">
//                     <h3>Transaction Submitted</h3>
//                     <p>Transaction Hash: {txHash.substring(0, 12)}...{txHash.substring(txHash.length - 4)}</p>
//                     <p>Waiting for confirmation...</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default InsuranceProcessor;