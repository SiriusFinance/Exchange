import { fn } from '../../utils'
import { pairs } from '../../constants'

// cache 1 hour
export default fn(async () => ({ pairs }), { maxAge: 3600 })
