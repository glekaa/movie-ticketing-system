const Synopsis = () => {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-[#C4C7C7] leading-relaxed text-md max-w-3xl">
                Thomas Anderson, a computer programmer living a double life as the hacker "Neo," discovers that the world around him is a simulated reality called the Matrix, controlled by intelligent machines that harvest human energy. Recruited by Morpheus and Trinity, Neo learns to bend the rules of the Matrix and becomes humanity's potential savior. As he trains and grows in power, he must decide whether to embrace his role as "The One" and confront the system controlling the world, leading to a battle that challenges the nature of reality itself.
            </p>
            <div className="flex flex-row gap-10 mt-6 py-4">
                <div className="bg-white/5 rounded-lg px-4 py-3 min-w-[120px] border border-white/5">
                    <p className="text-[#8B8D8D] text-[10px] uppercase tracking-wider mb-1">Director</p>
                    <p className="font-medium text-sm text-[#E5E2E1]">Lilly Wachowski, Lana Wachowski</p>
                </div>
                <div className="bg-white/5 rounded-lg px-4 py-3 min-w-[200px] border border-white/5">
                    <p className="text-[#8B8D8D] text-[10px] uppercase tracking-wider mb-1">Writers</p>
                    <p className="font-medium text-sm text-[#E5E2E1]">Lana Wachowski, Lilly Wachowski</p>
                </div>
            </div>
        </section>
    );
};

export default Synopsis;
