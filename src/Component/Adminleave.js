import axios from 'axios';
import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../API_URL/api_url';
import { NavBar } from "../Navigation Bar/header";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // Add leading zero if month or day is single digit
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
};

export const Adminleave = () => {
  useEffect(() => {
    getLeaves();
  }, []);

  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [modalClosedManually, setModalClosedManually] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getLeaves = () => {
    axios.get(API_URL.LEAVEAPPROVE)
      .then((res) => {
        setLeaves(res.data);
      })
      .catch((err) => {
        console.error("Error fetching leaves: ", err);
      });
  };

  const updateLeave = (id, status, comment) => {
    axios.put(`${API_URL.LEAVEAPPROVE}${id}`, {
      status: status,
      adminComment: comment
    })
      .then(
        (res) => {
          alert("Leave updated successfully!");
          getLeaves();
        },
        (err) => {
          alert(`Error while updating leave: ${err.response.data.message}`);
        }
      );
  };

  const toggleModal = (photoFileName) => {
    setSelectedPhoto(photoFileName);
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalClosedManually(true);
  };

  useEffect(() => {
    if (modalClosedManually) {
      window.location.reload();
    }
  }, [modalClosedManually]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning';
      case 'Accepted':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      default:
        return '';
    }
  };

  const handleSave = (id, status, comment) => {
    updateLeave(id, status, comment);
  };

  const handleStatusChange = (id, status) => {
    const updatedLeaves = leaves.map(leave => {
      if (leave._id === id) {
        return { ...leave, status: status };
      }
      return leave;
    });
    setLeaves(updatedLeaves);
  };

  const handleCommentChange = (id, comment) => {
    const updatedLeaves = leaves.map(leave => {
      if (leave._id === id) {
        return { ...leave, adminComment: comment };
      }
      return leave;
    });
    setLeaves(updatedLeaves);
  };

  const sortLeaves = () => {
    const sortedLeaves = [...leaves];
    for (let i = 0; i < sortedLeaves.length - 1; i++) {
      for (let j = 0; j < sortedLeaves.length - i - 1; j++) {
        if (sortedLeaves[j].startDate < sortedLeaves[j + 1].startDate) {
          const temp = sortedLeaves[j];
          sortedLeaves[j] = sortedLeaves[j + 1];
          sortedLeaves[j + 1] = temp;
        }
      }
    }
    setLeaves(sortedLeaves);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      // If the search query is empty, reset to the original list of leaves
      getLeaves();
    } else {
      // If the search query is not empty, filter the leaves based on the query
      const filteredLeaves = leaves.filter((leave) =>
        leave.LeaveId && leave.LeaveId.toString().toLowerCase().includes(query.toLowerCase())
      );
      setLeaves(filteredLeaves);
    }
  };

  return (
    <MDBContainer>
      <NavBar />

      <div className="input-group mb-3" style={{ border: "3px solid black" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search Leave ID"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ border: "none" }}
        />
        <button className="btn btn-primary" onClick={sortLeaves}>Sort</button>
      </div>

      <table className="table">
        <thead className="table-dark">
          <tr>
            <th>Leave ID</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Admin Comment</th>
            <th>Reson</th>
            <th>Percentage</th> {/* New column for percentage */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {leaves.map((leave) => (
  <tr key={leave._id}>
    <td>{leave.LeaveId}</td>
    <td>{leave.leaveType}</td>
    <td>{formatDate(leave.startDate)}</td>
    <td>{formatDate(leave.endDate)}</td>
    <td>
      <select
        className={`form-select ${getStatusColor(leave.status)}`}
        value={leave.status}
        onChange={(e) => handleStatusChange(leave._id, e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
      </select>
    </td>
    <td>
      <input
        type="text"
        className="form-control"
        value={leave.adminComment}
        onChange={(e) => handleCommentChange(leave._id, e.target.value)}
      />
    </td>
    <td>
      <img
        src={`${API_URL.leavephotospath}${leave.PhotoFileName}`}
        alt="Profile"
        className="rounded-circle"
        style={{ width: "50px", height: "50px", cursor: "pointer" }}
        onClick={() => toggleModal(leave.PhotoFileName)}
      />
    </td>
    <td>{leave.percentage}%</td> {/* Displaying the percentage */}
    <td>
      <button className="btn btn-primary" onClick={() => handleSave(leave._id, leave.status, leave.adminComment)}>Save</button>
    </td>
  </tr>
))}

        </tbody>
      </table>
    
      <MDBModal show={showModal} onHide={handleCloseModal}>
        <MDBModalHeader>
          Profile Photo
        </MDBModalHeader>
        <MDBModalBody>
          <img
            src={`${API_URL.leavephotospath}${selectedPhoto}`}
            alt="Profile"
            className="img-fluid"
          />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={handleCloseModal}>Close</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
  );
};
