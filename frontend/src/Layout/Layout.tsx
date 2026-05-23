import Header from "../components/LayoutElements/Header";
import Footer from "../components/LayoutElements/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default Layout;