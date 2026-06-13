import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "./auth-store";

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.obtenerToken()) {
    return true;
  }

  // NO LOGEADO O NO TIENE TOKEN MANDA AL LOGIN
  return router.parseUrl("/login");
};
