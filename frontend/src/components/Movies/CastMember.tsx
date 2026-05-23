interface CastMemberProps {
    imageUrl: string;
    name: string;
    role: string;
}

const CastMember = ({ imageUrl, name, role }: CastMemberProps) => {
    return (
        <div className="relative group overflow-hidden rounded-xl bg-[#1a1a1a] aspect-[2/3]">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-[#0a0807]/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight">{name}</h3>
                <p className="text-gray-400 text-sm">{role}</p>
            </div>
        </div>
    );
};

export default CastMember;
