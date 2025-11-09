type NotifyLevel = 'info' | 'error'

const notifyLevelMap: Record<NotifyLevel, (data: any) => void> = {
  info: (data) => console.log(data),

  error: (data) => {
    const error = new Error(data)
    console.log(error)
  },
}

interface NotifyParameters {
  /** 通知内容。 */
  data: any
  /** 通知等级。 */
  level?: NotifyLevel
}

/**
 * 通知。
 *
 * @param payload - 参数。
 * @param payload.data - 通知内容。
 * @param payload.level - 通知等级。
 */
export const notify = ({ data, level = 'info' }: NotifyParameters) => {
  const action = notifyLevelMap[level]
  action(data)
}
