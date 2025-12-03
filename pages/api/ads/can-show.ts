import { apiHandler } from '../../../lib/api-wrapper'
import { shouldShowAds } from '../../../lib/ads'

export default apiHandler(async (req, res) => {
    const showAds = await shouldShowAds(req)
    res.status(200).json({ ok: true, showAds })
})
