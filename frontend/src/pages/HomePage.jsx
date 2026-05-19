import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="px-8 py-4 text-black text-3xl font-bold transition mb-8">
                Mobile Robot Maid
            </h1>
            <button
                onClick={() => navigate('/map')}
                className="rounded-full px-8 py-4 text-black text-lg font-semibold border border-2 border-black hover:bg-black hover:text-white transition"
            >
                Enter
            </button>
        </main>
    )
}

export default HomePage