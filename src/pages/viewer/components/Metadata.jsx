export default function Metadata({ title, subtitle, description, metadataRef }) {
  return (
    <div ref={metadataRef} className="metadata">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <details>
        <summary>Beskrivelse</summary>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </details>
    </div>
  )
}