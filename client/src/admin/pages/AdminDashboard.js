import Layout from "../layout";
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function AdminDashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      content: "Hỗ trợ người dân sau cơn bão Yagi",
      image: "/assets/cuu_tro_bao_yagi.jpg",
    },
    {
      content: "Hỗ trợ người dân vượt qua cơn lũ",
      image: "/assets/cuu_tro_lu_lut.jpg", 
    },
    {
      content: "Hỗ trợ nguời dân tìm kiếm người mất tích sau cơn lũ quét",
      image: "/assets/cuu_tro_lu_quet.jpg", 
    },
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <Layout>
      <main style={styles.main}>
        <div style={styles.logoContainer}>
          <img src="/assets/logo.png" alt="Logo" style={styles.logo} /> 
        </div>
        <h2 style={styles.tagline}>Cùng chung tay xây dựng xã hội nhân ái và bền vững</h2>
        <div style={styles.content}>
          <div style={styles.leftColumn}>
            <button onClick={handlePrevSlide} style={styles.slideButton}>
              <FiChevronLeft />
            </button>
            <div style={styles.slide}>
              <img src={slides[currentSlide].image} alt="Slide" style={styles.slideImage} />
              <p>{slides[currentSlide].content}</p>
            </div>
            <button onClick={handleNextSlide} style={styles.slideButton}>
              <FiChevronRight />
            </button>
          </div>

          <div style={styles.rightColumn}>
            <h2 style={styles.rightColumnHeading}>Giới thiệu về tổ chức</h2>
            <p style={styles.rightColumnText}>
                Thông tin về tổ chức của bạn, sứ mệnh và những gì tổ chức đang làm.
            </p>
            <a href="/admin/contribute" style={styles.donateButton}>Đóng góp ngay</a>
          </div>
        </div>
      </main>
    </Layout>
  );
}

const styles = {
    main: {
      minHeight: `calc(100vh - 155px)`, // 100vh trừ đi chiều cao của header và footer
      padding: '20px',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Căn dọc ở giữa trang
      paddingTop: '80px',
      paddingBottom: '50px',
    },
    logoContainer: {
      textAlign: 'center',
    },
    logo: {
      maxWidth: '500px', // Thay đổi kích thước logo cho phù hợp
      height: 'auto',
    },
    tagline: {
      textAlign: 'center',
      fontSize: '28px', // Tăng kích thước font chữ
      fontWeight: 'bold',
      marginBottom: '30px',
    },
    content: {
      display: 'flex',
      justifyContent: 'center', // Căn giữa theo chiều ngang
      alignItems: 'center', // Căn giữa theo chiều dọc
      gap: '200px', // Tăng khoảng cách giữa 2 cột
      flexGrow: 1, // Đảm bảo phần content chiếm hết chiều cao có sẵn
    },
    leftColumn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // Đưa các nút xa hơn
      gap: '20px', // Tăng khoảng cách giữa mũi tên và ảnh
    },
    slide: {
      textAlign: 'center',
      maxWidth: '500px', // Tăng chiều rộng cột slide để chứa ảnh lớn hơn
    },
    slideImage: {
      width: '500px', // Tăng kích thước ảnh
      height: '360px', // Đảm bảo kích thước đồng đều
      objectFit: 'cover', // Đảm bảo ảnh lấp đầy khung mà không bị biến dạng
      borderRadius: '8px',
    },
    slideButton: {
      fontSize: '35px', // Tăng kích thước nút trượt
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    rightColumn: {
      maxWidth: '500px', // Tăng kích thước cột bên phải
      textAlign: 'center',
    },
    rightColumnHeading: {
        fontSize: '30px', // Tăng kích thước tiêu đề "Giới thiệu về tổ chức"
        fontWeight: 'bold',
        marginBottom: '15px',
      },
      rightColumnText: {
        fontSize: '20px', // Tăng kích thước đoạn văn dưới tiêu đề
        marginBottom: '20px',
      },
    donateButton: {
      display: 'inline-block',
      padding: '15px 30px', // Tăng kích thước nút
      backgroundColor: '#4285f4',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '8px',
      marginTop: '20px',
      fontSize: '18px', // Tăng kích thước chữ trong nút
    },
  };