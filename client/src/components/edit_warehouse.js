import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

export default function EditWarehouseModal({ warehouse, onClose, onSave }) {
  const [editedWarehouse, setEditedWarehouse] = useState(warehouse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedWarehouse({ ...editedWarehouse, [name]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/admin/updateWarehouse/${editedWarehouse.id}`, {
        method: 'PUT', // Cập nhật kho sử dụng phương thức PUT
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using JWT token for authentication
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedWarehouse.name,
          location: editedWarehouse.location,
          capacity: editedWarehouse.capacity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update warehouse');
      }
      onSave(editedWarehouse);
      onClose();
    } catch (err) {
      setError('Lỗi khi cập nhật kho.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3 style={styles.title}>Chỉnh sửa kho</h3>
        <label style={styles.label}>
          Tên kho:
          <input
            type="text"
            name="name"
            value={editedWarehouse.name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Địa điểm:
          <input
            type="text"
            name="location"
            value={editedWarehouse.location}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Sức chứa:
          <input
            type="number"
            name="capacity"
            value={editedWarehouse.capacity}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.modalActions}>
          <button style={styles.saveButton} onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button style={styles.cancelButton} onClick={onClose}>
            Hủy
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
    zIndex: 1000,
  },
  modalContent: {
    width: '400px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  saveButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#ddd',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
    textAlign: 'center',
  },
};
