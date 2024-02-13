/* eslint-disable @typescript-eslint/no-explicit-any */
import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import jwt_decode from "jwt-decode";
import developFirebaseConfig from '../../firebase-develop.json';
import productionFirebaseConfig from '../../firebase-production.json';

export interface IToken {
    role: string
}

let firebaseConfig: any = developFirebaseConfig;

switch (process.env.VUE_APP_ENVIRONMENT) {
  case 'development':
    firebaseConfig = developFirebaseConfig;
    break;
  case 'production':
    firebaseConfig = productionFirebaseConfig;
    break;
}

initializeApp(firebaseConfig);

const auth = getAuth();

const initializeAuth = new Promise(resolve => {
    onAuthStateChanged(auth,(user) => {
       authService.setUser(user);
       resolve(user);
   });
});

const authService = {
    auth: auth,
    user: null,

    authenticated() {
        return initializeAuth.then((user: any) => {
            return user && !user.isAnonymous;
        });
    },

    async getToken() {
        return this.auth.currentUser?.getIdToken();
    },

    async getRole() {
        const token = await this.getToken();
        const decodedToken: IToken = jwt_decode(token ?? '');
        return decodedToken.role
    },

    checkRoles(roles: string[]) {
        const decodedToken: IToken = jwt_decode(this.user ? this.user['accessToken'] : '');
        return roles.includes(decodedToken.role);
    },

    setUser(user: any) {
        this.user = user;
    },

    async login(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.setUser(userCredential.user);
        } catch (error: any) {
            switch (error['code']) {
                case 'auth/user-not-found':
                    throw new Error("El usuario no ha sido encontrado");
                case 'auth/invalid-email':
                    throw new Error("Ese correo aún no está registrado");
                case "auth/wrong-password":
                    throw new Error("La contraseña es incorrecta");
                case "auth/too-many-requests":
                    throw new Error("¡Muchos intentos en poco tiempo! Inténtalo de nuevo más tarde");
                default:
                    throw new Error("Ha ocurrido un error al iniciar sesión");
            }
        }
    },

    async logout() {
        try {
            await signOut(auth);
            this.setUser(null);
        } catch (e) {
            console.log({e});
        }
    },
}
export default authService;
