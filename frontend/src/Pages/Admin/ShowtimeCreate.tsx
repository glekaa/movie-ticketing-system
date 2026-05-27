import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import showtimeServices from "../../services/showtimeServices";
import movieServices from "../../services/movieServices";
import theaterServices from "../../services/theaterServices";
import type { Movie, Theater } from "../../types";
import { ArrowLeft } from "lucide-react";
import Button from "../../components/Elements/Button";
import { FormInput, FormSelect } from "../../components/Elements/FormElements";

const ShowtimeCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: movies } = useQuery<Movie[]>({
        queryKey: ["movies"],
        queryFn: () => movieServices.getAllMovies()
    });

    const { data: theaters } = useQuery<Theater[]>({
        queryKey: ["theaters"],
        queryFn: () => theaterServices.getAllTheaters()
    });

    const [movieId, setMovieId] = useState(id);
    const [theaterId, setTheaterId] = useState("");
    const [screenId, setScreenId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [basePrice, setBasePrice] = useState("5");

    const mutation = useMutation({
        mutationFn: (data: any) => showtimeServices.createShowtime(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["showtimes", movieId] });
            navigate(`/admin/movies-management/${movieId}`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let formattedStartTime = "";
        let formattedEndTime = "";
        try {
            formattedStartTime = new Date(startTime).toISOString();
            formattedEndTime = new Date(endTime).toISOString();
        } catch (error) {
            alert("Invalid date format");
            return;
        }

        mutation.mutate({
            movie_id: movieId,
            screen_id: screenId,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            base_price: parseFloat(basePrice) || 0,
            status: "scheduled"
        });
    };

    const selectedTheater = theaters?.find(t => t.id === theaterId);

    return (
        <main className="flex flex-col px-4 md:px-8 flex-1 text-gray-200 pb-12">
            <div className="py-4 mb-6 mt-4 flex justify-between items-center bg-[#121111]">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-2 cursor-pointer bg-transparent border-none outline-none"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Movie Details
                    </button>
                    <h1 className="text-3xl font-bold text-gray-200">Create New Showtime</h1>
                    <p className="text-sm text-gray-400 mt-1">Schedule a movie.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 flex flex-col gap-6">
                <FormSelect
                    label="Movie"
                    required
                    value={movieId}
                    onChange={e => setMovieId(e.target.value)}
                >
                    <option value="">Select a movie</option>
                    {movies?.map(movie => (
                        <option key={movie.id} value={movie.id}>{movie.title}</option>
                    ))}
                </FormSelect>

                <FormSelect
                    label="Theater"
                    required
                    value={theaterId}
                    onChange={e => { setTheaterId(e.target.value); setScreenId(""); }}
                >
                    <option value="">Select a theater</option>
                    {theaters?.map(theater => (
                        <option key={theater.id} value={theater.id}>{theater.name}</option>
                    ))}
                </FormSelect>

                <FormSelect
                    label="Screen"
                    required
                    value={screenId}
                    onChange={e => setScreenId(e.target.value)}
                    disabled={!theaterId}
                >
                    <option value="">Select a screen</option>
                    {selectedTheater?.screens.map(screen => (
                        <option key={screen.id} value={screen.id}>{screen.name}</option>
                    ))}
                </FormSelect>

                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Start Time"
                        type="datetime-local"
                        required
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                    />
                    <FormInput
                        label="End Time"
                        type="datetime-local"
                        required
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                    />
                </div>

                <FormInput
                    label="Base Price ($)"
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                />

                <div className="flex justify-end gap-4 mt-4">
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={mutation.isPending}>
                        {mutation.isPending ? "Creating..." : "Create Showtime"}
                    </Button>
                </div>
            </form>
        </main>
    );
};

export default ShowtimeCreate;
