import timeAgo from '@/lib/timeAgo'

const Timestamp = ({createdAt}:{createdAt: Date}) => {
  return (
    <span className="text-neutral-400 text-xs">{timeAgo(createdAt)}</span>
  )
}

export default Timestamp