import { Link, UNSAFE_RouteContext, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";



export const initialState = {

  order: "",
  date: "",
  subject: "",

  payment_mode: "",
  quantity: "",
  price: "",
  discount: "",
  discription: "",
  tax: "",
  reference: "",
  received: "",

};


const Add_PurchasesReturn = ({ToggleAlert}) => {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;



  const [tax, setTax] = useState([]); //tax value
  const [showformdata, setshowformdata] = useState(initialState) //form data passed


  const [price, setprice] = useState([]);  //set price
  const [discount, setdiscount] = useState([]); //set discount
  const [discountfinal, setdiscountfinal] = useState([]); //set final discount
  const [net, setnet] = useState([]); //set net
  const [amount, setamount] = useState([]); //set amount  
  const [quantity, setquantity] = useState([]); //set amount
  const [price_final, setprice_final] = useState([]); //set amount


  const [refund_chalan, setrefund_chalan] = useState([]); //set amount  



  const [receive, setreceive] = useState([]); // for recive amount 


  const [order1, setorder] = useState([]); //set amount  

  // const [order_final, setorder_final] = useState([]);



  function percentage(num, per) {

    var q = (num / 100) * per;
    var e = num - q;
    setdiscount(e);
    return e;
  }

  function getdate(){
    const date = new Date()
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const full_date = [year, month, day].join('-');
    return full_date;
  }

  function taxcalculation(num, per) { 
    var q = (num / 100) * per;
    var e = num + q;
    // setdiscount(e);
    return e;
  }


  useEffect(() => {
    // console.log(user_id);

    axios.get(`${process.env.REACT_APP_API_URL}/tax?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setTax(response.data.filter((p) => p.user_id == user._id));
      if(response.data.length === 0){
        ToggleAlert("Warning","please add Tax first")
      }
    }).catch((e) => {
      console.log(0);
    });

    axios.get(`${process.env.REACT_APP_API_URL}/purchase/order`, {
      'user_id': user_id
    }).then((response) => {
      setorder(response.data.filter((p) => p.user_id == user_id));
      if(response.data.length === 0){
        setTimeout(() => {
          ToggleAlert("Warning","please add Order first")
        }, 5000);
      }
    }).catch((e) => {
      setorder(1000);
    });


    axios.get(`${process.env.REACT_APP_API_URL}/purchase/return`, {
      'user_id': user_id
    }).then((response) => {
      // setrefund_chalan(response.data.filter((p) => p.user_id == user_id));
      GenerateOrdernumber(response.data.filter((p) => p.user_id == user_id));
    }).catch((e) => {
      setrefund_chalan(1000);
    });


  }, []);

  const GenerateOrdernumber = (e) => {

    e.length !== 0 ? e.map((userx, index) => (
      e.length - 1 == index ? setrefund_chalan(userx.refund + 1) : ""
    )) : setrefund_chalan(1000);


  };



  const handleChange = (e) => {

    var ee = document.getElementById("tax_select");
    var optionx = ee.options[ee.selectedIndex];
    var tax_value = optionx.getAttribute('data-test-id');

    var price_value = document.getElementById('price').value;
    var discount_value = document.getElementById('discount').value;
    var quantity_value = document.getElementById('quantity').value;
    var received_value = document.getElementById('received').value;

    var price_value_final = price_value * quantity_value;

    if (e.target.name == "tax") {

      if (!price_value && !discount_value && !quantity_value) {
        console.log("null");
      }
      else {

        var setdiscount1 = percentage(price_value_final, discount_value);  //this variable is create for due to state not update without handle
        setdiscountfinal(price_value_final - setdiscount1);
        setamount(percentage(price_value_final, discount_value));
        setnet(taxcalculation(setdiscount1, tax_value));
      }
    }

   
    setshowformdata({ ...showformdata, [e.target.name]: e.target.value, user_id: user._id, currency: "Pakistani Rupees", net: net, amount: amount, refund: refund_chalan });
  }


  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log(showformdata);

    try {
      const url = `${process.env.REACT_APP_API_URL}/purchase/return/add`;
      const response = await axios.post(url, showformdata);
      setshowformdata(initialState);
      navigate('/purchases/return');
      setTimeout(() => {
        ToggleAlert("Success", "Order-Return Added Successfully");
      }, 1000);
    }
    catch (error) {
      console.log(error)
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        console.log(error.response.data.message)
      }
    }
  }



  return (
    <>
      <div className="main-card">
        <form onSubmit={handleSubmit}>
          <div className="px-md-4 pt-md-4 px-1 pt-1">
            <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
              <h4 className="mb-md-0 text-center text-md-left">
                Purchase Returns [PR-{refund_chalan}]
              </h4>
              <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
            </div>

            <div className="form-row">
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom026" className="h6">
                  Order ID
                </label>
                <div className="input-group">
                  <select
                    className="custom-select mb-3 mr-3"
                    id="order"
                    name="order"
                    onChange={handleChange}
                    style={styles.uiInput}
                    required
                  >
                    {/* <option selected>DD/MM/YYYY</option> */}

                    {order1.map((userx, index) => (
                      <option value={userx._id} key={index}>
                        PO-{userx.order}
                      </option>
                    ))}
                    <option selected value="" >
                      Please Select a Order ID
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom026" className="h6">
                  Return ID
                </label>
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text" id="inputGroupAppend">
                      PR
                    </span>
                  </div>
                  <input
                    type="Number"
                    name="refund_chalan"
                    style={styles.uiInputGroupRight}
                    // onChange={handleChange}
                    className="form-control"
                    value={refund_chalan}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom027" className="h6">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  style={styles.uiInput}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-3 mb-6">
                <label htmlFor="validationCustom022" className="h6">
                  Currency
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom022"
                  name="currency"
                  placeholder="Pakistani Rupees(Rs)"
                  style={styles.uiInput}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-6">
                <label htmlFor="validationCustom023" className="h6">
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustomUsername"
                  name="subject"
                  onChange={handleChange}
                  placeholder="Enter your Subject"
                  style={styles.uiInput}
                  aria-describedby="inputGroupAppend"
                  required
                />
              </div>
            </div>
          </div>
          <div className="table-responsive px-md-4 pt-md-5 px-1 pt-1">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {/* <th scope="col">Reference</th> */}
                  <th scope="col">Payment Mode</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Disc.</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select
                      className="custom-select mb-3 mr-3"
                      id="payment_mode"
                      name="payment_mode"
                      onChange={handleChange}
                      style={styles.uiInput}
                      required
                    >
                      <option selected>Enter Your Payment Mode</option>
                      <option value="cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Draft">Draft</option>
                      <option value="Direct Deposit">Direct Deposit</option>
                      <option value="Credit Card">Credit Card</option>
                    </select>
                  </td>
                  {/* <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="Search consignments" required/></td> */}
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      name="quantity"
                      id="quantity"
                      onChange={handleChange}
                      placeholder="Enter your Quantity"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      name="price"
                      id="price"
                      onChange={handleChange}
                      placeholder="Enter your Price"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </td>

                  {/* <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="0" required /></td> */}
                  <td>
                    <div className="input-group">
                      <input
                        type="Number"
                        className="form-control"
                        name="discount"
                        id="discount"
                        onChange={handleChange}
                        placeholder="Enter your Discount"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInputGroupLeft}
                        required
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          %
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={amount}
                      placeholder="Enter your Amount"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      readOnly
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="row mx-0 px-md-4 pt-md-4 px-1 pt-1">
            <div className="col-md-5 col-12 pl-0">
              <textarea
                className="form-control"
                id="form-control mt-2 w-100 rounded-3"
                rows="5"
                cols="40"
                placeholder="Additional Notes"
                style={styles.uiInput}
                name="discription"
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="col-md-7 col-12 pr-0">
              <div className="form-group row">
                <label
                  htmlFor="inputPassword3"
                  className="col-sm-2 col-form-label font-weight-bold text-muted"
                >
                  Tax Add Amount
                </label>
                <div className="col-sm-10 d-flex flex-row justify-content-around">
                  <div className="input-group">
                    <input
                      type="Number"
                      className="form-control"
                      id="discountfinal"
                      name="discountfinal"
                      value={discountfinal}
                      placeholder="Enter your Discount"
                      aria-describedby="inputGroupAppend"
                      readOnly
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="inputPassword3"
                  className="col-sm-2 col-form-label font-weight-bold text-muted"
                >
                  Tax
                </label>
                <div className="col-sm-10">
                  <select
                    className="custom-select mb-3 mr-3"
                    id="tax_select"
                    name="tax"
                    onChange={handleChange}
                    style={styles.uiInput}
                    // onChange={(event) => event.target.value == "add" ? setmodal(true) : setmodal(false)}
                    required
                  >
                    {/* <option selected>DD/MM/YYYY</option> */}
                    {tax.map((userx, index) => (
                      <option
                        data-test-id={userx.value}
                        dataid="2342"
                        value={userx._id}
                        mydata={userx.value}
                      >
                        {userx.value}%
                        {/* <button onClick={()=>console.log(userx.value)}>{userx.value}%</button> */}
                      </option>
                    ))}

                    <option selected value="" >
                      Please Select a Tax
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="inputPassword3"
                  className="col-sm-2 col-form-label font-weight-bold text-muted"
                >
                  Net(Rs)
                </label>
                <div className="col-sm-10">
                  <input
                    type="Number"
                    className="form-control"
                    id="net"
                    name="net"
                    value={net}
                    placeholder=""
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
                    readOnly
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-2 mb-3"></div>
                <div className="col-md-5 mb-3">
                  <label htmlFor="validationCustom01" className="h6">
                    Reference
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustomUsername"
                    name="reference"
                    onChange={handleChange}
                    placeholder="Enter your Reference"
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
                    required
                  />
                </div>
                <div className="col-md-5 mb-3">
                  <label htmlFor="validationCustom02" className="h6">
                    Received(Rs)
                  </label>
                  <input
                    type="Number"
                    className="form-control"
                    id="received"
                    name="received"
                    onChange={handleChange}
                    placeholder="Enter your Amount Received"
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
                    required
                  />
                </div>
              </div>

              <div className="text-md-right text-center mt-2 ">
                <button
                  type="submit"
                  class="btn btn-success mb-2 px-md-4 p-1 mr-2"
                  style={styles.btnRadius}
                >
                  Save & Approved
                </button>
                <button
                  type="button"
                  class="btn px-md-5 p-1 btn-primary mb-2 ml-2"
                  style={styles.btnRadius}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Add_PurchasesReturn;











