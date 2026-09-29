interface SectionHeadingProps {
  description: string
  id?: string
  index: string
  title: string
}

export function SectionHeading({ description, id, index, title }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <span className="section-heading__index">/{index}</span>
      <div>
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
    </header>
  )
}
