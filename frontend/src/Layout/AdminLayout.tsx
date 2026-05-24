import AdminHeader from "../components/Admin/Header"
import Footer from "../components/Admin/Footer"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#121111] font-sans">
            <AdminHeader />
            {children}
            <Footer />
        </div>
    )
}

export default AdminLayout;