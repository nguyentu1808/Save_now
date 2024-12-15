import React from 'react';
import Header from './Header';
import styles from './Layout.css';
import classNames from 'classnames/bind';
import Footer from './Footer';

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