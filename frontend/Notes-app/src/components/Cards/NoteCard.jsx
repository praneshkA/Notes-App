import React from "react";
import PropTypes from "prop-types";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags = [],
  isPinned,
  onPinNote,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-green-700">
            {moment(date).isValid() ? moment(date).format("Do MMM YYYY") : "Unknown Date"}
          </span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn ${
            isPinned ? "text-[#2B85FF]" : "text-slate-300"
          }`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-xs text-slate-600 mt-2">
        {content?.slice(0, 60) || "No content available"}
      </p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {Array.isArray(tags) && tags.map((item) => `#${item} `)}
        </div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  isPinned: PropTypes.bool.isRequired,
  onPinNote: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteCard;
