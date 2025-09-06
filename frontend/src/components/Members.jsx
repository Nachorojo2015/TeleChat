import { useEffect } from "react";
import { getMembers } from "../services/groupsService";
import { useState } from "react";
import { formatLastSessionTime } from "../utils/formatLastSessionTime";
import ImageZoom from "./ImageZoom";

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
    <div className="flex flex-col items-center gap-3 mt-2 mb-3">
      {members.map((member) => (
        <div class="flex items-center gap-4">
              <ImageZoom width={50} height={50} url={member.profile_picture} alt={member.display_name} styles="rounded-full" />
              <div>
                  <h3 class="text-lg font-bold tracking-tight text-gray-900">
                      <span>{member.display_name}</span>
                  </h3>
                  <p class="text-gray-500 text-sm">Username: @{member.username}</p>
                  <p class="text-gray-500 text-sm">Role: {member.role}</p>
                  <p class="font-light text-gray-500 text-sm">{formatLastSessionTime(member.last_session)}</p>
              </div>
          </div> 
      ))}
    </div>
  );
};

export default Members;
