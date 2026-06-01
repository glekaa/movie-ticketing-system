import AdminHeader from "../components/Admin/Header"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#121111] font-sans">
            <AdminHeader />
            {children}
        </div>
    )
}

export default AdminLayout;