import useMetadata from "../hooks/useMetadata";


export default function Metadata() {
  const { data, isLoading } = useMetadata();

  if (isLoading || !data) {
    return null;
  }

  return (
    <div style={{ marginLeft: '0.5rem' }}>
      <h5>{data.subtitle}</h5>
      <div dangerouslySetInnerHTML={{ __html: data.description }} />
    </div>
  )
}