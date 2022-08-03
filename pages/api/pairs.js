import { fn } from '../../utils/api'

const pairs = [
  {
    ticker_id: 'WBTC_4WBTC',
    base: 'WBTC',
    target: '4WBTC',
    pool_id: '0xb27157e749d1026a317139BaEf9020CA726b694f'
  },
  {
    ticker_id: 'WETH_4WETH',
    base: 'WETH',
    target: '4WETH',
    pool_id: '0xa1A56912bC682469ce1393557519659a5Fe6C3Fe'
  },
  {
    ticker_id: 'WBNB_4WBNB',
    base: 'WBNB',
    target: '4WBNB',
    pool_id: '0xA5694645c380FeD521aCce3CD8FC0B2D98b30558'
  }
]

export default fn(
  async () => {
    return { pairs }
  },
  {
    maxAge: 60 // 1 min
  }
)
