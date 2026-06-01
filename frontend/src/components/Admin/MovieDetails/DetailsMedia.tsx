interface DetailsMediaProps {
    title: string;
    posterUrl: string;
    backdropUrl: string;
}

const DetailsMedia = ({ title, posterUrl, backdropUrl }: DetailsMediaProps) => {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="rounded-xl overflow-hidden border border-gray-800 shadow-xl aspect-[2/3] bg-[#111]">
                <img src={posterUrl} alt={`${title} Poster`} className="w-full h-full object-cover" />
            </article>
            <article className="lg:col-span-2 rounded-xl overflow-hidden border border-gray-800 shadow-xl aspect-video lg:aspect-auto bg-[#111]">
                <img src={backdropUrl} alt={`${title} Backdrop`} className="w-full h-full object-cover" />
            </article>
        </section>
    );
};

export default DetailsMedia;
