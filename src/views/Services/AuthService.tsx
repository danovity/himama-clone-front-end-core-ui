import Cookies from "js-cookie";

export class AuthService {
  static loggedIn() {
    const emailAddress = Cookies.get("emailAddress");
    if (emailAddress) {
      return true;
    }
    return false;
  }
}
