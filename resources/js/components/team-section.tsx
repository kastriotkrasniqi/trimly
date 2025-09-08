
export function TeamSection({ members }: { members: { name: string; role: string; avatar: string }[] }) {
    return (
        <section className="p-4 rounded-xl border">
            <div className="mx-auto max-w-3xl lg:px-0 ">
                <div>
                    <h3 className="mb-6 text-lg font-medium">Barbers</h3>
                    <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {members.map((member, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img className="aspect-square rounded-full object-cover" src="https://avatars.githubusercontent.com/u/47919550?v=4" alt={member.name} height="460" width="460" loading="lazy" />
                                </div>
                                <span className="mt-2 block text-sm">{member.user.name}</span>
                                {/* <span className="text-muted-foreground block text-xs">{member.role}</span> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
