import { useSelector } from "react-redux";
import { Outlet , Navigate } from "react-router-dom";

export default function OnlyTeamPrivateRoute() {
    const {currentUser} = useSelector((state) => state.user)
  return currentUser && currentUser.isTeam ? <Outlet/>:<Navigate to ='/sign-in'/>
}