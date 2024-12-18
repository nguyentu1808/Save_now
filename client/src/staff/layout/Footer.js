const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.contactTitle}>Liên hệ với chúng tôi</p>

      <div style={styles.contactMethods}>
        <div style={styles.column}>
          <p style={styles.contactItem}>Email: example@gmail.com</p>
          <p style={styles.contactItem}>Số điện thoại: 0123.456.789</p>
        </div>

        <div style={styles.column}>
          <p style={styles.contactItem}>Facebook: facebook.com</p>
          <p style={styles.contactItem}>TikTok: tiktok.com</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    position: 'fixed', // Cố định vị trí footer
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E4E3E3',
    padding: '5px 0',
    textAlign: 'center',
    zIndex: 1000, // Đảm bảo footer nằm trên cùng
  },
  contactTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
  },
  contactMethods: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    textAlign: 'center',
  },
  contactItem: {
    margin: '2px 0',
  },
};

export default Footer;
