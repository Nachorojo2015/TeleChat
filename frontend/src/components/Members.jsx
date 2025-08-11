import { useEffect } from "react";
import { getMembers } from "../services/groupsService";
import { useState } from "react";
import { formatLastSessionTime } from "../utils/formatLastSessionTime";

const Members = ({ groupId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await getMembers(groupId);
      console.log(data);
      setMembers(data);
    };

    fetchMembers();
  }, [groupId]);

  return (
    <div className="flex flex-col gap-3">
      {members.map((member) => (
        <article key={member.id} className="flex items-center">
          <img
            src={member.profile_picture}
            className="w-14 h-14 rounded-full"
          />
          <div className="ml-4">
            <p>
              {member.display_name} | <b>{member.role}</b>
            </p>
            <p>{formatLastSessionTime(member.last_active)}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Members;
