import React, { useState } from 'react';

const AddRequest = ({ onClose, onAddRequest }) => {
  const [formData, setFormData] = useState({
    name : '',
    location: '',
    contact: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5001/adRequest/addRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Chuyển đổi formData thành JSON
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        alert('Đã xảy ra lỗi: ' + errorData.message);
        return;
      }
  
      const data = await response.json();
      console.log('Yêu cầu thành công:', data);
  
      onAddRequest(data); // Gửi dữ liệu về component cha nếu cần xử lý thêm
      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới server.');
    }
  };

  return (
    <div style={modalStyles.modalBackground}>
      <div style={modalStyles.modalContent}>
        <h2 style={styles.title}>Tạo Yêu Cầu Cứu Trợ</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tiêu đề:</label>
            <input type="text" name="name" style={styles.input} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Khu vực cứu trợ:</label>
            <input type="text" name="location" style={styles.input} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Thông tin liên hệ:</label>
            <input type="text" name="contact" style={styles.input} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Mô tả:</label>
            <textarea name="description" style={styles.textarea} onChange={handleChange} required></textarea>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tải lên tệp PDF:</label>
            <input type="file" accept=".pdf" style={styles.input} />
          </div>
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.buttonCancel}>Đóng</button>
            <button type="submit" style={styles.buttonSubmit}>Tạo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalStyles = {
  modalBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000, 
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '800px', // Tăng chiều rộng modal
    maxWidth: '95%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

const styles = {
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '25px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Tăng khoảng cách giữa các trường
  },
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  label: {
    width: '150px', // Tăng chiều rộng label để thẳng hàng
    fontSize: '16px',
    color: '#333',
  },
  input: {
    flex: '1',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%', // Đảm bảo input rộng ra
    height: '50px', // Tăng chiều cao input
  },
  textarea: {
    flex: '1',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '100px', // Tăng chiều cao textarea
    width: '100%', // Đảm bảo textarea rộng ra
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px',
  },
  buttonCancel: {
    padding: '10px 18px',
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonSubmit: {
    padding: '10px 18px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default AddRequest;
