import { useNavigate } from "react-router";
import { Ticket } from "lucide-react";
import Button from "../Elements/Button";

const EmptyBasketState = () => {
    const navigate = useNavigate();

    return (
        <main className="max-w-4xl mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
            <div className="mb-8 p-6 bg-white/5 rounded-full text-gray-500 border border-white/5 animate-pulse">
                <Ticket className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 font-['Montserrat']">Your Basket is Empty</h1>
            <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
                You haven't selected any movie tickets yet. Browse our selection of now playing movies and book your session!
            </p>
            <Button variant="primary" onClick={() => navigate("/")} className="px-8 py-3">
                Explore Movies
            </Button>
        </main>
    );
};

export default EmptyBasketState;
