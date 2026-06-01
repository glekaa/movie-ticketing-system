interface DetailsFooterProps {
    movieId: string;
    createdAt: string;
    updatedAt: string;
    onCopyId: () => void;
}

const DetailsFooter = ({ movieId, createdAt, updatedAt, onCopyId }: DetailsFooterProps) => {
    return (
        <footer className="pt-8 mt-12 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-3">
                <span className="font-semibold uppercase tracking-wider text-gray-600">UUID</span>
                <code className="bg-[#111] px-3 py-1.5 rounded-md text-gray-400 border border-gray-800 select-all font-mono">
                    {movieId}
                </code>
                <button
                    onClick={onCopyId}
                    className="p-1.5 hover:bg-gray-800 hover:text-white rounded transition-colors cursor-pointer"
                    title="Copy ID to clipboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                    </svg>
                </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-[#111] px-4 py-2 rounded-lg border border-gray-800">
                <div>
                    <span className="text-gray-600 mr-2">Created:</span>
                    <span className="font-mono">{new Date(createdAt).toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-gray-600 mr-2">Last Modified:</span>
                    <span className="font-mono">{new Date(updatedAt).toLocaleString()}</span>
                </div>
            </div>
        </footer>
    );
};

export default DetailsFooter;
