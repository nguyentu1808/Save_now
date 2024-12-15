import React, { useState, useEffect } from "react";
import Layout from "../layout";
import AddRequest from "../../components/addrequest";
import { FaTimes, FaCheck } from "react-icons/fa"; // Đổi icon tại đây
import { useNavigate } from 'react-router-dom';


const AdminRescueRequestList = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("requests");
  const [rescueRequests, setRescueRequests] = useState([]);

  const [approvalRequests, setApprovalRequests] = useState([]);

  const [isAddRequestVisible, setIsAddRequestVisible] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const status = activeTab === "requests" ? "active" : "pending";
      try {
        const response = await fetch(
          `http://localhost:5001/adRequest/requests?status=${status}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        if (activeTab === "requests") {
          setRescueRequests(data);
        } else {
          setApprovalRequests(data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, [activeTab]);

  const addNewRequest = (newRequest) => {
    setRescueRequests((prevRequests) => [...prevRequests, newRequest]);
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/adRequest/requests/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "active" }),
        }
      );
      if (!response.ok) throw new Error("Failed to approve request");
      setApprovalRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/adRequest/requests/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancel" }),
        }
      );
      if (!response.ok) throw new Error("Failed to reject request");
      setApprovalRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleRequestClick = (requestId) => {
    navigate(`/admin-request/inforequest/${requestId}`);
  };

  return (
    <Layout>
      <main style={styles.main}>
        <h2 style={styles.pageTitle}>
          <span
            style={
              activeTab === "requests" ? styles.activeTab : styles.inactiveTab
            }
            onClick={() => setActiveTab("requests")}
          >
            Danh sách cứu trợ
          </span>
          <span
            style={
              activeTab === "approvals" ? styles.activeTab : styles.inactiveTab
            }
            onClick={() => setActiveTab("approvals")}
          >
            Danh sách phê duyệt
          </span>
        </h2>

        <div style={styles.requestList}>
          {activeTab === "requests" &&
            rescueRequests.map((request) => (
              <div
                key={request.id}
                style={styles.requestItem}
                onClick={() => handleRequestClick(request.id)}
              >
                <img
                  src={request.image || "https://via.placeholder.com/150"}
                  alt={request.title}
                  style={styles.requestImage}
                />
                <div style={styles.requestContent}>
                  <p style={styles.requestTitle}>{request.title}</p>
                  <p style={styles.requestDetail}>
                    Khu vực: {request.location}
                  </p>
                  <p style={styles.requestDetail}>
                    Thông tin liên hệ: {request.contact}
                  </p>
                  <p style={styles.requestDescription}>
                    Mô tả: {request.description}
                  </p>
                </div>
              </div>
            ))}

          {activeTab === "approvals" &&
            approvalRequests.map((request) => (
              <div key={request.id} style={styles.requestItem}>
                <img
                  src={request.image || "https://via.placeholder.com/150"}
                  alt={request.title}
                  style={styles.requestImage}
                />
                <div style={styles.requestContent}>
                  <p style={styles.requestTitle}>{request.title}</p>
                  <p style={styles.requestDetail}>
                    Khu vực: {request.location}
                  </p>
                  <p style={styles.requestDetail}>
                    Thông tin liên hệ: {request.contact}
                  </p>
                  <p style={styles.requestDescription}>
                    Mô tả: {request.description}
                  </p>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.rejectButton}
                      onClick={() => handleReject(request.id)}
                    >
                      <FaTimes />
                    </button>
                    <button
                      style={styles.approveButton}
                      onClick={() => handleApprove(request.id)}
                    >
                      <FaCheck />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {activeTab === "approvals" && (
          <button
            style={styles.createRequestButton}
            onClick={() => setIsAddRequestVisible(true)}
          >
            Tạo yêu cầu
          </button>
        )}
        {isAddRequestVisible && (
          <AddRequest
            onClose={() => setIsAddRequestVisible(false)}
            onAddRequest={addNewRequest}
          />
        )}
      </main>
    </Layout>
  );
};

const styles = {
  main: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    paddingTop: "80px",
    paddingBottom: "50px",
  },
  pageTitle: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  activeTab: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "20px",
    color: "#333",
    marginRight: "20px",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  inactiveTab: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "20px",
    textDecoration: "none",
    color: "#333",
    marginRight: "20px",
  },
  requestList: {
    width: "100%",
    maxWidth: "1000px",
    height: "600px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    overflowY: "auto",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  requestItem: {
    display: "flex",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  requestImage: {
    width: "200px",
    height: "150px",
    borderRadius: "8px",
    marginRight: "15px",
    objectFit: "cover",
  },
  requestContent: {
    flex: 1,
    textAlign: "left",
    textDecoration: "none",
    color: "#333",
  },
  requestTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  requestDetail: {
    fontSize: "16px",
    margin: "5px 0",
  },
  requestDescription: {
    fontSize: "16px",
    color: "#555",
  },
  createRequestButton: {
    padding: "10px 20px",
    backgroundColor: "#ddd",
    color: "#333",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    position: "fixed",
    bottom: "150px",
    right: "150px",
  },
  actionButtons: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    display: "flex",
    gap: "5px",
  },
  approveButton: {
    padding: "8px",
    backgroundColor: "#000000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    height: "40px",
    width: "40px",
  },
  rejectButton: {
    padding: "8px",
    backgroundColor: "#000000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    height: "40px",
    width: "40px",
  },
};

export default AdminRescueRequestList;
