import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

const AddStatement = ({ onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [NewStatement, setNewStatement] = useState({ name: '', url: '' });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setNewStatement({ name: '', url: '' });
    setIsModalOpen(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewStatement(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const { name, url } = NewStatement;

    if (!name || !url) {
      alert('Please fill in all fields');
      return;
    }

    // onAdd(NewStatement);
    try {
      const response = await fetch(`${apiUrl}/statement/addstatements`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using JWT token for authentication
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, url }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('statement added successfully');
        onAdd(NewStatement);
        handleCloseModal();
      } else {
        alert(result.message || 'Error adding statement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while adding the statement');
    }
    // handleCloseModal();
  };
  return (
    <>
      <button style={styles.addButton} onClick={handleOpenModal}>
        Thêm Thống Kê
      </button>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalname}>Thêm Thống Kê Chi Tiêu</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tiêu đề:</label>
              <input
                type="text"
                name="name"
                value={NewStatement.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Nhập tiêu đề thống kê"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>URL:</label>
              <input
                type="text"
                name="url"
                value={NewStatement.url}
                onChange={handleChange}
                style={styles.input}
                placeholder="Nhập đường dẫn URL"
              />
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={handleAdd} style={styles.saveButton}>
                Thêm
              </button>
              <button onClick={handleCloseModal} style={styles.cancelButton}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  addButton: {
    position: 'fixed',
    bottom: '150px',
    right: '100px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  modalname: {
    marginBottom: '20px',
    fontSize: '20px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AddStatement;
