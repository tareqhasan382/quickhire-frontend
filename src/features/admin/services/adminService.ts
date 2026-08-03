import { delay } from '../../../services/http'
import {
  activity,
  adminApplications,
  adminStats,
  applicationsByMonth,
  jobsByCategory,
  registrationsByMonth,
} from '../data'

export const adminService = {
  getOverview() {
    return delay({
      stats: adminStats,
      recentApplications: adminApplications.slice(0, 5),
      activity,
      analytics: { applicationsByMonth, registrationsByMonth, jobsByCategory },
    })
  },

  getAnalytics() {
    return delay({ applicationsByMonth, registrationsByMonth, jobsByCategory })
  },
}
