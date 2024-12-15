import { useParams } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/header";

export default function InfoUser() {
  const { id } = useParams();

  return (
    <>
      <Header />
      <main style={styles.main}>
        <h2 style={styles.title}>Thông tin người dùng</h2>
        <p style={styles.text}>Đây là thông tin chi tiết của người dùng với ID: {id}</p>
      </main>
      <Footer />
    </>
  );
}

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    padding: "60px 20px",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
  },
};
