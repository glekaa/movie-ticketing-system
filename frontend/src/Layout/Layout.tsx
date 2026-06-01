import Header from "../components/LayoutElements/Header";
import Footer from "../components/LayoutElements/Footer";
import BackToTop from "../components/LayoutElements/BackToTop";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <BackToTop />
            <Footer />
        </>
    )
}

export default Layout;