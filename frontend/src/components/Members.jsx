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
      setMembers(data);
    };

    fetchMembers();
  }, [groupId]);

  return (
    <div className="my-3">
      {members.map((member) => (
        <div className="flex items-center justify-center gap-4 mt-2">
          <ImageZoom
            width={50}
            height={50}
            url={member.profile_picture}
            alt={member.display_name}
            styles="rounded-full"
          />
          <div>
            <h3 className="font-bold tracking-tight text-gray-900">
              <span>{member.display_name}</span>
            </h3>
            <p className="text-gray-500 text-sm">Username: @{member.username}</p>
            <p className="text-gray-500 text-sm">Role: {member.role}</p>
            <p className="font-light text-gray-500 text-sm">
              {formatLastSessionTime(member.last_session)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
