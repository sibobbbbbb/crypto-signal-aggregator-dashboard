export interface TopicConfig {
  id: number;
  name: string;
}

export const getTopicConfig = (): TopicConfig[] => {
  const envString = import.meta.env.VITE_TOPIC_RX || ""
  if (!envString) return []
  
  return envString.split(',').map((item: string) => {
    const [id, name] = item.split(':')
    return { id: Number(id), name: name }
  })
}