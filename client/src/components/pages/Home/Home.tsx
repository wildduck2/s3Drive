import { Header, Upload } from '@/components/layout'
import { UploadAdapterPicker, UploadsTable } from '@/components/ui'

export const Index = () => {
  return (
    <main className="grid w-full">
      <Header />

      <section className="grid place-content-center w-full gap-4">
        <div className="flex items-center justify-end gap-4">
          <UploadAdapterPicker />
          <Upload />
        </div>
        <UploadsTable />
      </section>
    </main>
  )
}
