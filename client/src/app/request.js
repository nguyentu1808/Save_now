import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import AddRequest from "../components/addrequest";

const RescueRequestList = () => {
  const navigate = useNavigate();
  const [isAddRequestVisible, setIsAddRequestVisible] = useState(false);
  const [rescueRequests, setRescueRequests] = useState([]);

  

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/adRequest/requests?status=active`,
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
        setRescueRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleRequestClick = (requestId) => {
    navigate(`/inforequest/${requestId}`);
  };

  const addNewRequest = (newRequest) => {
    setRescueRequests((prevRequests) => [...prevRequests, newRequest]);
  };

  return (
    <>
      <Header/>
      <main style={styles.main}>
        <h2 style={styles.pageTitle}>Danh sách cứu trợ</h2>
        <div style={styles.requestList}>
          {rescueRequests.map((request) => (
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
                <p style={styles.requestDetail}>Khu vực: {request.location}</p>
                <p style={styles.requestDetail}>
                  Thông tin liên hệ: {request.contact}
                </p>
                <p style={styles.requestDescription}>
                  Mô tả: {request.description}
                </p>
              </div>
            </div>
          ))}
        </div>
          <button
            style={styles.createRequestButton}
            onClick={() => setIsAddRequestVisible(true)}
          >
            Tạo yêu cầu
          </button>
        {isAddRequestVisible && (
          <AddRequest
            onClose={() => setIsAddRequestVisible(false)}
            onAddRequest={addNewRequest}
          />
        )}
      </main>
      <Footer/>
    </>
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
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
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
    marginBottom: "20px",
    textAlign: "center",
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
};

export default RescueRequestList;
