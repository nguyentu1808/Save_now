import React, { useState } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import AddRequest from '../components/addrequest';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const RescueRequestList = () => {
    const [rescueRequests, setRescueRequests] = useState([
          {
            title: "Yêu cầu cứu trợ miền Trung",
            location: "Xã A, Huyện B, Tỉnh C",
            contact: "Nguyễn Văn A - 0123 456 789",
            description: "Khu vực bị ảnh hưởng bởi bão lũ, cần nhu yếu phẩm và thuốc men."
          },
          {
            title: "Yêu cầu cứu trợ Tây Nguyên",
            location: "Xã D, Huyện E, Tỉnh F",
            contact: "Trần Thị B - 0987 654 321",
            description: "Khu vực thiếu nước sinh hoạt và thực phẩm."
          },
          {
            title: "Yêu cầu cứu trợ miền Bắc",
            location: "Xã G, Huyện H, Tỉnh I",
            contact: "Phạm Văn C - 0912 345 678",
            description: "Gia đình gặp khó khăn do thiên tai, cần quần áo và vật phẩm y tế."
          },
          {
            title: "Yêu cầu cứu trợ Đồng Bằng Sông Cửu Long",
            location: "Xã J, Huyện K, Tỉnh L",
            contact: "Lê Thị D - 0345 678 901",
            description: "Cần hỗ trợ lương thực và nước uống do hạn mặn."
          },
          {
            title: "Yêu cầu cứu trợ khu vực Tây Nam Bộ",
            location: "Xã M, Huyện N, Tỉnh O",
            contact: "Hoàng Văn E - 0981 234 567",
            description: "Thiếu hụt nhu yếu phẩm và thuốc men do ảnh hưởng bão."
          }
      // Các yêu cầu ban đầu khác...
    ]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [isAddRequestVisible, setIsAddRequestVisible] = useState(false);
  
    const toggleDetails = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
    };
  
    // Hàm thêm yêu cầu mới
    const addNewRequest = (newRequest) => {
      setRescueRequests((prevRequests) => [...prevRequests, newRequest]);
    };
  
    return (
      <>
        <Header />
        <main style={styles.main}>
          <h2 style={styles.pageTitle}>Danh sách cần cứu trợ</h2>
          <div style={styles.requestList}>
            {rescueRequests.map((request, index) => (
              <div key={index} style={styles.requestItem}>
                <div style={styles.requestHeader}>
                  <a href="/inforequest" style={styles.requestTitle}>{request.title}</a>
                  <button
                    onClick={() => toggleDetails(index)}
                    style={styles.toggleButton}
                  >
                    {expandedIndex === index ? <FiChevronDown /> : <FiChevronRight />} 
                  </button>
                </div>
                {expandedIndex === index && (
                  <div style={styles.requestDetails}>
                    <p style={styles.requestDetail}>Địa chỉ: {request.location}</p>
                    <p style={styles.requestDetail}>Thông tin liên hệ: {request.contact}</p>
                    <p style={styles.requestDescription}>{request.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button 
            style={styles.createRequestButton} 
            onClick={() => setIsAddRequestVisible(true)}
          >
            Tạo yêu cầu
          </button>
          {isAddRequestVisible && <AddRequest onClose={() => setIsAddRequestVisible(false)} onAddRequest={addNewRequest} />}
        </main>
        <Footer />
      </>
    );
  };
  
  const styles = {
    main: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      paddingTop: '80px',
      paddingBottom: '50px',
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center',
    },
    requestList: {
      width: '100%',
      maxWidth: '1000px',
      height: '600px',
      backgroundColor: '#e0e0e0',
      padding: '20px',
      borderRadius: '8px',
      overflowY: 'auto',
    },
    requestItem: {
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    requestHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    requestTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    toggleButton: {
      fontSize: '16px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      marginLeft: '10px',
    },
    requestDetails: {
      marginTop: '10px',
    },
    requestDetail: {
      fontSize: '16px',
      margin: '5px 0',
    },
    requestDescription: {
      fontSize: '16px',
      color: '#555',
    },
    createRequestButton: {
      padding: '10px 20px',
      backgroundColor: '#ddd',
      color: '#333',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      position: 'fixed',
      bottom: '150px',
      right: '50px',
    },
  };
  
  export default RescueRequestList;