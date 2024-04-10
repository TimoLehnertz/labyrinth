"use client";

import { useRouter } from "next/navigation";

function getCookie(name: string) {
  return document.cookie.split(";").some((c) => {
    return c.trim().startsWith(name + "=");
  });
}

function deleteCookie(name: string, path: string = "/", domain?: string) {
  if (getCookie(name)) {
    document.cookie =
      name +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

export default function Logout() {
  const router = useRouter();
  const logout = () => {
    console.log("logout");
    localStorage.removeItem("jwt");
    deleteCookie("jwt");
    router.push("/");
    router.refresh();
  };
  return <button onClick={logout}>Logout</button>;
}
