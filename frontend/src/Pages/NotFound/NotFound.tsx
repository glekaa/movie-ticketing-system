import Button from "../../components/Elements/Button"
import { useNavigate } from "react-router"

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col justify-center items-center gap-8 h-[80vh]">
            <p className="text-4xl text-white">Oops! It seems you're lost...</p>
            <Button variant="primary" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
    )
}

export default NotFound