import AboutClient from './AboutClient'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type AboutData = {
  title: string
  subtitle: string
  photo?: { url: string; alt: string }
  biography: SerializedEditorState
  philosophyPillars: Array<{ icon: string; title: string; description: string }>
  certifications: Array<{ name: string; year?: number }>
}

export default function AboutSection({ aboutData }: { aboutData: AboutData }) {
  return <AboutClient aboutData={aboutData} />
}
