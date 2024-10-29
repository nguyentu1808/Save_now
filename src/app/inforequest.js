import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const InfoRequest = () => {
  const [selectedTab, setSelectedTab] = useState('relatedArticles'); // State để quản lý tab hiện tại

  const handleTabClick = (tab) => {
    setSelectedTab(tab); // Cập nhật tab được chọn
  };

  const data = {
    relatedArticles: [
      { id: 1, title: "Bài báo 1", url: "/article/1" },
      { id: 2, title: "Bài báo 2", url: "/article/2" },
      { id: 3, title: "Bài báo 3", url: "/article/3" },
      { id: 4, title: "Bài báo 4", url: "/article/4" },
      { id: 5, title: "Bài báo 5", url: "/article/5" },
    ],
    spendingStats: [
      { id: 1, title: "Thống kê chi tiêu từ 1/10/2023-1/12/2023", url: "/expense/1" },
      { id: 2, title: "Thống kê chi tiêu từ 1/12/2023-1/2/2024", url: "/expense/2" },
      { id: 3, title: "Thống kê chi tiêu từ 1/2/2024-1/4/2024", url: "/expense/3" },
    ],
  };

  return (
    <>
      <Header />
      <main style={styles.main}>
        {/* <h2 style={styles.pageTitle}>Thông Tin Yêu Cầu</h2> */}
        <nav>
          <button
            onClick={() => handleTabClick('relatedArticles')}
            style={{
              ...styles.navButton,
              ...(selectedTab === 'relatedArticles' ? styles.activeNavButton : {})
            }}
          >
            Các bài báo liên quan
          </button>
          <button
            onClick={() => handleTabClick('spendingStats')}
            style={{
              ...styles.navButton,
              ...(selectedTab === 'spendingStats' ? styles.activeNavButton : {})
            }}
          >
            Thống kê chi tiêu
          </button>
        </nav>

        <div style={styles.content}>
          {selectedTab === 'relatedArticles' && (
            <>
              <h3>Bài Báo Liên Quan</h3>
              {data.relatedArticles.map((article) => (
                <p key={article.id}>
                  <a href={article.url} style={styles.link}>{article.title}</a>
                </p>
              ))}
            </>
          )}

          {selectedTab === 'spendingStats' && (
            <>
              <h3>Thống Kê Chi Tiêu</h3>
              {data.spendingStats.map((stat) => (
                <p key={stat.id}>
                  <a href={stat.url} style={styles.link}>{stat.title}</a>
                </p>
              ))}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

const styles = {
    main: {
      height: 'calc(100vh - 255px)',
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
    navButton: {
      padding: '10px',
      marginRight: '10px',
      backgroundColor: 'lightgrey',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      textDecoration: 'none',
      color: '#333',
    },
    activeNavButton: {
      backgroundColor: '#ddd', // Màu khác để đánh dấu tab đang được chọn
    },
    content: {
      width: '100%',
      maxWidth: '800px',
      padding: '20px',
      border: '1px solid #ccc',
      backgroundColor: '#e0e0e0',
      borderRadius: '8px',
      overflowY: 'auto',
    },
    link: {
      cursor: 'pointer',
      color: 'blue',
      textDecoration: 'underline',
    },
  };

export default InfoRequest;
