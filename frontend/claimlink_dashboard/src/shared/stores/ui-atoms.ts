import { atom } from "jotai";

/**
 * Atom for managing mobile sidebar/drawer state
 * Controls whether the mobile navigation drawer is open or closed
 */
export const mobileMenuOpenAtom = atom<boolean>(false);
