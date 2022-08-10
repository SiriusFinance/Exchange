import { pairs } from '/constants'
import { fn } from '/utils'

// cache 1 hour
export default fn(async () => ({ pairs }), { maxAge: 3600 })
