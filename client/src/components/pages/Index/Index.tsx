import { Header, Upload } from '@/components/layout'
import UploadsTable from '@/components/layout/UploadsTable/UploadsTable'

export const Index = () => {
  return (
    <main className="grid w-full">
      <Header />

      <section className="grid place-content-center w-full gap-4">
        <Upload />
        <UploadsTable />
      </section>
    </main>
  )
}
