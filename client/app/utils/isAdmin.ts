import { ROLE } from '../constants/enum';

export const isAdminAuth = (user: any) => {
    return user?.role === ROLE.ADMIN;
};
