import axios from "axios";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API_URL/api_url";
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';

const reducer = (state, action) => {
  switch (action.type) {
    case "INPUT":
      return {
        ...state,
        email: action.payload.email,
        password: action.payload.password
      };
    case "LOGIN":
      return {
        ...state,
        modalTitle: "Login",
        userID: ""
      };
    default:
      return state;
  }
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    modalTitle: "",
    email: "",
    password: "",
    userID: 0,
    token: ""
  });

  const loginClick = () => {
    dispatch({
      type: "LOGIN",
      payload: {
        ...state
      }
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(API_URL.LOGIN, {
        email: state.email,
        password: state.password
      });
  
      // Store the token in local storage
      localStorage.setItem('token', result.data.token);
  
      //// Check if the token is saved correctly
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        // Token is saved correctly, display success alert
        alert('You are logged in successfully!');
      } else {
        // Token is not saved correctly
        alert('Error: Token not saved correctly');
      }
  
      // Include the token in request headers for subsequent requests
      axios.defaults.headers.common['x-auth-token'] = result.data.token;
      
      // Redirect the user to the appropriate page
      if (state.email.toLowerCase().startsWith('admin')) {
        navigate('/employee');
      } else {
        navigate('/employeehome');
      }
    } catch (err) {
      alert("Error while logging in. Please provide correct email and password.");
      console.error(err); // Log the error for debugging
    }
  };
  

  return (
    <>
      <MDBContainer fluid className="p-3 my-5 Homepage">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
          </MDBCol>
          <MDBCol col='4' md='6'>
            <div className="homepage">
              <div className="modal" tabIndex="-1" id="exampleModal">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header bg-info">
                      <h3 className="modal-title">{state.modalTitle}</h3>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="input-group mb-3">
                        <span className="input-group-text">Email</span>
                        <input
                          type="email"
                          className="form-control"
                          value={state.email}
                          onChange={(e) => dispatch({
                            type: 'INPUT',
                            payload: {
                              ...state,
                              email: e.target.value
                            }
                          })}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Password</span>
                        <input
                          type="password"
                          className="form-control"
                          value={state.password}
                          onChange={(e) => dispatch({
                            type: 'INPUT',
                            payload: {
                              ...state,
                              password: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleLogin}
                      >
                        {state.modalTitle}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="viewformargin">
                <MDBRow>
                  <h3>WELCOME TO BALA CINEMA EMPLOYEE SECTION</h3>
                </MDBRow>
                <MDBRow>
                  <MDBCol><button
                    type="button"
                    className="btn btn-primary m-2 float-center"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => loginClick()}
                  >
                    Sign in
                  </button></MDBCol>
                </MDBRow>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};
