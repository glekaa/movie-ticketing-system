import { useNavigate } from "react-router"

const Header = () => {
    const navigate = useNavigate()
    return (
        <header className="flex justify-start w-full relative px-4 md:px-8 h-18 items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-300 tracking-tighter cursor-pointer hover:text-white" onClick={() => navigate("/admin")}>absolute Admin</h1>
        </header>
    )
}

export default Header;