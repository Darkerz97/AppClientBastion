import { getCurrentCustomer, updateCustomerProfile } from './authClientService'

export async function getCustomerProfile() {
  return getCurrentCustomer()
}

export async function updateProfile(payload) {
  return updateCustomerProfile(payload)
}
