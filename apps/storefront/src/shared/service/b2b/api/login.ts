import {
  B3Request,
} from '../../request/b3Fetch'
import {
  RequestType,
} from '../../request/base'

export const getBCToken = (data: CustomFieldItems): CustomFieldItems => B3Request.post('/api/v2/proxy', RequestType.B2BRest, data)