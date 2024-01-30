import {  useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import logo from "../../assets/logo.jpg"
import styles from "../../styles/styles"

function admin_Login() {

    const [loader,setLoader] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${process.env.REACT_APP_API_URL}/user/admin/login`;
            const res = await axios.post(url, data);
            setLoader(false);
            localStorage.setItem("token" , res.data.token)
            localStorage.setItem("admin", JSON.stringify(res.data.result));
            navigate("/dashboard");
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
                setLoader(false);
            }
        }
    };

    return (
      <div className="bg-image">
        <div className="wid-50 m-auto bg-white p-5 middle-y shadow rounded-3">
          <div className="text-center  pb-3">
            <img src={logo} alt="logo" className="mb-3" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={handleChange}
                name="email"
                placeholder="Email"
                style={styles.uiInput}
                required
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={handleChange}
                style={styles.uiInput}
                placeholder="Password"
                required
              />
            </div>
            {error && (
              <div>
                <p className="text-danger fw-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={styles.btnRadius}
              onClick={() => setLoader(true)}
            >
              {loader ? (
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
          {/* <div className="border-top mt-3 pt-3">
            <p className="h5 mb-0">
              Sign-in with
              <Link to="/" className="p-2">
                <i className="fa-brands fa-square-google-plus text-danger h4 mb-0"></i>
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    );
}

export default admin_Login;