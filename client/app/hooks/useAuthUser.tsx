import { useSelector } from 'react-redux';

export default function useAuthUser() {
    const { user, isLoggedIn } = useSelector((state: any) => state.auth);
    if (user && isLoggedIn) {
        return user;
    } else {
        return null;
    }
}
