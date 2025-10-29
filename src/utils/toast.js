import { useToast } from 'vue-toast-notification'

export const showToast = {
  success(message) {
    const toast = useToast()
    toast.success(message)
  },

  error(message) {
    const toast = useToast()
    toast.error(message)
  },

  warning(message) {
    const toast = useToast()
    toast.warning(message)
  },

  info(message) {
    const toast = useToast()
    toast.info(message)
  },
}
