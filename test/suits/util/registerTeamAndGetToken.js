import logInUserAndGetToken from "./logInUserAndGetToken";
import registerTeamAndGetUser from "./registerTeamAndGetUser";

export default async (agent) => {
    const user = await registerTeamAndGetUser(agent);
    return await logInUserAndGetToken(agent, user.email, user.password);
}