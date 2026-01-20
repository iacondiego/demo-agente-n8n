import MainLayout from '@/components/layout/MainLayout'

export default function DemoPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const agent = typeof searchParams.agent === 'string' &&
        (searchParams.agent === 'text' || searchParams.agent === 'voice')
        ? searchParams.agent
        : 'text'

    return (
        <main className="w-full h-screen overflow-hidden">
            <MainLayout initialAgent={agent} />
        </main>
    )
}
