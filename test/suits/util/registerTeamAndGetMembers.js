import registerTeam from "./registerTeam"

export default async (agent) => {
    const teamData = await registerTeam(agent);
    return teamData.members;
}