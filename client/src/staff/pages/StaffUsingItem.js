import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

export default function UsingItem({ onClose, itemId, quantity1 }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(quantity1); // Số lượng mặc định
  const [requests, setRequests] = useState([]);
  const [selectedArea, setSelectedArea] = useState('Miền Bắc');
  const [selectedRequest, setSelectedRequest] = useState('');

  useEffect(() => {
    fetchRequests(selectedArea);
  }, [selectedArea]);

  const areaOptions = [
    'Miền Bắc',
    'Miền Trung',
    'Miền Nam',
    'Tây Nguyên',
    'Đồng bằng sông Cửu Long',
  ];

  const handleAreaChange = e => {
    setSelectedArea(e.target.value);
  };

  const handleRequestChange = e => {
    const selectedId = parseInt(e.target.value, 10);
    const request = requests.find(r => r.id === selectedId);
    setSelectedRequest(request);
  };

  const updateItem = async () => {
    if (!selectedRequest) {
      setMessage('Chọn yêu cầu cứu trợ tương ứng');
      return;
    }
    if (quantity <= 0) {
      setMessage('Số lượng phải lớn hơn 0.');
      return;
    }
    if (quantity > quantity1) {
      setMessage('Số lượng vượt quá mức cho phép.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${apiUrl}/staff/useItem/${itemId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          areaId: selectedRequest.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Đã gửi thành công!');
        onClose();
      } else {
        setMessage(data.message || 'Gửi thất bại.');
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi gửi.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async location => {
    try {
      const response = await fetch(`${apiUrl}/staff/request/${location}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3>Sử dụng vật phẩm</h3>

        <label>
          Khu vực:
          <select value={selectedArea} onChange={handleAreaChange} style={styles.select}>
            {areaOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Số lượng:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            style={styles.input}
          />
        </label>
        <label>
          Yêu cầu cứu trợ
          <select
            value={selectedRequest.id || ''}
            style={styles.select}
            onChange={handleRequestChange}
          >
            <option value=""></option>
            {requests.map(request => (
              <option key={request.id} value={request.id}>
                {request.name}
              </option>
            ))}
          </select>
        </label>

        {loading && <p>Đang cập nhật...</p>}
        {message && <p>{message}</p>}

        {/* Nút Gửi và Đóng trên cùng một dòng */}
        <div style={styles.buttonRow}>
          <button style={styles.submitButton} onClick={updateItem} disabled={loading}>
            Gửi
          </button>
          <button style={styles.cancelButton} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  select: {
    width: '100%',
    padding: '5px',
    marginTop: '5px',
  },
  input: {
    width: '100%',
    padding: '5px',
    marginTop: '5px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    marginRight: '220px',
  },
  cancelButton: {
    padding: '10px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    marginLeft: '5px',
  },
};
