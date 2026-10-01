// Update the previous root-scoped draft-app worker when returning visitors arrive.
// Draft state in localStorage is preserved and remains available to /fantasy-draft/.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      if (registration.scope === `${location.origin}/`) registration.update().catch(() => {});
    }
  }).catch(() => {});
}
