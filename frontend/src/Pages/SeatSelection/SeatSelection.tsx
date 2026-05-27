const mockScreen = { total_rows: 10, total_cols: 10 }

const SeatSelection = () => {
    return (
        <main>
            <h1 className="text-white">Chose your seats</h1>
            <div>
                <div className="flex flex-col gap-2 p-4">
                    {[...Array(mockScreen.total_rows)].map((_, row) => (
                        <div className="flex flex-row gap-2 justify-center" key={row}>
                            {[...Array(mockScreen.total_cols)].map((_, col) => (
                                <button key={col} className="text-white border border-white/20 rounded-t-xl rounded-b-sm bg-[#222222] w-[50px] h-[50px]">{col + 1}</button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default SeatSelection;