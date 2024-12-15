import Layout from "../layout";

export default function AdminContribute() {
  return (
    <Layout>
      <main style={styles.main}>
        <div style={styles.logoContainer}>
          <img src="/assets/logo.png" alt="Logo" style={styles.logo} /> 
        </div>
        <h2 style={styles.tagline}>Cùng chung tay xây dựng xã hội nhân ái và bền vững</h2>
        <div style={styles.content}>
          <div style={styles.leftColumn}>
            <div style={styles.slide}>
              <img src="/assets/QR.jpg" alt="Mã QR" style={styles.slideImage} />
              <h4 style={styles.slideText}>Tổ chức cứu trợ SaveNow</h4>
              <p style={styles.slideText}>0222448889821</p>
              <p style={styles.slideText}>Ngân hàng quân đội MB</p>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <h2 style={styles.rightColumnHeading}>Đóng góp giúp các khu vực cứu trợ</h2>
            <p style={styles.rightColumnText}>Hãy cùng chúng tôi chung tay giúp đỡ. 100% số tiền bạn đóng góp sẽ được chuyển đến trực tiếp khu vực gặp khó khăn, không qua bất kỳ khâu trung gian nào.
              <br/>
              <br/>
              Sự sẻ chia của bạn là động lực lớn nhất cho chúng tôi. Chúng tôi sẽ thường xuyên cập nhật thông tin về quá trình sử dụng quỹ để bạn luôn cảm thấy yên tâm và tin tưởng.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 195px)', // 100vh trừ đi chiều cao của header và footer
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
  },
  slide: {
    textAlign: 'center',
    maxWidth: '500px', // Tăng chiều rộng cột slide để chứa ảnh lớn hơn
  },
  slideImage: {
    width: '350px', // Tăng kích thước ảnh
    height: 'auto', // Đảm bảo kích thước đồng đều
    objectFit: 'cover', // Đảm bảo ảnh lấp đầy khung mà không bị biến dạng
    borderRadius: '8px',
    marginBottom: '10px', // Tạo khoảng cách nhỏ giữa ảnh và nội dung bên dưới
  },
  slideText: {
    margin: '5px 0', // Giảm khoảng cách giữa các dòng
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
};