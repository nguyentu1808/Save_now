import React from 'react';
import Header from './Header';
import Footer from '../../admin/layout/Footer';
import styles from './Layout.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className={cx('layout')}>
        <Header />
        <div className={cx('content')}>{children}</div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Layout;
