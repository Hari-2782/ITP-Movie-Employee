import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../API_URL/api_url';
import { NavBar1 } from "../Navigation Bar/eheader";
import { MDBContainer, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { v4 as uuidv4 } from 'uuid';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Extracting the date part
};

const reducer = (state, action) => {
  switch(action.type) {
    case "APPLY_LEAVE":
      return { ...state, ...action.payload };
    case "MODEL_TITLE_ADD_LEAVE":
      return { ...state, ...action.payload };
    case "EDIT_LEAVE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initialState = {
  modeltitle: "",
  LeaveId: 0,
  leaveType: "",
  startDate: "",
  endDate: "",
  status: "",
  adminComment: "",
  PhotoFileName: "",
  photoPath: API_URL.leavephotospath
};

export const EmployeeHomePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getLeaves();
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'green';
      case 'Rejected':
        return 'red';
      case 'Pending':
        return 'orange';
      default:
        return 'inherit';
    }
  };
  
  const getLeaves = async () => {
    const email = localStorage.getItem('email');
    try {
      const res = await axios.get(API_URL.LEAVE, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'user-email': email
        }
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves: ", err);
    }
  };

  const applyLeave = () => {
    dispatch({ type: "MODEL_TITLE_ADD_LEAVE", payload: { modeltitle: "apply leave", ...initialState } });
  };

  const editLeave = (leave) => {
    dispatch({ type: "EDIT_LEAVE", payload: { modeltitle: "edit leave", ...leave } });
  };

  const createLeave = async () => {
    const email = localStorage.getItem('email');
    const leaveId = uuidv4();
    const formData = new FormData();
    formData.append('LeaveId', leaveId);
    formData.append('email', email);
    Object.entries(state).forEach(([key, value]) => formData.append(key, value));

    try {
      await axios.post(API_URL.LEAVE, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      alert("Leave application successful!");
      window.location.reload();
    } catch (err) {
      console.error("Error creating leave: ", err);
      if (err.response) {
        alert(`Error while creating leave: ${err.response.data.message}`);
      } else if (err.request) {
        alert("Error sending request. Please try again later.");
      } else {
        alert("Unknown error. Please try again later.");
      }
    }
  };

  const imageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await axios.post(API_URL.LEAVEPHOTO, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: "APPLY_LEAVE", payload: { PhotoFileName: res.data.fileName } });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else {
        alert("Error while uploading image.");
      }
    }
  };

  const handleUpdate = async (id) => {
    const updatedLeave = leaves.find(leave => leave.LeaveId === id);
    if (!updatedLeave) return;
    try {
      await axios.put(`${API_URL.LEAVE}${updatedLeave._id}`, { ...state }, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      alert("Leave updated successfully!");
      window.location.reload();
    } catch (err) {
      alert(`Error while Updating the LEAVE! ,please try again ${err.response.data.message}`)
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Are you sure you want to delete Employee?")) return;
    try {
      await axios.delete(`${API_URL.LEAVE}${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      alert("You are Successfully Delete Employee !");
      window.location.reload();
    } catch (err) {
      alert(`Error While Deleting Employee,try again! ${err.response.data.message}`)
    }
  };

  return (
    <MDBContainer>
      <NavBar1 />
      <button
        type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={applyLeave}
      >
        Apply Leave
      </button>
      <MDBTable hover striped bordered align='middle'>
        <MDBTableHead dark>
          <tr>
            <th>Leave ID</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Admin Comment</th>
            <th>Medical</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {leaves.map((leave) => (
            <tr key={leave.LeaveId}>
              <td data-title="Leave ID">{leave.LeaveId}</td>
              <td data-title="Leave Type">{leave.leaveType}</td>
              <td data-title="Start Date">{formatDate(leave.startDate)}</td>
              <td data-title="End Date">{formatDate(leave.endDate)}</td>
              <td data-title="Status" style={{ backgroundColor: getStatusColor(leave.status) }}>{leave.status}</td>
              <td data-title="Admin Comment">{leave.adminComment}</td>
              <td data-title="Profile photo"><img className="rounded-circle profileImage" src={`${API_URL.leavephotospath}${leave.PhotoFileName}`} alt="no image" /></td>
              <td data-title="Action">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => editLeave(leave)}
                  className="btn btn-sm shadow-lg rounded-pill text-decoration-none"
                >
                  <span>
                    <i className="fa-solid fa-user-pen"></i>
                  </span>
                </button>
                <button
                  className="btn btn-sm shadow-lg  rounded-pill ms-2"
                  onClick={() => deleteLeave(leave._id)}
                >
                  <span>
                    <i
                      className="fa-sharp fa-solid fa-trash"
                      style={{ fontSize: "12px" }}
                    ></i>
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h4 className="modal-title">{state.modeltitle}</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Leave form */}
              <div className="input-group mb-3">
                <span className="input-group-text">Leave Type:</span>
                <select
                  className="form-select"
                  value={state.leaveType}
                  onChange={(e) =>
                    dispatch({
                      type: "APPLY_LEAVE",
                      payload: {
                        ...state,
                        leaveType: e.target.value,
                      },
                    })
                  }
                >
                  <option value="sick">Sick</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Start Date:</span>
                <input
                  type="date"
                  className="form-control"
                  value={state.startDate}
                  onChange={(e) =>
                    dispatch({
                      type: "APPLY_LEAVE",
                      payload: {
                        ...state,
                        startDate: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">End Date:</span>
                <input
                  type="date"
                  className="form-control"
                  value={state.endDate}
                  onChange={(e) =>
                    dispatch({
                      type: "APPLY_LEAVE",
                      payload: {
                        ...state,
                        endDate: e.target.value,
                      },
                    })
                  }
                />
                <div className="p-2 w-50 bd-highlight">
                  <img
                    width="250px"
                    height="250px"
                    alt=""
                    src={`${state.leavephotospath}${state.PhotoFileName}`}
                  />
                  <input className="m-2" type="file" onChange={imageUpload} />
                </div>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Status:</span>
                <input
                  type="text"
                  className="form-control"
                  value="Pending"
                  readOnly
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Admin Comment:</span>
                <input
                  type="text"
                  className="form-control"
                  value="Pending"
                  readOnly
                />
              </div>
              {state.LeaveId !== 0 ? (
                <button
                  type="button"
                  className=" btn btn-primary float-start"
                  onClick={() => handleUpdate(state.LeaveId)}
                >
                  {" "}
                  Update
                </button>
              ) : null}
              {/* button to creat  */}
              {state.LeaveId === 0 ? (
                <button
                  type="button"
                  className=" btn btn-primary float-start"
                  onClick={createLeave}
                >
                  {" "}
                  Create
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MDBContainer>
  );
};
